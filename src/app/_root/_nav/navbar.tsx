import * as React from 'react';
import { cache } from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { deviceDetect } from '@/lib/device-check';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { getDashboardProfileUseCase } from '@/use-cases/users';
import { Sidebar } from '../sidebar';
import { AvatarWithDropdownMenu } from './avatar-with-dropdown-menu';
import LocaleSwitcher from './locale-switch';
import { LogoLink } from './logo-link';
import { Navigation } from './navigation';
import { ThemeSwitch } from './theme-switch';

type Props = {
  children?: React.ReactNode;
};

const profilerLoader = cache(getDashboardProfileUseCase);

export async function Navbar({ children }: Props) {
  const t = await getTranslations('navbar');
  const user = await getCurrentUser();
  const { isMobile } = deviceDetect();
  let profile = null;
  let avatarUrl = null;

  if (user) {
    const { profile: fetchedProfile, avatarUrl: fetchedAvatarUrl } =
      await profilerLoader(user.id);
    profile = fetchedProfile;
    avatarUrl = fetchedAvatarUrl;
  }

  return (
    <div
      className={cn(
        'sticky top-0 z-50 flex w-full items-center justify-between border-[0.5px] border-r-0 border-b-zinc-300 bg-white text-base opacity-100 dark:border-b-zinc-600 dark:bg-zinc-950',
        'px-3 py-0 md:px-10 md:py-4 xl:px-16',
        isMobile ? 'pr-5' : 'pr-8',
        isMobile ? 'h-[var(--nav-h-sm)]' : 'h-[var(--nav-h-md)]'
      )}
    >
      <div className='flex h-full items-center'>
        <Sidebar isMobile={isMobile} />
        <div
          className={cn(
            'relative ml-3 h-full',
            isMobile ? 'ml-2 w-16' : 'w-[136px]'
          )}
        >
          <LogoLink />
        </div>
      </div>
      <div className='flex'>
        <Navigation />
        <div className='ml-3 flex items-center gap-2 md:gap-3'>
          <div className='flex flex-nowrap'>
            <ThemeSwitch />
            <LocaleSwitcher />
          </div>
          {user ? (
            <AvatarWithDropdownMenu profile={profile!} avatarUrl={avatarUrl} />
          ) : (
            <>
              <Button
                className={cn('text-xs md:text-sm', isMobile ? 'h-8' : 'h-9')}
                variant='outline'
                asChild
              >
                <Link href={'/sign-up'}>{t('buttons.sign-up')}</Link>
              </Button>
              <Button
                className={cn('text-xs md:text-sm', isMobile ? 'h-8' : 'h-9')}
                asChild
              >
                <Link href={'/sign-in'}>{t('buttons.sign-in')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
