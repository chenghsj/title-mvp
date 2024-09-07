import React from 'react';
import Image from 'next/image';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getEducation } from '@/data-access/educations';
import { getJobExperience } from '@/data-access/job-experiences';
import { getProfile } from '@/data-access/profiles';
import { getResumeById } from '@/data-access/resumes';
import { getVideoById } from '@/data-access/videos';
import { assertAuthenticated } from '@/lib/session';
import { cn } from '@/lib/utils';
import BackButton from './back-button';
import { ResumeTab } from './resume-tab';

type Props = {
  params: { resumeId: string };
};

const SingleResumePage = async ({ params }: Props) => {
  const user = await assertAuthenticated();
  const profile = await getProfile(user.id);
  const educations = await getEducation(user.id);
  const jobExperiences = await getJobExperience(user.id);
  const resume = await getResumeById(user.id, +params.resumeId);

  const resumeId = +params.resumeId;
  // const resume = await getResumeById(user.id, resumeId);
  const video = await getVideoById(user.id, resumeId);

  const highestEducation = educations.length > 0 ? educations[0] : null;
  const currentJob = jobExperiences.length > 0 ? jobExperiences[0] : null;

  return (
    <div className='max-w-3xl space-y-3'>
      <BackButton />
      <div>
        <Skeleton className='h-28 w-full sm:h-48' />
        <div className='-mt-5 space-y-3 px-5 sm:space-y-5'>
          <Avatar className={cn('aspect-square h-20 w-20', 'sm:h-28 sm:w-28')}>
            <AvatarImage src={profile?.image || ''} />
            <AvatarFallback>
              <Image
                className='object-cover'
                src={'/profile.png'}
                alt={'Profile image'}
                fill
              />
            </AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <div className='ml-2 text-base font-bold sm:text-lg'>
              {profile?.displayName}
            </div>
            <div className='ml-2 text-base'>
              <p>{resume?.bio}</p>
            </div>
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            <div className='flex flex-col space-y-5'>
              <Card className='flex flex-col gap-3 p-4'>
                <div className='text-base font-bold'>Education</div>
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
                <div className='text-base font-bold'>Current Job</div>
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
            <ResumeTab video={video!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleResumePage;
