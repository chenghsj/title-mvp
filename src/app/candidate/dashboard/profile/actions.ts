'use server';

import { getTranslations } from 'next-intl/server';
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
import { getDeletedMessageByType, getTranslationsByType } from './utils';

/**
 * Education actions
 */
export const createEducationAction = authenticatedAction
  .createServerAction()
  .input(async () => EducationFormSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType('education', 'create');
    await createEducationUseCase(ctx.user.id, input);
    revalidatePath('/candidate/dashboard/profile');
    return { message: successMessage };
  });

export const updateEducationAction = authenticatedAction
  .createServerAction()
  .input(async () => EducationFormSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType('education', 'update');
    await updateEducationUseCase(ctx.user.id, input.educationId!, input);
    revalidatePath('/candidate/dashboard/profile');
    return { message: successMessage };
  });

export const deleteEducationAction = authenticatedAction
  .createServerAction()
  .input(z.object({ educationId: z.number() }))
  .handler(async ({ input, ctx, responseMeta }) => {
    await deleteEducationUseCase(ctx.user.id, input.educationId);
    revalidatePath('/candidate/dashboard/profile');

    const successMessage = await getDeletedMessageByType('education');
    return { message: successMessage };
  });

/**
 * Job actions
 */
export const createJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(async () => JobExperienceFormSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType(
      'jobExperience',
      'create'
    );
    await createJobExperienceUseCase(ctx.user.id, input);
    revalidatePath('/candidate/dashboard/profile');
    return {
      message: successMessage,
    };
  });

export const updateJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(async () => JobExperienceFormSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType(
      'jobExperience',
      'update'
    );
    await updateJobExperienceUseCase(
      ctx.user.id,
      input.jobExperienceId!,
      input
    );
    revalidatePath('/candidate/dashboard/profile');
    return {
      message: successMessage,
    };
  });

export const deleteJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(z.object({ jobExperienceId: z.number() }))
  .handler(async ({ input, ctx }) => {
    await deleteJobExperienceUseCase(ctx.user.id, input.jobExperienceId);
    revalidatePath('/candidate/dashboard/profile');

    const successMessage = await getDeletedMessageByType('jobExperience');
    return { message: successMessage };
  });

export const updateDisplayNameAction = authenticatedAction
  .createServerAction()
  .input(async () => DisplayNameSchema(await getTranslations('zod')))
  .handler(async ({ input, ctx }) => {
    const successMessage = await getTranslationsByType('displayName', 'update');
    await updateDisplayNameUseCase(ctx.user.id, input.displayName);
    revalidatePath('/candidate/dashboard/profile');
    return {
      message: successMessage,
    };
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
    const successMessage = await getTranslationsByType('image', 'update');
    const file = input.fileWrapper.get('file') as File;
    await updateProfileImageUseCase(file, ctx.user.id, input.type);
    revalidatePath(`/candidate/dashboard/profile`);
    return {
      message: successMessage,
    };
  });

export const deleteProfileImageAction = authenticatedAction
  .createServerAction()
  .input(z.object({ type: z.enum(profileImageType) }))
  .handler(async ({ input, ctx }) => {
    await deleteProfileImageUseCase(ctx.user.id, input.type);
    revalidatePath(`/candidate/dashboard/profile`);

    const successMessage = await getDeletedMessageByType('image');
    return { message: successMessage };
  });
