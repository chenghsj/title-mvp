import { ResumeFormSchemaType } from '@/app/dashboard/resume/form-schema';
import { createResume, deleteResume } from '@/data-access/resumes';
import { createTransaction } from '@/data-access/utils';
import { createVideo } from '@/data-access/videos';
import { UserId } from './types';

export const createResumeUseCase = async ({
  userId,
  title,
  bio,
  url,
}: {
  userId: UserId;
} & ResumeFormSchemaType) => {
  await createTransaction(async (trx) => {
    const resume = await createResume(userId, bio, title, trx);
    const video = await createVideo(userId, resume.id, url, trx);
  });
};

export const deleteResumeUseCase = async (userId: UserId, resumeId: number) => {
  await deleteResume(userId, resumeId);
};
