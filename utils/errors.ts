export function redirectToErrorPage(status: number, message: string): Response {
  const errorPageUrl = `/error?status=${status}&message=${encodeURIComponent(message)}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: errorPageUrl,
    },
  });
}
