import { getTranslations } from 'next-intl/server';
import { BreakLineDiv } from '@/components/break-line-div';
import { Card, CardContent } from '@/components/ui/card';
import { assertAuthenticated } from '@/lib/session';
import { getDashboardProfileUseCase } from '@/use-cases/users';
import { CoverSection } from '../../profile/cover-section';
import { EducationSection } from '../../profile/education-section';
import { JobExperienceSection } from '../../profile/job-experience-section';
import { ProfileHeader } from '../../profile/profile-header';
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

  const tProfileEducation = await getTranslations('profile.education');
  const tProfileJobExperience = await getTranslations('profile.jobExperience');

  return (
    <div className='max-w-3xl space-y-3'>
      <Card className='sticky -top-5 z-20'>
        <CardContent className='flex w-full items-center justify-between p-2'>
          <BackButton className='h-7 w-7' />
          <div className='font-bold'>{resume?.title}</div>
          <SingleResumeMenu resume={resume!} />
        </CardContent>
      </Card>

      <div>
        <CoverSection coverUrl={coverUrl} canEdit={false} />
        <div className='-mt-2 space-y-5 px-5 sm:-mt-4'>
          <ProfileHeader
            profile={profile}
            avatarUrl={avatarUrl}
            canEdit={false}
          />
          <div className='ml-5 text-base sm:!mt-0'>
            {resume?.bio && <BreakLineDiv content={resume.bio} />}
          </div>
          <div className='flex flex-col gap-5'>
            {displayedEducation && (
              <Card className='flex flex-col gap-3 p-4'>
                <div className='text-base font-bold'>
                  {tProfileEducation('title')}
                </div>
                <EducationSection education={displayedEducation} />
              </Card>
            )}
            {displayedJobExperience && (
              <Card className='flex flex-col gap-3 p-4'>
                <div className='text-base font-bold'>
                  {tProfileJobExperience('title')}
                </div>
                <div>
                  <JobExperienceSection
                    jobExperience={displayedJobExperience}
                  />
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
