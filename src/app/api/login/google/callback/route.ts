import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { Role } from '@/app/_root/types';
import { afterCandidateLoginUrl, afterCompanyLoginUrl } from '@/config/site';
import { googleProvider } from '@/lib/auth';
import { redirectToOAuthErrorPage } from '@/lib/errors';
import { setSession } from '@/lib/session';
import { getAccountByGoogleIdUseCase } from '@/use-cases/accounts';
import { RoleError } from '@/use-cases/errors';
import { createGoogleUserUseCase } from '@/use-cases/users';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const codeVerifier = cookies().get('google_code_verifier')?.value ?? null;
  const role = cookies().get('user_role')!.value as Role;
  let existingAccountRole = '' as Role;

  if (error) {
    return redirectToOAuthErrorPage(401, error);
  }

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return redirectToOAuthErrorPage(400, 'Invalid state or code');
  }

  try {
    const tokens = await googleProvider.validateAuthorizationCode(
      code,
      codeVerifier
    );
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await response.json();

    const existingAccount = await getAccountByGoogleIdUseCase(googleUser.sub);

    if (existingAccount) {
      if (role !== existingAccount.role) {
        existingAccountRole = existingAccount.role;
        throw new RoleError(existingAccount.role);
      }
      await setSession(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location:
            existingAccount.role === 'candidate'
              ? afterCandidateLoginUrl
              : afterCompanyLoginUrl,
        },
      });
    }

    const userId = await createGoogleUserUseCase(googleUser, role);
    await setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location:
          role === 'candidate' ? afterCandidateLoginUrl : afterCompanyLoginUrl,
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return redirectToOAuthErrorPage(400, e.message);
    }

    if (e instanceof RoleError) {
      return redirectToOAuthErrorPage(400, 'RoleError', existingAccountRole);
    }

    return redirectToOAuthErrorPage(500, 'Internal server error');
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
