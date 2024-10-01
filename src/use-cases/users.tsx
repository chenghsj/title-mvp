import { getTranslations } from 'next-intl/server';
import { Role } from '@/app/_root/types';
import { GoogleUser } from '@/app/api/login/google/callback/route';
import {
  EducationFormSchemaType,
  JobExperienceFormSchemaType,
} from '@/app/dashboard/profile/form-schema';
import { ProfileImage } from '@/app/dashboard/profile/types';
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from '@/config/app';
import {
  createAccount,
  createAccountViaGoogle,
  getAccountByUserId,
} from '@/data-access/accounts';
import {
  createEducation,
  deleteEducation,
  getEducation,
  updateEducation,
} from '@/data-access/educations';
import {
  createJobExperience,
  deleteJobExperience,
  getJobExperience,
  updateJobExperience,
} from '@/data-access/job-experiences';
import {
  createProfile,
  getProfile,
  updateProfile,
} from '@/data-access/profiles';
import { getResume } from '@/data-access/resumes';
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  updateUser,
  verifyPassword,
} from '@/data-access/users';
import {
  deleteVerifyEmailOTP,
  verifyEmailOTP,
} from '@/data-access/verify-email';
import { getVideo } from '@/data-access/videos';
import {
  deleteDirectoryFromBucket,
  deleteFileFromBucket,
  getFileUrl,
  uploadFileToBucket,
} from '@/lib/files';
import { assertAuthenticated } from '@/lib/session';
import { createUUID } from '@/lib/uuid';
import { sendEmailOTPUseCase } from './email-otp';
import {
  EmailVerificationError,
  NotFoundError,
  PublicError,
  RoleError,
} from './errors';
import { UserId } from './types';

export async function deleteUserUseCase(userId: UserId): Promise<void> {
  await deleteProfileImagesUseCase(userId);
  await deleteUser(userId);
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
  const tErrorMessages = await getTranslations('errorMessages');
  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.emailVerified) {
    throw new PublicError(tErrorMessages('public.userAlreadyExists'));
  }

  let user = existingUser;

  if (!existingUser && role) {
    user = await createUser(email);
    await createAccount(user.id, password, role);

    // const displayName = uniqueNamesGenerator({
    //   dictionaries: [colors, animals],
    //   separator: ' ',
    //   style: 'capital',
    // });
    await createProfile(user.id, email);
  }

  await sendEmailOTPUseCase(user!.id, email);

  return { id: user?.id };
}

export async function signInUseCase(
  email: string,
  password: string,
  role: Role
) {
  const tErrorMessages = await getTranslations('errorMessages');
  const user = await getUserByEmail(email);

  if (!user) {
    throw new PublicError(tErrorMessages('userNotFound'));
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new PublicError(tErrorMessages('invalidPassword'));
  }

  if (!user.emailVerified) {
    throw new EmailVerificationError(tErrorMessages('verifyEmail.notVerified'));
  }

  if (user) {
    const account = await getAccountByUserId(user.id);
    if (account?.role !== role) {
      throw await RoleError.create(account?.role!);
    }
  }

  return user;
}

export async function getUserUseCase() {
  const user = await assertAuthenticated();
  const userById = await getUserById(user.id);

  return userById;
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new NotFoundError();
  }

  return profile;
}

export async function getDashboardProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new NotFoundError();
  }

  const educations = await getEducation(userId);
  const jobExperiences = await getJobExperience(userId);
  const avatarUrl = profile?.imageId
    ? getProfileImageUrl(userId, profile.imageId)
    : null;
  const coverUrl = profile?.coverId
    ? getProfileImageUrl(userId, profile.coverId)
    : null;
  const resumes = await getResume(userId);
  const videos = await getVideo(userId);

  return {
    profile,
    educations,
    jobExperiences,
    avatarUrl,
    coverUrl,
    resumes,
    videos,
  };
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
 * Profile
 */
export async function createEducationUseCase(
  userId: UserId,
  input: EducationFormSchemaType
) {
  await createEducation({
    ...input,
    userId,
    description: input.description ?? null,
    startDate: input.startDate.toLocaleDateString(),
    endDate: input.endDate?.toLocaleDateString() ?? null,
  });
}

export async function updateEducationUseCase(
  userId: UserId,
  educationId: number,
  input: EducationFormSchemaType
) {
  await updateEducation(userId, educationId, {
    ...input,
    startDate: input.startDate.toLocaleDateString(),
    endDate: input.endDate?.toLocaleDateString() ?? null,
  });
}

export async function deleteEducationUseCase(
  userId: UserId,
  educationId: number
) {
  await deleteEducation(userId, educationId);
}

export async function createJobExperienceUseCase(
  userId: UserId,
  input: JobExperienceFormSchemaType
) {
  await createJobExperience({
    ...input,
    userId,
    description: input.description ?? null,
    startDate: input.startDate.toLocaleDateString(),
    endDate: input.endDate?.toLocaleDateString() ?? null,
  });
}

export async function updateJobExperienceUseCase(
  userId: UserId,
  jobExperienceId: number,
  input: JobExperienceFormSchemaType
) {
  await updateJobExperience(userId, jobExperienceId, {
    ...input,
    startDate: input.startDate.toLocaleDateString(),
    endDate: input.endDate?.toLocaleDateString() ?? null,
  });
}

export async function deleteJobExperienceUseCase(
  userId: UserId,
  jobExperienceId: number
) {
  await deleteJobExperience(userId, jobExperienceId);
}

export async function updateDisplayNameUseCase(
  userId: UserId,
  displayName: string
) {
  await updateProfile(userId, { displayName });
}

/**
 * IMAGE UPLOAD
 */
export function getProfileImageKey(userId: UserId, imageId: string) {
  return `users/${userId}/images/${imageId}`;
}

export function getProfileCoverKey(userId: UserId, coverId: string) {
  return `users/${userId}/images/${coverId}`;
}

export async function updateProfileImageUseCase(
  file: File,
  userId: UserId,
  type: ProfileImage
) {
  if (!file.type.startsWith('image/')) {
    throw new PublicError('File should be an image.');
  }

  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`
    );
  }

  const imageId = createUUID();

  const oldImageId = (await getProfile(userId))?.[
    type === 'avatar' ? 'imageId' : 'coverId'
  ];

  if (oldImageId) {
    await deleteFileFromBucket(getProfileImageKey(userId, oldImageId));
  }

  await uploadFileToBucket(file, getProfileImageKey(userId, imageId));
  await updateProfile(
    userId,
    type === 'avatar' ? { imageId: imageId } : { coverId: imageId }
  );
}

export async function deleteProfileImageUseCase(
  userId: UserId,
  type: ProfileImage
) {
  const imageId = (await getProfile(userId))?.[
    type === 'avatar' ? 'imageId' : 'coverId'
  ];
  if (imageId) {
    await deleteFileFromBucket(getProfileImageKey(userId, imageId));
  }
  await updateProfile(
    userId,
    type === 'avatar' ? { imageId: null } : { coverId: null }
  );
}

export async function deleteProfileImagesUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (profile) {
    await deleteDirectoryFromBucket(`users/${userId}`);
  }
}

export function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${process.env.HOST_NAME}/api/users/${userId}/images/${imageId}`;
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
