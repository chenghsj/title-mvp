import { Education, JobExperience, Resume, Video } from '@/db/schema/candidate';
import { Account, Profile } from '@/db/schema/user';

export type DashboardDetails = {
  account: Account;
  profile: Profile;
  educations: Education[];
  jobExperiences: JobExperience[];
  resumes: Resume[];
  videos: Video[];
  avatarUrl: string | null;
  coverUrl: string | null;
};
