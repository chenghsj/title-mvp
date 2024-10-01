import { z } from 'zod';
import { RoleTypeEnum } from '../types';

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(RoleTypeEnum),
});
export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;

export const SignUpFormSchema = SignInFormSchema.extend({
  confirmPassword: z.string(),
  role: z.enum(RoleTypeEnum),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;
