import { useTranslations } from 'next-intl';
import { z } from 'zod';
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from '@/config/app';
import { degrees, employmentTypes } from './types';

const createDateDurationSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) => ({
  startDate: z.preprocess(
    (val) => (typeof val === 'string' && val === '' ? undefined : val),
    z.date({
      required_error: t('custom.invalid_date.required'),
      invalid_type_error: t('custom.invalid_type_error.invalid_date'),
    })
  ),
  endDate: z
    .union([
      z.date({
        invalid_type_error: t('custom.invalid_type_error.invalid_date'),
      }),
      z.string().refine((val) => val === '', {
        message: t('custom.invalid_type_error.invalid_date'),
      }),
    ])
    .transform((val) => (!val ? null : val))
    .nullable()
    .optional(),
});

export const EducationFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z
    .object({
      ...createDateDurationSchema(t),
      degree: z.enum(degrees, {
        message: t('custom.invalid_enum.required'),
      }),
      institution: z.string().min(1),
      fieldOfStudy: z.string().nullish().optional(),
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
        message: t('custom.invalid_date.later_than'),
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
        message: t('custom.invalid_string.required'),
        path: ['fieldOfStudy'],
      }
    );

export const JobExperienceFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z
    .object({
      ...createDateDurationSchema(t),
      title: z.string().min(1),
      company: z.string().min(1),
      employmentType: z.enum(employmentTypes, {
        message: t('custom.invalid_enum.required'),
      }),
      description: z.string().max(500).optional(),
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
        message: t('custom.invalid_date.later_than'),
        path: ['endDate'],
      }
    );

export const DisplayNameSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z.object({
    displayName: z.string().min(1).max(50),
  });

export const UpdateProfileImageFormSchema = (
  t: ReturnType<typeof useTranslations<'zod'>>
) =>
  z.object({
    files: z
      .array(
        z.instanceof(File).refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
          message: t.rich('custom.invalid_array.max_file_size', {
            size: MAX_UPLOAD_IMAGE_SIZE_IN_MB,
          }) as string,
        })
      )
      .max(1, {
        message: t.rich('custom.invalid_array.max', { max: 1 }) as string,
      })
      .nullable(),
  });

export type EducationFormSchemaType = z.infer<
  ReturnType<typeof EducationFormSchema>
>;
export type JobExperienceFormSchemaType = z.infer<
  ReturnType<typeof JobExperienceFormSchema>
>;
export type DisplayNameSchemaType = z.infer<
  ReturnType<typeof DisplayNameSchema>
>;
export type UpdateProfileImageFormSchemaType = z.infer<
  ReturnType<typeof UpdateProfileImageFormSchema>
>;
