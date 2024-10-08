import { z } from 'zod';
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from '@/config/app';
import { degrees, employmentTypes } from './types';

export const EducationFormSchema = z
  .object({
    degree: z.enum(degrees, {
      message: 'Required',
    }),
    institution: z.string().min(1, 'Required'),
    fieldOfStudy: z.string().nullish().optional(),
    startDate: z.date({ invalid_type_error: 'Invalid date' }),
    endDate: z.date().nullish().optional(),
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
  )
  .refine(
    (data) => {
      if (data.degree !== 'High School') {
        return data.fieldOfStudy !== null && data.fieldOfStudy !== '';
      }
      return true;
    },
    {
      message: 'Required',
      path: ['fieldOfStudy'],
    }
  );

export const JobExperienceFormSchema = z
  .object({
    title: z.string().min(1, 'Required'),
    company: z.string().min(1, 'Required'),
    employmentType: z.enum(employmentTypes, {
      message: 'Required',
    }),
    description: z.string().max(500).optional(),
    startDate: z.date(),
    endDate: z.date().nullish().optional(),
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

export const DisplayNameSchema = z.object({
  displayName: z.string().min(1, 'Required').max(50),
});

export const UpdateProfileImageFormSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
        message: `File size must be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
      })
    )
    .max(1, {
      message: 'Maximum 1 file is allowed',
    })
    .nullable(),
});

export type EducationFormSchemaType = z.infer<typeof EducationFormSchema>;
export type JobExperienceFormSchemaType = z.infer<
  typeof JobExperienceFormSchema
>;
export type DisplayNameSchemaType = z.infer<typeof DisplayNameSchema>;
export type UpdateProfileImageFormSchemaType = z.infer<
  typeof UpdateProfileImageFormSchema
>;
