import React from 'react';
import { assertAuthenticated } from '@/lib/session';

type Props = {};

async function ProfilePage({}: Props) {
  const user = await assertAuthenticated();
  return <div>ProfilePage</div>;
}

export default ProfilePage;
