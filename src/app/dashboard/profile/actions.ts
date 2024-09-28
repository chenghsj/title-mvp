'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { rateLimitByKey } from '@/lib/limiter';
import { authenticatedAction } from '@/lib/safe-action';
import {
  createEducationUseCase,
  createJobExperienceUseCase,
  deleteEducationUseCase,
  deleteJobExperienceUseCase,
  deleteProfileImageUseCase,
  updateDisplayNameUseCase,
  updateEducationUseCase,
  updateJobExperienceUseCase,
  updateProfileImageUseCase,
} from '@/use-cases/users';
import {
  DisplayNameSchema,
  EducationFormSchema,
  JobExperienceFormSchema,
} from './form-schema';
import { profileImageType } from './types';

/**
 * Education actions
 */
export const createEducationAction = authenticatedAction
  .createServerAction()
  .input(EducationFormSchema)
  .handler(async ({ input, ctx }) => {
    await createEducationUseCase(ctx.user.id, input);
    revalidatePath('/dashboard/profile');
  });

export const updateEducationAction = authenticatedAction
  .createServerAction()
  .input(EducationFormSchema)
  .handler(async ({ input, ctx }) => {
    await updateEducationUseCase(ctx.user.id, input.educationId!, input);
    revalidatePath('/dashboard/profile');
  });

export const deleteEducationAction = authenticatedAction
  .createServerAction()
  .input(z.object({ educationId: z.number() }))
  .handler(async ({ input, ctx }) => {
    await deleteEducationUseCase(ctx.user.id, input.educationId);
    revalidatePath('/dashboard/profile');
  });

/**
 * Job actions
 */
export const createJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(JobExperienceFormSchema)
  .handler(async ({ input, ctx }) => {
    await createJobExperienceUseCase(ctx.user.id, input);
    revalidatePath('/dashboard/profile');
  });

export const updateJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(JobExperienceFormSchema)
  .handler(async ({ input, ctx }) => {
    await updateJobExperienceUseCase(
      ctx.user.id,
      input.jobExperienceId!,
      input
    );
    revalidatePath('/dashboard/profile');
  });

export const deleteJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(z.object({ jobExperienceId: z.number() }))
  .handler(async ({ input, ctx }) => {
    await deleteJobExperienceUseCase(ctx.user.id, input.jobExperienceId);
    revalidatePath('/dashboard/profile');
  });

export const updateDisplayNameAction = authenticatedAction
  .createServerAction()
  .input(DisplayNameSchema)
  .handler(async ({ input, ctx }) => {
    await updateDisplayNameUseCase(ctx.user.id, input.displayName);
    revalidatePath('/dashboard/profile');
  });

export const updateProfileImageAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      fileWrapper: z.instanceof(FormData),
      type: z.enum(profileImageType),
    })
  )
  .handler(async ({ input, ctx }) => {
    await rateLimitByKey({
      key: `update-profile-image-${ctx.user.id}`,
      limit: 3,
      window: 60000,
    });
    const file = input.fileWrapper.get('file') as File;
    await updateProfileImageUseCase(file, ctx.user.id, input.type);
    revalidatePath(`/dashboard/profile`);
  });

export const deleteProfileImageAction = authenticatedAction
  .createServerAction()
  .input(z.object({ type: z.enum(profileImageType) }))
  .handler(async ({ input, ctx }) => {
    await deleteProfileImageUseCase(ctx.user.id, input.type);
    revalidatePath(`/dashboard/profile`);
  });
