import { sql } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  degrees,
  employmentTypes,
} from '@/app/candidate/dashboard/profile/types';
import { users } from './user';

export const educations = pgTable('education', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  institution: text('institution'),
  degree: text('degree', { enum: degrees }),
  fieldOfStudy: text('field_of_study'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  grade: text('grade'),
  activities: text('activities'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const jobExperiences = pgTable('job_experience', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  company: text('company').notNull(),
  description: text('description'),
  employmentType: text('employment_type', { enum: employmentTypes }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const videos = pgTable('video', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  resumeId: integer('resume_id')
    .notNull()
    .references(() => resumes.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const resumes = pgTable('resume', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  bio: text('bio'),
  tag: text('tag')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  educationId: integer('education_id'),
  jobExperienceId: integer('job_experience_id'),
});

export type Education = typeof educations.$inferSelect;
export type JobExperience = typeof jobExperiences.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type Video = typeof videos.$inferSelect;
