import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { deviceDetect } from '@/lib/device-check';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import Sidebar from './sidebar';

type Props = {
  children: ReactNode;
};

async function DashboardLayout({ children }: Props) {
  const user = await getCurrentUser();
  const { isMobile } = deviceDetect();

  if (!user) redirect('/sign-in');

  return (
    <>
      <SectionExcludeNav className={'absolute'}>
        <Sidebar className='peer' />
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

export default DashboardLayout;
