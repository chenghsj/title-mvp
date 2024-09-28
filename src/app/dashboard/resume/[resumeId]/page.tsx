import { IoPersonSharp } from 'react-icons/io5';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { AvatarWithNextImage } from '@/components/avatar-with-next-image';
import { AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { assertAuthenticated } from '@/lib/session';
import { cn } from '@/lib/utils';
import { getDashboardProfileUseCase } from '@/use-cases/users';
import { EducationSection } from '../../profile/education-section';
import { JobSection } from '../../profile/job-section';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog';
import { ResumeDialog } from '../resume-dialog';
import BackButton from './back-button';
import { SingleResume } from './single-resume';
import { SingleResumeMenu } from './single-resume-menu';

type Props = {
  params: { resumeId: string };
};

const SingleResumePage = async ({ params }: Props) => {
  const user = await assertAuthenticated();
  const {
    profile,
    educations,
    jobExperiences,
    resumes,
    videos,
    avatarUrl,
    coverUrl,
  } = await getDashboardProfileUseCase(user.id);

  const resumeId = +params.resumeId;
  const resume = resumes.find((resume) => resume.id === resumeId);
  const video = videos.find((video) => video.resumeId === resumeId);

  const displayedEducation = educations.find(
    (edu) => edu.id === resume?.educationId
  );

  const displayedJobExperience = jobExperiences.find(
    (job) => job.id === resume?.jobExperienceId
  );

  const tProfileEducations = await getTranslations('profile.educations');
  const tProfileJobExperiences = await getTranslations(
    'profile.jobExperiences'
  );

  return (
    <div className='max-w-3xl space-y-3'>
      <Card className='sticky -top-5 z-20'>
        <CardContent className='flex w-full items-center justify-between p-2'>
          <BackButton />
          <div className='font-bold'>{resume?.title}</div>
          <SingleResumeMenu resume={resume!} />
        </CardContent>
      </Card>

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
        </div>
        <div className='-mt-5 space-y-3 px-5 sm:space-y-5'>
          <AvatarWithNextImage
            avatarFallback={
              <AvatarFallback className='bg-zinc-500'>
                <IoPersonSharp className='h-full w-full translate-y-3 text-zinc-400' />
              </AvatarFallback>
            }
            avatarUrl={avatarUrl || profile?.image}
            avatarProps={{
              className: cn('aspect-square h-20 w-20', 'sm:h-28 sm:w-28'),
            }}
          />
          <div className='space-y-2'>
            <div className='ml-2 text-base font-bold sm:text-lg'>
              {profile?.displayName}
            </div>
            <div className='ml-2 text-base'>
              <p>{resume?.bio}</p>
            </div>
          </div>
          <div className='flex flex-col gap-5'>
            {displayedEducation && (
              <Card className='flex flex-col gap-3 p-4'>
                <div className='text-base font-bold'>
                  {tProfileEducations('title')}
                </div>
                <EducationSection education={displayedEducation} />
              </Card>
            )}
            {displayedJobExperience && (
              <Card className='flex flex-col gap-3 p-4'>
                <div className='text-base font-bold'>
                  {tProfileJobExperiences('title')}
                </div>
                <div>
                  <JobSection jobExperience={displayedJobExperience} />
                </div>
              </Card>
            )}
            <SingleResume video={video!} />
          </div>
        </div>
      </div>
      <ResumeDialog
        resume={{ ...resume!, video }}
        educations={educations}
        jobExperiences={jobExperiences}
      />
      <ConfirmDeleteDialog />
    </div>
  );
};

export default SingleResumePage;
