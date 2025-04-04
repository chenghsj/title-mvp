import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Profile, profiles } from '@/db/schema/user';
import { UserId } from '@/use-cases/types';

export async function createProfile(
  userId: UserId,
  displayName?: string,
  image?: string
) {
  const [profile] = await db
    .insert(profiles)
    .values({
      userId,
      image,
      displayName,
    })
    .onConflictDoNothing()
    .returning();
  return profile;
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>
) {
  await db
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId));
}

export async function getProfile(userId: UserId) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  return profile;
}

export async function updateDisplayName(userId: UserId, displayName: string) {
  await updateProfile(userId, { displayName });
}
