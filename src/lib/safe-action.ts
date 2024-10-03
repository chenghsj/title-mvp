import { getTranslations } from 'next-intl/server';
import { createServerActionProcedure } from 'zsa';
import { rateLimitByKey } from '@/lib/limiter';
import { assertAuthenticated } from '@/lib/session';
import { PublicError } from '@/use-cases/errors';

async function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError;
  const tComponentsToast = await getTranslations('components.toast');
  // let's all errors pass through to the UI so debugging locally is easier
  const isDev = process.env.NODE_ENV === 'development';
  if (isAllowedError || isDev) {
    return {
      code: err.code ?? tComponentsToast('error'),
      message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${
        err.message
      }`,
    };
  } else {
    return {
      code: tComponentsToast('error'),
      message: 'Something went wrong',
    };
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const user = await assertAuthenticated();
    await rateLimitByKey({
      key: `${user.id}-global`,
      limit: 10,
      window: 10_000,
    });
    return { user };
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    await rateLimitByKey({
      key: `unauthenticated-global`,
      limit: 10,
      window: 10_000,
    });
  });
