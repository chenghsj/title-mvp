import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { generateCodeVerifier, generateState } from 'arctic';
import { Role } from '@/app/_root/types';
import { googleProvider } from '@/lib/auth';

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') as Role;

  if (!role) {
    return new Response('Role query parameter is missing', { status: 400 });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await googleProvider.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email'],
  });
  // url.searchParams.set('prompt', 'consent');

  cookies().set('google_oauth_state', state, {
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  cookies().set('google_code_verifier', codeVerifier, {
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  cookies().set('user_role', role, {
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  console.log(url, state, codeVerifier, role);
  return Response.redirect(url);
}
