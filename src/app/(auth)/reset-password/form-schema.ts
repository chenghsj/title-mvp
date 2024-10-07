import { z } from 'zod';

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8),
    token: z.string(),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormSchemaType = z.infer<
  typeof resetPasswordFormSchema
>;
