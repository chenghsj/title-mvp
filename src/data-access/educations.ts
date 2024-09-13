import { and, desc, eq } from 'drizzle-orm';
import { DegreeType } from '@/app/dashboard/profile/type';
import { db } from '@/db/drizzle';
import { Education, educations } from '@/db/schema';
import { UserId } from '@/use-cases/types';

export async function createEducation({
  trx = db,
  ...rest
}: {
  userId: UserId;
  degree: DegreeType;
  fieldOfStudy: string;
  institution: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  trx?: typeof db;
}) {
  const [education] = await trx
    .insert(educations)
    .values({
      ...rest,
      startDate: rest.startDate.toISOString(),
      endDate: rest.endDate?.toISOString(),
    })
    .onConflictDoNothing()
    .returning();
  return education;
}

export async function updateEducation(
  userId: UserId,
  educationId: number,
  updateEducation: Partial<Education>,
  trx = db
) {
  await trx
    .update(educations)
    .set(updateEducation)
    .where(and(eq(educations.userId, userId), eq(educations.id, educationId)));
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
