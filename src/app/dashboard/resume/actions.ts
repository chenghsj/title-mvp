'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateResume } from '@/data-access/resumes';
import { createTransaction } from '@/data-access/utils';
import { updateVideo } from '@/data-access/videos';
import { authenticatedAction } from '@/lib/safe-action';
import { getCurrentUser } from '@/lib/session';
import { createResumeUseCase, deleteResumeUseCase } from '@/use-cases/resumes';
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
    await createTransaction(async (trx) => {
      await updateResume(user?.id!, input.resumeId!, input, trx);
      await updateVideo(user?.id!, input.resumeId!, { url: input.url }, trx);
    });
    revalidatePath('/dashboard/resume');
  });
