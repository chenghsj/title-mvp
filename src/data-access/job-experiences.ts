import { and, desc, eq } from 'drizzle-orm';
import { EmploymentType } from '@/app/dashboard/profile/type';
import { db } from '@/db/drizzle';
import { JobExperience, jobExperiences } from '@/db/schema';
import { UserId } from '@/use-cases/types';

export async function createJobExperience({
  trx = db,
  ...rest
}: {
  userId: UserId;
  title: string;
  company: string;
  skill: string[];
  employmentType: EmploymentType;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  trx?: typeof db;
}) {
  const [job] = await trx
    .insert(jobExperiences)
    .values({
      ...rest,
      startDate: rest.startDate.toISOString(),
      endDate: rest.endDate?.toISOString() || null,
    })
    .onConflictDoNothing()
    .returning();
  return job;
}

export async function updateJobExperience(
  userId: UserId,
  jobExperienceId: number,
  updateJobExperience: Partial<JobExperience>,
  trx = db
) {
  await trx
    .update(jobExperiences)
    .set(updateJobExperience)
    .where(
      and(
        eq(jobExperiences.userId, userId),
        eq(jobExperiences.id, jobExperienceId)
      )
    );
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
