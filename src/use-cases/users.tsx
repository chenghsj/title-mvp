import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { Role } from '@/app/_root/types';
import { GoogleUser } from '@/app/api/login/google/callback/route';
import { createAccount, createAccountViaGoogle } from '@/data-access/accounts';
import { createProfile, getProfile } from '@/data-access/profiles';
import {
  createUser,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from '@/data-access/users';
import {
  deleteVerifyEmailOTP,
  verifyEmailOTP,
} from '@/data-access/verify-email';
import { sendEmailOTPUseCase } from './email-otp';
import {
  EmailVerificationError,
  NotFoundError,
  PublicError,
  errorMessages,
} from './errors';
import { UserId } from './types';

export async function createGoogleUserUseCase(
  googleUser: GoogleUser,
  role: Role
) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
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
