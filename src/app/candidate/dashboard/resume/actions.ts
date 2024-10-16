'use server';

import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import {
  createResumeUseCase,
  deleteResumeUseCase,
  updateResumeUseCase,
} from '@/use-cases/resumes';
import { ResumeFormSchema } from './form-schema';
import { getTranslationsByType } from './utils';

export const createResumeAction = authenticatedAction
  .createServerAction()
  .input(async () => ResumeFormSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType('create');
    await createResumeUseCase({
      userId: ctx.user.id,
      ...input,
    });
    revalidatePath('/candidate/dashboard/resume');
    return { message: successMessage };
  });

export const deleteResumeAction = authenticatedAction
  .createServerAction()
  .input(z.object({ resumeId: z.number() }))
  .handler(async ({ input, ctx }) => {
    await deleteResumeUseCase(ctx.user.id, input.resumeId);
    revalidatePath('/candidate/dashboard/resume');
    redirect('/candidate/dashboard/resume');
  });

export const updateResumeAction = authenticatedAction
  .createServerAction()
  .input(async () => ResumeFormSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType('update');
    await updateResumeUseCase({
      userId: ctx.user.id,
      ...input,
    });
    revalidatePath('/candidate/dashboard/resume');
    return { message: successMessage };
  });
