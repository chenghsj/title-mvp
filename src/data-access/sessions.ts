import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { sessions } from '@/db/schema/user';
import { UserId } from '@/use-cases/types';

export async function deleteSessionForUser(userId: UserId, trx = db) {
  await trx.delete(sessions).where(eq(sessions.userId, userId));
}
