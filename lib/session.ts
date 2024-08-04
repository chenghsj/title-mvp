import { cache } from 'react';
import { cookies } from 'next/headers';
import { UserId } from 'lucia';
import 'server-only';
import { lucia } from '@/lib/auth';
import { validateRequest } from '@/lib/auth';
import { AuthenticationError } from '@/use-cases/errors';

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  return session.user;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function setSession(userId: UserId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
