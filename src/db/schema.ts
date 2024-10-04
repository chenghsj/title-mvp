import { relations, sql } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { RoleTypeEnum } from '@/app/_root/types';
import {
  degrees,
  employmentTypes,
} from '@/app/candidate/dashboard/profile/types';

export const accountTypeEnum = ['email', 'google', 'github'] as const;

export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', {
    withTimezone: true,
    mode: 'date',
  }),
});

export const accounts = pgTable('account', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  role: text('role', { enum: RoleTypeEnum }).notNull(),
  accountType: text('account_type', { enum: accountTypeEnum }).notNull(),
  githubId: text('github_id').unique(),
  googleId: text('google_id').unique(),
  password: text('password'),
  salt: text('salt'),
});

export const profiles = pgTable('profile', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  given_name: text('given_name'),
  family_name: text('family_name'),
  displayName: text('displayName'),
  bio: text('bio'),
  image: text('avatar'),
  imageId: text('image_id'),
  coverId: text('cover_id'),
  contact: text('contact'),
  birthDate: date('birth_date'),
});

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

export const sessions = pgTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const emailVerificationOTPs = pgTable('email_verification_otp', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  OTP: text('code').notNull(),
  email: text('email').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const resetTokens = pgTable('reset_token', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

/**
 *
 * Relations
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts),
  profile: one(profiles),
  sessions: many(sessions),
  resumes: many(resumes),
  videos: many(videos),
  emailVerificationCode: one(emailVerificationOTPs),
  resetToken: one(resetTokens),
  educations: many(educations),
  jobExperiences: many(jobExperiences),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const educationRelations = relations(educations, ({ one }) => ({
  user: one(users, {
    fields: [educations.userId],
    references: [users.id],
  }),
}));

export const jobExperienceRelations = relations(jobExperiences, ({ one }) => ({
  user: one(users, {
    fields: [jobExperiences.userId],
    references: [users.id],
  }),
}));

export const resumeRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const videoRelations = relations(videos, ({ one }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [videos.resumeId],
    references: [resumes.id],
  }),
}));

export const emailVerificationCodeRelations = relations(
  emailVerificationOTPs,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationOTPs.userId],
      references: [users.id],
    }),
  })
);

export const resetTokenRelations = relations(resetTokens, ({ one }) => ({
  user: one(users, {
    fields: [resetTokens.userId],
    references: [users.id],
  }),
}));

/**
 *
 * Schemas
 */
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type JobExperience = typeof jobExperiences.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type Video = typeof videos.$inferSelect;
