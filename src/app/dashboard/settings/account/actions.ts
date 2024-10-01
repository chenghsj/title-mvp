'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { deleteUserUseCase } from '@/use-cases/users';

export const deleteAccountAction = authenticatedAction
  .createServerAction()
  .input(z.void())
  .handler(async ({ ctx: { user } }) => {
    await deleteUserUseCase(user.id);
    redirect('/');
  });
