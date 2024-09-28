'use server';

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

export const createResumeAction = authenticatedAction
  .createServerAction()
  .input(ResumeFormSchema)
  .handler(async ({ input, ctx }) => {
    await createResumeUseCase({
      userId: ctx.user.id,
      ...input,
    });
    revalidatePath('/dashboard/resume');
  });

export const deleteResumeAction = authenticatedAction
  .createServerAction()
  .input(z.object({ resumeId: z.number() }))
  .handler(async ({ input, ctx }) => {
    await deleteResumeUseCase(ctx.user.id, input.resumeId);
    revalidatePath('/dashboard/resume');
    redirect('/dashboard/resume');
  });

export const updateResumeAction = authenticatedAction
  .createServerAction()
  .input(ResumeFormSchema)
  .handler(async ({ input, ctx }) => {
    await updateResumeUseCase({
      userId: ctx.user.id,
      ...input,
    });
    revalidatePath('/dashboard/resume');
  });
