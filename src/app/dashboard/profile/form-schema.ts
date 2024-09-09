import { z } from 'zod';

export const EducationFormSchema = z
  .object({
    degree: z.string().min(1, 'Required'),
    institution: z.string().min(1, 'Required'),
    fieldOfStudy: z.string().min(1, 'Required'),
    startDate: z.date(),
    endDate: z.date().optional(),
    description: z.string().max(500).optional(),
    educationId: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: 'End date must be later than start date',
      path: ['endDate'], // Specify the path to the field that should show the error
    }
  );

export type EducationFormSchemaType = z.infer<typeof EducationFormSchema>;
