import { and, desc, eq } from 'drizzle-orm';
import { DegreeType } from '@/app/dashboard/profile/types';
import { db } from '@/db/drizzle';
import { Education, educations } from '@/db/schema';
import { UserId } from '@/use-cases/types';

export async function createEducation({
  trx = db,
  ...input
}: {
  userId: UserId;
  degree: DegreeType;
  fieldOfStudy: string;
  institution: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  trx?: typeof db;
}) {
  const [education] = await trx
    .insert(educations)
    .values(input)
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
    .set({
      ...updateEducation,
      startDate: new Date(updateEducation.startDate!).toLocaleDateString(),
      endDate: updateEducation.endDate
        ? new Date(updateEducation.endDate).toLocaleDateString()
        : null,
      updatedAt: new Date(),
    })
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
