import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { UserId } from 'lucia';
import { Role } from '@/app/_root/types';
import { db } from '@/db/drizzle';
import { accounts } from '@/db/schema';

const ITERATIONS = 10_000;

export async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      }
    );
  });
}

export async function getAccountByUserId(userId: UserId) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
}

export async function createAccount(
  userId: UserId,
  password: string,
  role: Role
) {
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = await hashPassword(password, salt);
  const [account] = await db
    .insert(accounts)
    .values({
      userId,
      accountType: 'email',
      password: hash,
      salt,
      role,
    })
    .returning();
  return account;
}

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
