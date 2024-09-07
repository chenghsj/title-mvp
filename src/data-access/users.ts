import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { User, users } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { getAccountByUserId, hashPassword } from './accounts';

export async function createUser(email: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
    })
    .returning();
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await db.update(users).set(updatedUser).where(eq(users.id, userId));
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  return account.password == hash;
}
