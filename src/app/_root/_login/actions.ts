'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { afterLoginUrl } from '@/config/site';
import { getUserByEmail } from '@/data-access/users';
import { rateLimitByIp, rateLimitByKey } from '@/lib/limiter';
import { unauthenticatedAction } from '@/lib/safe-action';
import { setSession } from '@/lib/session';
import { sendEmailOTPUseCase } from '@/use-cases/email-otp';
import {
  registerUserUseCase,
  signInUseCase,
  verifyEmailOTPUseCase,
} from '@/use-cases/users';
import { SignInFormSchema, SignUpFormSchema } from './form-schema';

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(SignUpFormSchema)
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: 'register', limit: 3, window: 30000 });
    const user = await registerUserUseCase(
      input.email,
      input.password,
      input.role
    );
  });

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(SignInFormSchema)
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10_000 });
    const user = await signInUseCase(input.email, input.password);
    await setSession(user.id);
    redirect(afterLoginUrl);
  });

export const verifyEmailOTPAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      OTP: z.string().length(6),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: 'verify-email-otp', limit: 3, window: 10_000 });
    const userId = await verifyEmailOTPUseCase(input.email, input.OTP);
    await setSession(userId);
    return redirect(afterLoginUrl);
  });

export const sendEmailOTPAction = unauthenticatedAction
  .createServerAction()
  .input(SignInFormSchema)
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10_000 });
    const user = await getUserByEmail(input.email);
    await sendEmailOTPUseCase(user?.id!, user?.email!);
    return { email: input.email };
  });
