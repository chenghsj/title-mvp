'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { deleteUserUseCase } from '@/use-cases/users';

export const deleteAccountAction = authenticatedAction
  .createServerAction()
  .input(z.void())
  .handler(async ({ ctx: { user } }) => {
    const tComponentsToast = await getTranslations('components.toast');
    await deleteUserUseCase(user.id);
    return {
      message: {
        title: tComponentsToast('success.title'),
        description: tComponentsToast('success.deleteAccount.description'),
      },
    };
  });
