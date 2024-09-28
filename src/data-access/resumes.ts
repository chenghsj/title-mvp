import { and, eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Resume, resumes } from '@/db/schema';
import { UserId } from '@/use-cases/types';

export async function createResume(
  userId: UserId,
  title: string,
  bio?: string,
  educationId?: number | null,
  jobExperienceId?: number | null,
  trx = db
) {
  const [resume] = await trx
    .insert(resumes)
    .values({
      userId,
      bio,
      title,
      educationId,
      jobExperienceId,
    })
    .onConflictDoNothing()
    .returning();
  return resume;
}

export async function updateResume(
  userId: UserId,
  resumeId: number,
  updateResume: Partial<Resume>,
  trx = db
) {
  await trx
    .update(resumes)
    .set(updateResume)
    .where(and(eq(resumes.userId, userId), eq(resumes.id, resumeId)));
}

export async function getResume(userId: UserId) {
  const resume = await db.query.resumes.findMany({
    where: eq(resumes.userId, userId),
  });

  return resume;
}

export async function getResumeById(userId: UserId, resumeId: number) {
  const resume = await db.query.resumes.findFirst({
    where: and(eq(resumes.userId, userId), eq(resumes.id, resumeId)),
  });
  return resume;
}

export async function deleteResume(userId: UserId, resumeId: number) {
  await db
    .delete(resumes)
    .where(and(eq(resumes.userId, userId), eq(resumes.id, resumeId)));
}
