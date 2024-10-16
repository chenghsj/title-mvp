import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const ResumeFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z.object({
    title: z
      .string()
      .min(1)
      .max(50, {
        message: t.rich('invalid_string.max', { max: 50 }) as string,
      }),
    bio: z.string().max(500).optional(),
    url: z.string().min(1).url(),
    duration: z
      .number()
      .max(
        300,
        t.rich('custom.invalid_number.video_duration', { minutes: 5 }) as string
      )
      .optional(),
    tag: z.string().array().optional(),
    resumeId: z.number().optional(),
    educationId: z.number().nullable(),
    jobExperienceId: z.number().nullable(),
  });

export type ResumeFormSchemaType = z.infer<ReturnType<typeof ResumeFormSchema>>;
