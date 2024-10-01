'use server';

import { getTranslations } from 'next-intl/server';
import { eq } from 'drizzle-orm';
import { OTP_TTL } from '@/config/app';
import { db } from '@/db/drizzle';
import { emailVerificationOTPs } from '@/db/schema';
import { PublicError } from '@/use-cases/errors';

export async function insertEmailOTP(
  userId: string,
  email: string,
  OTP: string
) {
  const OTPExpiresAt = new Date(Date.now() + OTP_TTL);
  // Remove any existing codes for this user
  await db
    .delete(emailVerificationOTPs)
    .where(eq(emailVerificationOTPs.userId, userId));

  // Insert the new code into the database
  await db.insert(emailVerificationOTPs).values({
    userId,
    email,
    OTP,
    expiresAt: OTPExpiresAt, // 5 minutes expiry
  });
}

export const verifyEmailOTP = async (email: string, OTP: string) => {
  const tLoginSuccessVerifyEmail = await getTranslations(
    'login.success.verifyEmail'
  );
  const tErrorMessages = await getTranslations('errorMessages');
  try {
    const existingUser = await db.query.emailVerificationOTPs.findFirst({
      where: eq(emailVerificationOTPs.email, email),
    });
    if (!existingUser) {
      return {
        success: false,
        message: tErrorMessages('userNotFound'),
      };
    }

    if (existingUser?.OTP !== OTP) {
      return {
        success: false,
        message: tErrorMessages('verifyEmail.invalid'),
      };
    }

    if (existingUser?.expiresAt < new Date()) {
      return {
        success: false,
        message: tErrorMessages('verifyEmail.expired'),
      };
    }

    return {
      userId: existingUser.userId,
      success: true,
      message: tLoginSuccessVerifyEmail('verified'),
    };
  } catch (error) {
    console.error(error);
    throw new PublicError(tErrorMessages('verifyEmail.failedToValidate'));
  }
};

export async function deleteVerifyEmailOTP(email: string) {
  await db
    .delete(emailVerificationOTPs)
    .where(eq(emailVerificationOTPs.email, email));
}
