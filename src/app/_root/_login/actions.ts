'use server';

import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateCodeVerifier, generateState } from 'arctic';
import { z } from 'zod';
import { afterCandidateLoginUrl, afterCompanyLoginUrl } from '@/config/site';
import { getUserByEmail } from '@/data-access/users';
import { googleProvider } from '@/lib/auth';
import { rateLimitByIp, rateLimitByKey } from '@/lib/limiter';
import { unauthenticatedAction } from '@/lib/safe-action';
import { setSession } from '@/lib/session';
import { sendEmailOTPUseCase } from '@/use-cases/email-otp';
import { PublicError } from '@/use-cases/errors';
import {
  registerUserUseCase,
  signInUseCase,
  verifyEmailOTPUseCase,
} from '@/use-cases/users';
import { RoleTypeEnum } from '../types';
import { SignInFormSchema, SignUpFormSchema } from './form-schema';

export const googleOAuthAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ role: z.enum(RoleTypeEnum) }))
  .handler(async ({ input }) => {
    const role = input.role;

    if (!role) {
      throw new PublicError('Role query parameter is missing');
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await googleProvider.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ['profile', 'email'],
      }
    );
    // url.searchParams.set('prompt', 'consent');

    cookies().set('google_oauth_state', state, {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    });

    cookies().set('google_code_verifier', codeVerifier, {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    });

    cookies().set('user_role', role, {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    });

    return {
      url: url.toString(),
    };
  });

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(SignUpFormSchema)
  .handler(async ({ input }) => {
    const tComponentsToast = await getTranslations('components.toast');
    await rateLimitByIp({ key: 'register', limit: 3, window: 30000 });
    const user = await registerUserUseCase(
      input.email,
      input.password,
      input.role
    );
    return {
      isSignUp: true,
      message: {
        title: tComponentsToast('success.loginForm.title'),
        description: tComponentsToast('success.loginForm.description'),
      },
    };
  });

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(SignInFormSchema)
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10_000 });
    const user = await signInUseCase(input.email, input.password, input.role);
    await setSession(user.id);
    redirect(
      input.role === 'candidate' ? afterCandidateLoginUrl : afterCompanyLoginUrl
    );
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
    const tComponentsToast = await getTranslations('components.toast');
    await rateLimitByKey({ key: 'verify-email-otp', limit: 3, window: 10_000 });
    const userId = await verifyEmailOTPUseCase(input.email, input.OTP);
    await setSession(userId);

    return {
      message: {
        title: tComponentsToast('success.inputOTPDialog.title'),
        description: tComponentsToast('success.inputOTPDialog.description'),
      },
    };
  });

export const sendEmailOTPAction = unauthenticatedAction
  .createServerAction()
  .input(SignInFormSchema)
  .handler(async ({ input }) => {
    const tComponentsToast = await getTranslations('components.toast');
    await rateLimitByKey({ key: input.email, limit: 3, window: 10_000 });
    const user = await getUserByEmail(input.email);
    await sendEmailOTPUseCase(user?.id!, user?.email!);

    return {
      message: {
        title: tComponentsToast('success.loginForm.title'),
        description: tComponentsToast('success.loginForm.description'),
      },
    };
  });
