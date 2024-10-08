import { z } from 'zod';

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;

export const SignUpFormSchema = SignInFormSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;
