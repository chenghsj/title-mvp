import { relations } from 'drizzle-orm';
import {
  date,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { RoleTypeEnum } from '@/app/_root/types';

// export const users = pgTable('user', {
//   id: uuid('id').notNull().primaryKey().defaultRandom(),
//   username: varchar('username', { length: 255 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull(),
//   role: json('role').$type<Role>(),
// });

export const accountTypeEnum = ['email', 'google', 'github'] as const;

export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified').defaultNow(),
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
  contact: text('contact'),
  birthDate: date('birth_date'),
});

export const resumes = pgTable('resume', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
});

export const videos = pgTable('video', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  url: text('url').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
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

export const emailVerificationCodes = pgTable('email_verification_code', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  email: text('email').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Define the relations
export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts),
  profile: one(profiles),
  sessions: many(sessions),
  resumes: many(resumes),
  videos: many(videos),
  emailVerificationCode: one(emailVerificationCodes),
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
}));

export const emailVerificationCodeRelations = relations(
  emailVerificationCodes,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationCodes.userId],
      references: [users.id],
    }),
  })
);

export const ProfileSchema = createInsertSchema(profiles);

// Define the insert schema
export const emailVerificationCodeSchema = createInsertSchema(
  emailVerificationCodes
);

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
