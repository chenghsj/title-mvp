import React from 'react';
import { getEducation } from '@/data-access/educations';
import { getJobExperience } from '@/data-access/job-experiences';
import { getProfile } from '@/data-access/profiles';
import { assertAuthenticated } from '@/lib/session';
import { Profile } from './profile';

type Props = {};

async function ProfilePage({}: Props) {
  const user = await assertAuthenticated();
  const profile = await getProfile(user.id);
  const educations = await getEducation(user.id);
  const jobExperiences = await getJobExperience(user.id);

  return (
    <Profile
      user={user}
      profile={profile!}
      educations={educations}
      jobExperiences={jobExperiences}
    />
  );
}

export default ProfilePage;
