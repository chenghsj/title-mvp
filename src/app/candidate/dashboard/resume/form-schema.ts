import { z } from 'zod';

export const ResumeFormSchema = z.object({
  title: z.string().min(1, 'Required').max(50),
  bio: z.string().max(500).optional(),
  url: z.string().url(),
  duration: z
    .number()
    .max(300, 'The duration must be less than 5 minutes')
    .optional(),
  tag: z.string().array().optional(),
  resumeId: z.number().optional(),
  educationId: z.number().nullable(),
  jobExperienceId: z.number().nullable(),
});

export type ResumeFormSchemaType = z.infer<typeof ResumeFormSchema>;
