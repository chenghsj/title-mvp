import { and, eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Video, videos } from '@/db/schema/candidate';
import { UserId } from '@/use-cases/types';

export async function createVideo(
  userId: UserId,
  resumeId: number,
  url: string,
  trx = db
) {
  const [video] = await trx
    .insert(videos)
    .values({
      userId,
      resumeId,
      url,
    })
    .onConflictDoNothing()
    .returning();

  return video;
}

export async function updateVideo(
  userId: UserId,
  resumeId: number,
  updateVideo: Partial<Video>,
  trx = db
) {
  await trx
    .update(videos)
    .set(updateVideo)
    .where(and(eq(videos.userId, userId), eq(videos.resumeId, resumeId)));
}

export async function getVideo(userId: UserId) {
  const video = await db.query.videos.findMany({
    where: eq(videos.userId, userId),
  });

  return video;
}

export async function getVideoById(userId: UserId, resumeId: number) {
  const video = await db.query.videos.findFirst({
    where: and(eq(videos.userId, userId), eq(videos.resumeId, resumeId)),
  });

  return video;
}
