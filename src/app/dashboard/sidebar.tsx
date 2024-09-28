'use client';

import { HTMLAttributes } from 'react';
import { Menu } from '@/components/menu/menu';
import { useDashboardMenu } from '@/components/menu/store';
import { cn } from '@/lib/utils';
import { SidebarToggle } from './sidebar-toggle';

type Props = {} & HTMLAttributes<HTMLElement>;

function Sidebar({ className, ...props }: Props) {
  const { isOpen } = useDashboardMenu();

  return (
    <aside
      data-state={isOpen ? 'open' : 'close'}
      className={cn(
        'absolute bottom-0 left-0 top-0 z-20 -translate-x-full transition-[width] duration-300 ease-out lg:translate-x-0',
        isOpen
          ? 'w-[var(--dashboard-sidebar-w-expand)]'
          : 'w-[var(--dashboard-sidebar-w)]',
        className
      )}
    >
      <div className='relative flex h-full flex-col space-y-4 overflow-y-auto pb-5 pt-3 shadow-md dark:shadow-zinc-800'>
        <SidebarToggle />
        <Menu type='dashboard' />
      </div>
    </aside>
  );
}

export default Sidebar;
