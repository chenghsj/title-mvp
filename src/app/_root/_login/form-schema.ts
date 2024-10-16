import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { RoleTypeEnum } from '../types';

export const SignInFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z.object({
    email: z.string().min(1).email(),
    password: z.string().min(8),
    role: z.enum(RoleTypeEnum),
  });
export type SignInFormSchemaType = z.infer<ReturnType<typeof SignInFormSchema>>;

export const SignUpFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  SignInFormSchema(t)
    .extend({
      confirmPassword: z.string(),
      role: z.enum(RoleTypeEnum),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('custom.invalid_string.confirm_password'),
      path: ['confirmPassword'],
    });

export type SignUpFormSchemaType = z.infer<ReturnType<typeof SignUpFormSchema>>;
