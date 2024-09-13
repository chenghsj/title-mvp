import { z } from 'zod';
import { degrees, employmentTypes } from './type';

export const EducationFormSchema = z
  .object({
    degree: z.enum(degrees, {
      message: 'Required',
    }),
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
      path: ['endDate'],
    }
  );

export const JobExperienceFormSchema = z
  .object({
    title: z.string().min(1, 'Required'),
    company: z.string().min(1, 'Required'),
    employmentType: z.enum(employmentTypes, {
      message: 'Required',
    }),
    skill: z.array(z.string()).optional(),
    description: z.string().max(500).optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    jobExperienceId: z.number().optional(),
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
      path: ['endDate'],
    }
  );

export type EducationFormSchemaType = z.infer<typeof EducationFormSchema>;
export type JobExperienceFormSchemaType = z.infer<
  typeof JobExperienceFormSchema
>;
