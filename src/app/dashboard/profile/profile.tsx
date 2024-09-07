'use client';

import React, { MouseEvent } from 'react';
import Image from 'next/image';
import { User } from 'lucia';
import { Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Education, JobExperience, Profile as ProfileType } from '@/db/schema';
import { cn } from '@/lib/utils';
import { CoverDialog } from './cover-dialog';
import { EducationDialog } from './education-dialog';
import {
  TDialog,
  TMode,
  useDialog,
  useMode,
} from './hooks';
import { JobDialog } from './job-dialog';

type Props = {
  user: User;
  profile: ProfileType;
  educations: Education[];
  jobExperiences: JobExperience[];
};

export const Profile = ({ user, profile }: Props) => {
  const mode = useMode();
  const dialog = useDialog();

  const handleEditClick =
    (modeType: TMode, dialogType: TDialog) =>
    (e: MouseEvent<HTMLButtonElement>) => {
      mode.setMode(modeType);
      dialog.setType(dialogType);
      dialog.setIsOpen(true);
    };

  return (
    <div className='max-w-3xl space-y-3'>
      <EducationDialog />
      <JobDialog />
      <CoverDialog />
      <div>
        <div className='relative'>
          <Skeleton className='h-28 w-full sm:h-48' />
          <Button
            variant={'ghost'}
            size={'icon'}
            className='absolute right-5 top-5 ml-2 h-4 w-4'
            onClick={handleEditClick('Edit', 'Cover')}
          >
            <Pencil />
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
          <div className='flex flex-col gap-5 md:flex-row'>
            <div className='flex flex-col space-y-5'>
              <Card className='flex flex-col gap-3 p-4'>
                <div className='flex w-full items-center justify-between text-base font-bold'>
                  Education
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='ml-2 h-4 w-4'
                    onClick={handleEditClick('Edit', 'Education')}
                  >
                    <Pencil />
                  </Button>
                </div>
                <div>
                  {/* {highestEducation && (
                <>
                  <p className='text-sm'>
                    {highestEducation?.institution} - {highestEducation?.degree}
                  </p>
                  <p className='text-sm italic'>
                    {highestEducation?.startDate} -{' '}
                    {highestEducation.endDate
                      ? format(new Date(highestEducation.endDate), 'yyyy-MM')
                      : 'Present'}
                  </p>
                </>
              )} */}
                  <p className='text-sm'>NCKU - ID</p>
                  <p className='text-sm italic'>2018/08 - 2022/06</p>
                </div>
              </Card>
              <Card className='flex flex-col gap-3 p-4'>
                <div className='flex w-full items-center justify-between text-base font-bold'>
                  Job Experience
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='ml-2 h-4 w-4'
                    onClick={handleEditClick('Edit', 'Job')}
                  >
                    <Pencil />
                  </Button>
                </div>
                <div>
                  {/* {currentJob && (
                <>
                  <p className='text-sm'>
                    {currentJob.company} - {currentJob.position}
                  </p>
                  <p className='text-sm italic'>
                    {currentJob?.startDate} -{' '}
                    {currentJob.endDate
                      ? format(new Date(currentJob.endDate), 'yyyy-MM')
                      : 'Present'}
                  </p>
                </>
              )} */}
                  <p className='text-sm'>Liteon - RD</p>
                  <p className='text-sm italic'>2022/07 - Present</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
