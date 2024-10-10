import { relations } from 'drizzle-orm';
import { educations, jobExperiences, resumes, videos } from './candidate';
import {
  accounts,
  emailVerificationOTPs,
  profiles,
  resetTokens,
  sessions,
  users,
} from './user';

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
