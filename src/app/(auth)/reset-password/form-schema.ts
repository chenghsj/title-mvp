import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const resetPasswordFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z
    .object({
      password: z.string().min(8),
      token: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('custom.invalid_string.confirm_password'),
      path: ['confirmPassword'],
    });

export type ResetPasswordFormSchemaType = z.infer<
  ReturnType<typeof resetPasswordFormSchema>
>;
