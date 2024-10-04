import { ResumeFormSchemaType } from '@/app/candidate/dashboard/resume/form-schema';
import {
  createResume,
  deleteResume,
  updateResume,
} from '@/data-access/resumes';
import { createTransaction } from '@/data-access/utils';
import { createVideo, updateVideo } from '@/data-access/videos';
import { UserId } from './types';

export const createResumeUseCase = async ({
  userId,
  title,
  bio,
  url,
  educationId,
  jobExperienceId,
}: {
  userId: UserId;
} & ResumeFormSchemaType) => {
  await createTransaction(async (trx) => {
    const resume = await createResume(
      userId,
      title,
      bio,
      educationId,
      jobExperienceId,
      trx
    );
    const video = await createVideo(userId, resume.id, url, trx);
  });
};

export const updateResumeUseCase = async ({
  userId,
  ...input
}: {
  userId: UserId;
} & ResumeFormSchemaType) => {
  await createTransaction(async (trx) => {
    await updateResume(userId, input.resumeId!, input, trx);
    await updateVideo(userId, input.resumeId!, { url: input.url }, trx);
  });
};

export const deleteResumeUseCase = async (userId: UserId, resumeId: number) => {
  await deleteResume(userId, resumeId);
};
