import { cache } from 'react';
import { cookies } from 'next/headers';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Google } from 'arctic';
import { eq } from 'drizzle-orm';
import { Lucia, Session, User } from 'lucia';
import { TimeSpan, createDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { db } from '@/db/drizzle';
import { emailVerificationCodes, sessions, users } from '@/db/schema';
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

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  // Remove any existing codes for this user
  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, userId))
    .execute();

  // Generate a new random code
  const code = generateRandomString(6, alphabet('0-9'));

  // Insert the new code into the database
  await db
    .insert(emailVerificationCodes)
    .values({
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes expiry
    })
    .execute();

  return code;
}
