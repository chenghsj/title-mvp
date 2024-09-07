import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Video, videos } from '@/db/schema';
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
  updateVideo: Partial<Video>,
  trx = db
) {
  await trx.update(videos).set(updateVideo).where(eq(videos.userId, userId));
}

export async function getVideo(userId: UserId) {
  const video = await db.query.videos.findMany({
    where: eq(videos.userId, userId),
  });

  return video;
}
