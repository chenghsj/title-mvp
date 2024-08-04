import React from 'react';
import { redirect } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { getCurrentUser } from '@/lib/session';

type Props = {};

async function DashboardPage({}: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  return <SectionExcludeNav>Dashboard</SectionExcludeNav>;
}

export default DashboardPage;
