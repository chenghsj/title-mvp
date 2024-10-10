import {
  date,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { RoleTypeEnum } from '@/app/_root/types';



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
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
