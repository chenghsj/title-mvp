import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { Role } from '@/app/_root/types';
import { GoogleUser } from '@/app/api/login/google/callback/route';
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from '@/config/app';
import { createAccount, createAccountViaGoogle } from '@/data-access/accounts';
import {
  createProfile,
  getProfile,
  updateProfile,
} from '@/data-access/profiles';
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from '@/data-access/users';
import {
  deleteVerifyEmailOTP,
  verifyEmailOTP,
} from '@/data-access/verify-email';
import { getFileUrl, uploadFileToBucket } from '@/lib/files';
import { createUUID } from '@/utils/uuid';
import { sendEmailOTPUseCase } from './email-otp';
import {
  EmailVerificationError,
  NotFoundError,
  PublicError,
  errorMessages,
} from './errors';
import { UserId, UserSession } from './types';

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError('You can only delete your own account');
  }

  await deleteUser(userToDeleteId);
}

export async function createGoogleUserUseCase(
  googleUser: GoogleUser,
  role: Role
) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email, new Date());
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub, role);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function registerUserUseCase(
  email: string,
  password: string,
  role?: Role
) {
  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.emailVerified) {
    throw new PublicError('An user with that email already exists.');
  }

  let user = existingUser;

  if (!existingUser && role) {
    user = await createUser(email);
    await createAccount(user.id, password, role);

    const displayName = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: ' ',
      style: 'capital',
    });
    await createProfile(user.id, displayName);
  }

  await sendEmailOTPUseCase(user!.id, email);

  return { id: user?.id };
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new PublicError('User not found');
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new PublicError('Invalid password');
  }

  if (!user.emailVerified) {
    throw new EmailVerificationError(errorMessages.verifyEmail.notVerified);
  }

  return user;
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new NotFoundError();
  }

  return profile;
}

export async function verifyEmailOTPUseCase(email: string, OTP: string) {
  const result = await verifyEmailOTP(email, OTP);
  if (!result?.success) {
    throw new PublicError(result?.message);
  }

  const userId = result.userId!;

  await updateUser(userId, { emailVerified: new Date() });
  await deleteVerifyEmailOTP(email);
  return userId;
}

/**
 * IMAGE UPLOAD
 */
export function getProfileImageKey(userId: UserId, imageId: string) {
  return `users/${userId}/images/${imageId}`;
}

export async function updateProfileImageUseCase(file: File, userId: UserId) {
  if (!file.type.startsWith('image/')) {
    throw new PublicError('File should be an image.');
  }

  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`
    );
  }

  const imageId = createUUID();

  await uploadFileToBucket(file, getProfileImageKey(userId, imageId));
  await updateProfile(userId, { imageId });
}

export function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${process.env.HOST_NAME}/api/users/${userId}/images/${imageId ?? 'default'}`;
}

export function getDefaultImage(userId: UserId) {
  return `${process.env.HOST_NAME}/api/users/${userId}/images/default`;
}

export async function getProfileImageUrlUseCase({
  userId,
  imageId,
}: {
  userId: UserId;
  imageId: string;
}) {
  const url = await getFileUrl({
    key: getProfileImageKey(userId, imageId),
  });

  return url;
}
