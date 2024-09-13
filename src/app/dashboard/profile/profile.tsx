'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { User } from 'lucia';
import { Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Education, JobExperience, Profile as ProfileType } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import { cn } from '@/lib/utils';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { CoverDialog } from './cover-dialog';
import { EducationDialog } from './education-dialog';
import { EducationSection } from './education-section';
import { useProfileDialog } from './hooks';
import { JobDialog } from './job-dialog';
import { JobSection } from './job-section';
import { ProfileSection } from './profile-section';
import {
  createSortedEducations,
  useCreateHandleMenuButtonClick,
} from './utils';

type Props = {
  user: User;
  profile: ProfileType;
  educations: Education[];
  jobExperiences: JobExperience[];
};

export const Profile = ({
  user,
  profile,
  educations,
  jobExperiences,
}: Props) => {
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();

  const sortedEducations = createSortedEducations(educations);
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();

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
      <CoverDialog />
      <ConfirmDeleteDialog userId={user.id} />
      <div>
        <div className='relative'>
          <Skeleton className='h-28 w-full sm:h-48' />
          <Button
            variant={'ghost'}
            size={'icon'}
            className='absolute right-5 top-5 ml-2 h-7 w-7'
            onClick={handleMenuButtonClick('Edit', 'Cover')}
          >
            <Pencil size={16} />
          </Button>
        </div>
        <div className='-mt-5 space-y-5 px-5'>
          <Avatar className={cn('aspect-square h-20 w-20', 'sm:h-28 sm:w-28')}>
            <AvatarImage src={profile?.image || ''} />
            <AvatarFallback>
              <Image
                className='object-cover'
                src={'/profile.png'}
                alt={'Profile image'}
                fill
              />
              <Skeleton className='aspect-square' />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-5'>
            <ProfileSection
              title={'Education'}
              items={sortedEducations}
              formType='Education'
              renderItem={(edu) => <EducationSection education={edu} />}
            />
            <ProfileSection
              title='Job Experience'
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
