import { ReactNode } from 'react';
import React from 'react';
import { redirect } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import Sidebar from '@/components/sidebar';
import { afterCompanyLoginUrl } from '@/config/site';
import { getAccountByUserId } from '@/data-access/accounts';
import { assertAuthenticated } from '@/lib/session';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

async function CandidateDashboardLayout({ children }: Props) {
  const user = await assertAuthenticated();
  if (!user) redirect('/sign-in');

  const account = await getAccountByUserId(user.id);
  if (account?.role === 'company') {
    redirect(afterCompanyLoginUrl);
  }

  return (
    <>
      <SectionExcludeNav className={'absolute'}>
        <Sidebar className='peer' type='candidateDashboard' />
        <div
          className={cn(
            'h-full overflow-auto p-5 dark:bg-zinc-900',
            'transition-[margin-left] duration-300 ease-in-out',
            'lg:ml-[var(--dashboard-sidebar-w)] peer-data-[state=open]:lg:ml-[var(--dashboard-sidebar-w-expand)]'
          )}
        >
          {children}
        </div>
      </SectionExcludeNav>
      <SectionExcludeNav className='invisible' />
    </>
  );
}

export default CandidateDashboardLayout;
