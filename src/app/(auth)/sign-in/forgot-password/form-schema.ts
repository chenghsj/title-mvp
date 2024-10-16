import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const forgotPasswordFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z.object({
    email: z.string().min(1).email(),
  });

export type ForgotPasswordFormSchemaType = z.infer<
  ReturnType<typeof forgotPasswordFormSchema>
>;
