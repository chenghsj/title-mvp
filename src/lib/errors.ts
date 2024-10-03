import { Role } from '@/app/_root/types';

export class RateLimitError extends Error {
  constructor() {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
  }
}

export function redirectToOAuthErrorPage(
  status: number,
  message: string,
  role?: Role
): Response {
  const errorPageUrl = `/error/oauth?status=${status}&message=${encodeURIComponent(message)}${role ? `&role=${role}` : ''}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: errorPageUrl,
    },
  });
}
