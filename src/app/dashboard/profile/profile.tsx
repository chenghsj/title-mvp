'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Education, JobExperience, Profile as ProfileType } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import { AvatarWithMenu } from './avatar-with-menu';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { DisplayName } from './display-name';
import { EducationDialog } from './education-dialog';
import { EducationSection } from './education-section';
import { useCreateHandleMenuButtonClick, useProfileDialog } from './hooks';
import { JobDialog } from './job-dialog';
import { JobSection } from './job-section';
import { ProfileSection } from './profile-section';
import { UploadImageDialog } from './upload-image-dialog';
import { createSortedEducations } from './utils';

type DashboardInfo = {
  profile: ProfileType;
  educations: Education[];
  jobExperiences: JobExperience[];
  avatarUrl: string | null;
  coverUrl: string | null;
};
type Props = {
  dashboardInfo: DashboardInfo;
};

export const Profile = ({ dashboardInfo }: Props) => {
  const { profile, educations, jobExperiences, avatarUrl, coverUrl } =
    dashboardInfo;

  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();

  const sortedEducations = createSortedEducations(educations);
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();

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
      <div>
        <div className='relative'>
          <div className='aspect-[16/6] w-full sm:aspect-[16/5]'>
            {coverUrl ? (
              <Image
                className='h-full w-full rounded-md object-contain'
                src={coverUrl}
                fill
                alt='profile cover image'
              />
            ) : (
              <Skeleton className='h-full w-full rounded-md' />
            )}
          </div>

          <Button
            variant={'ghost'}
            size={'icon'}
            className='absolute right-5 top-5 ml-2 h-7 w-7'
            onClick={handleMenuButtonClick('Edit', 'Cover')}
          >
            <Pencil size={16} />
          </Button>
        </div>
        <div className='-mt-2 space-y-5 px-5 sm:-mt-4'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <AvatarWithMenu profile={profile} avatarUrl={avatarUrl} />
            <DisplayName displayName={profile.displayName!} />
          </div>
          <div className='flex flex-col gap-5'>
            <ProfileSection
              title={tProfile('educations.title')}
              items={sortedEducations}
              formType='Education'
              renderItem={(edu) => <EducationSection education={edu} />}
            />
            <ProfileSection
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
