'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useDialogState } from '@/hooks/store';
import { DashboardDetails } from '../type';
import { AvatarWithMenu } from './avatar-with-menu';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { CoverSection } from './cover-section';
import { DisplayNameDialog } from './display-name-dialog';
import { DisplayNameSection } from './display-name-section';
import { EducationDialog } from './education-dialog';
import { EducationSection } from './education-section';
import { useProfileDialog } from './hooks';
import { JobDialog } from './job-dialog';
import { JobSection } from './job-section';
import { ProfileSectionCard } from './profile-section-card';
import { UploadImageDialog } from './upload-image-dialog';
import { createSortedEducations } from './utils';

type Props = {
  dashboardDetails: DashboardDetails;
};

export const Profile = ({ dashboardDetails }: Props) => {
  const { profile, educations, jobExperiences, avatarUrl, coverUrl } =
    dashboardDetails;

  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();

  const sortedEducations = createSortedEducations(educations);

  const tProfile = useTranslations('profile');

  useEffect(() => {
    profileDialog.setEducations(educations);
    profileDialog.setJobExperiences(jobExperiences);
  }, [educations, jobExperiences]);

  return (
    <div className='max-w-3xl space-y-3'>
      <EducationDialog
        education={
          dialogState.mode === 'Edit'
            ? educations.find((edu) => edu.id === profileDialog.educationId)
            : undefined
        }
      />
      <JobDialog
        jobExperience={
          dialogState.mode === 'Edit'
            ? jobExperiences.find((job) => job.id === profileDialog.jobId)
            : undefined
        }
      />
      <UploadImageDialog formType='Cover' type='cover' />
      <UploadImageDialog formType='Avatar' type='avatar' />
      <ConfirmDeleteDialog />
      <DisplayNameDialog displayName={profile.displayName!} />
      <div>
        <CoverSection coverUrl={coverUrl} />
        <div className='-mt-2 space-y-5 px-5 sm:-mt-4'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <AvatarWithMenu profile={profile} avatarUrl={avatarUrl} />
            <DisplayNameSection displayName={profile.displayName!} />
          </div>
          <div className='flex flex-col gap-5'>
            <ProfileSectionCard
              title={tProfile('educations.title')}
              items={sortedEducations}
              formType='Education'
              renderItem={(edu) => <EducationSection education={edu} />}
            />
            <ProfileSectionCard
              title={tProfile('jobExperiences.title')}
              items={jobExperiences}
              formType='Job'
              renderItem={(job) => <JobSection jobExperience={job} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
