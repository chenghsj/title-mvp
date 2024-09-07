import { z } from 'zod';

export const ResumeFormSchema = z.object({
  title: z.string().min(1, 'The field is required').max(50),
  bio: z.string().max(500).optional(),
  url: z.string().url(),
  duration: z
    .number()
    .max(120, 'The duration must be less than 120 seconds')
    .optional(),
  resumeId: z.number().optional(),
});

export type ResumeFormSchemaType = z.infer<typeof ResumeFormSchema>;
