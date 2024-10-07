import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;
