import { alphabet, generateRandomString } from 'oslo/crypto';
import { insertEmailOTP } from '@/data-access/verify-email';
import { VerifyIdentityEmail } from '@/emails/verify-email';
import { sendEmail } from '@/lib/send-email';
import { UserId } from './types';

export const sendEmailOTPUseCase = async (userId: UserId, email: string) => {
  const validationCode = generateRandomString(6, alphabet('0-9'));

  await sendEmail(
    email,
    `Verify your email for Title`,
    <VerifyIdentityEmail validationCode={validationCode} />
  );

  await insertEmailOTP(userId, email, validationCode);
};
