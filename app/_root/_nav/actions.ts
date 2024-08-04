'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { lucia, validateRequest } from '@/lib/auth';

export async function signOutAction(): Promise<Response> {
  console.log('run');
  const { session } = await validateRequest();

  if (!session) {
    return Response.json('Unauthorized', { status: 401 });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/sign-in');
}
