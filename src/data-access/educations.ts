import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Education, educations } from '@/db/schema';
import { UserId } from '@/use-cases/types';

export async function createEducation(
  userId: UserId,
  degree: string,
  fieldOfStudy: string,
  institution: string,
  startDate: Date,
  trx = db
) {
  const [education] = await trx
    .insert(educations)
    .values({
      userId,
      degree,
      fieldOfStudy,
      institution,
      startDate: startDate.toISOString(),
    })
    .onConflictDoNothing()
    .returning();
  return education;
}

export async function updateEducation(
  userId: UserId,
  updateEducation: Partial<Education>,
  trx = db
) {
  await trx
    .update(educations)
    .set(updateEducation)
    .where(eq(educations.userId, userId));
}

export async function getEducation(userId: UserId) {
  const education = await db.query.educations.findMany({
    where: eq(educations.userId, userId),
    orderBy: [desc(educations.startDate)],
  });

  return education;
}

export async function deleteEducation(userId: UserId, educationId: number) {
  await db
    .delete(educations)
    .where(and(eq(educations.userId, userId), eq(educations.id, educationId)));
}
