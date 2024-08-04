import { eq } from 'drizzle-orm';
import { UserId } from 'lucia';
import { Role } from '@/app/_root/types';
import { db } from '@/db/drizzle';
import { accounts } from '@/db/schema';

export async function createAccountViaGoogle(
  userId: UserId,
  googleId: string,
  role: Role
) {
  await db
    .insert(accounts)
    .values({
      userId: userId,
      accountType: 'google',
      googleId,
      role,
    })
    .onConflictDoNothing()
    .returning();
}

export async function getAccountByGoogleId(googleId: string) {
  return await db.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
  });
}
