import { getEducation } from '@/data-access/educations';
import { getJobExperience } from '@/data-access/job-experiences';
import { getResume } from '@/data-access/resumes';
import { getVideo } from '@/data-access/videos';
import { assertAuthenticated } from '@/lib/session';
import { Resume } from './resume';

type Props = {};

async function ResumePage({}: Props) {
  const user = await assertAuthenticated();
  const resumes = await getResume(user.id);
  const videos = await getVideo(user.id);
  const educations = await getEducation(user.id);
  const jobExperiences = await getJobExperience(user.id);

  return (
    <Resume
      user={user}
      resumes={resumes}
      videos={videos}
      educations={educations}
      jobExperiences={jobExperiences}
    />
  );
}

export default ResumePage;
