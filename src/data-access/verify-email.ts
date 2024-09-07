'use server';

import { eq } from 'drizzle-orm';
import { OTP_TTL } from '@/config/app';
import { db } from '@/db/drizzle';
import { emailVerificationOTPs } from '@/db/schema';
import { PublicError, errorMessages } from '@/use-cases/errors';

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
  try {
    const existingUser = await db.query.emailVerificationOTPs.findFirst({
      where: eq(emailVerificationOTPs.email, email),
    });
    if (!existingUser) {
      return {
        success: false,
        message: errorMessages.verifyEmail.notFound,
      };
    }

    if (existingUser?.OTP !== OTP) {
      return {
        success: false,
        message: errorMessages.verifyEmail.invalid,
      };
    }

    if (existingUser?.expiresAt < new Date()) {
      return {
        success: false,
        message: errorMessages.verifyEmail.expired,
      };
    }

    return {
      userId: existingUser.userId,
      success: true,
      message: 'OTP validated successfully!',
    };
  } catch (error) {
    console.error(error);
    throw new PublicError('Failed to validate OTP!');
  }
};

export async function deleteVerifyEmailOTP(email: string) {
  await db
    .delete(emailVerificationOTPs)
    .where(eq(emailVerificationOTPs.email, email));
}
