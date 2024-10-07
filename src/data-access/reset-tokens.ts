import { eq } from 'drizzle-orm';
import { TOKEN_LENGTH, TOKEN_TTL } from '@/config/app';
import { db } from '@/db/drizzle';
import { resetTokens } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { generateRandomToken } from './utils';

createPasswordResetToken;

export async function createPasswordResetToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + TOKEN_TTL);

  await db
    .insert(resetTokens)
    .values({
      userId,
      token,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokens.userId,
      set: {
        token,
        expiresAt,
      },
    });

  return token;
}

export async function getPasswordResetToken(token: string) {
  const existingToken = await db.query.resetTokens.findFirst({
    where: eq(resetTokens.token, token),
  });

  return existingToken;
}

export async function deletePasswordResetToken(token: string, trx = db) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token));
}
