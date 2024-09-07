import { z } from 'zod';

export const ResumeFormSchema = z.object({
  title: z.string().min(1, 'The field is required').max(50),
  bio: z.string().max(500).optional(),
  url: z.string().url(),
});
export type ResumeFormSchemaType = z.infer<typeof ResumeFormSchema>;
