'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { getCurrentUser } from '@/lib/session';
import {
  createResumeUseCase,
  deleteResumeUseCase,
  updateResumeUseCase,
} from '@/use-cases/resumes';
import { ResumeFormSchema } from './form-schema';

export const createResumeAction = authenticatedAction
  .createServerAction()
  .input(ResumeFormSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    await createResumeUseCase({
      userId: user?.id!,
      ...input,
    });
    revalidatePath('/dashboard/resume');
  });

export const deleteResumeAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string(), resumeId: z.number() }))
  .handler(async ({ input }) => {
    await deleteResumeUseCase(input.userId, input.resumeId);
    revalidatePath('/dashboard/resume');
  });

export const updateResumeAction = authenticatedAction
  .createServerAction()
  .input(ResumeFormSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    await updateResumeUseCase({
      userId: user?.id!,
      ...input,
    });
    revalidatePath('/dashboard/resume');
  });
