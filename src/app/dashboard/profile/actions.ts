'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createEducation,
  deleteEducation,
  updateEducation,
} from '@/data-access/educations';
import {
  createJobExperience,
  deleteJobExperience,
  updateJobExperience,
} from '@/data-access/job-experiences';
import { authenticatedAction } from '@/lib/safe-action';
import { getCurrentUser } from '@/lib/session';
import { EducationFormSchema, JobExperienceFormSchema } from './form-schema';

/**
 * Education actions
 */
export const createEducationAction = authenticatedAction
  .createServerAction()
  .input(EducationFormSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    await createEducation({
      userId: user?.id!,
      degree: input.degree,
      description: input.description || null,
      endDate: input.endDate || null,
      institution: input.institution,
      startDate: input.startDate,
      fieldOfStudy: input.fieldOfStudy,
    });

    revalidatePath('/dashboard/profile');
  });

export const updateEducationAction = authenticatedAction
  .createServerAction()
  .input(EducationFormSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    await updateEducation(user?.id!, input.educationId!, {
      ...input,
      startDate: input.startDate.toISOString(),
      endDate: input.endDate?.toISOString() || null,
    });

    revalidatePath('/dashboard/profile');
  });

export const deleteEducationAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string(), educationId: z.number() }))
  .handler(async ({ input }) => {
    await deleteEducation(input.userId, input.educationId);

    revalidatePath('/dashboard/profile');
  });

/**
 * Job actions
 */

export const createJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(JobExperienceFormSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    await createJobExperience({
      userId: user?.id!,
      title: input.title,
      company: input.company,
      employmentType: input.employmentType,
      skill: input.skill || [],
      description: input.description || null,
      endDate: input.endDate || null,
      startDate: input.startDate,
    });

    revalidatePath('/dashboard/profile');
  });

export const updateJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(JobExperienceFormSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    await updateJobExperience(user?.id!, input.jobExperienceId!, {
      ...input,
      startDate: input.startDate.toISOString(),
      endDate: input.endDate?.toISOString() || null,
    });

    revalidatePath('/dashboard/profile');
  });

export const deleteJobExperienceAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string(), jobExperienceId: z.number() }))
  .handler(async ({ input }) => {
    await deleteJobExperience(input.userId, input.jobExperienceId);

    revalidatePath('/dashboard/profile');
  });
