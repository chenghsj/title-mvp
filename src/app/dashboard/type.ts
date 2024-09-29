import { Education, JobExperience, Profile, Resume, Video } from '@/db/schema';

export type DashboardDetails = {
  profile: Profile;
  educations: Education[];
  jobExperiences: JobExperience[];
  resumes: Resume[];
  videos: Video[];
  avatarUrl: string | null;
  coverUrl: string | null;
};
