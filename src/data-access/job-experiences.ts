import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { JobExperience, jobExperiences } from '@/db/schema';
import { UserId } from '@/use-cases/types';

export async function createJobExperience(
  userId: UserId,
  company: string,
  position: string,
  startDate: Date,
  trx = db
) {
  const [job] = await trx
    .insert(jobExperiences)
    .values({
      userId,
      company,
      position,
      startDate: startDate.toISOString(),
    })
    .onConflictDoNothing()
    .returning();
  return job;
}

export async function updateJobExperience(
  userId: UserId,
  updateJobExperience: Partial<JobExperience>,
  trx = db
) {
  await trx
    .update(jobExperiences)
    .set(updateJobExperience)
    .where(eq(jobExperiences.userId, userId));
}

export async function getJobExperience(userId: UserId) {
  const jobExperience = await db.query.jobExperiences.findMany({
    where: eq(jobExperiences.userId, userId),
    orderBy: [desc(jobExperiences.startDate)],
  });

  return jobExperience;
}

export async function deleteJobExperience(userId: UserId, jobId: number) {
  await db
    .delete(jobExperiences)
    .where(
      and(eq(jobExperiences.userId, userId), eq(jobExperiences.id, jobId))
    );
}
