import { cache } from 'react';
import { cookies } from 'next/headers';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Google } from 'arctic';
import { Lucia, Session, User } from 'lucia';
import { db } from '@/db/drizzle';
import { sessions, users } from '@/db/schema/user';
import { UserId } from '@/use-cases/types';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: UserId;
}

// export const githubProvider = new GitHub(
//   process.env.GITHUB_CLIENT_ID!,
//   process.env.GITHUB_CLIENT_SECRET!,
// );

export const googleProvider = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.HOST_NAME}/api/login/google/callback`
);

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }
);
