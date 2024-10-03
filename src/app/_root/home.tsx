'use client';

import { usePathname } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { loginPath } from '@/config/site';
import { cn } from '@/lib/utils';
import { LoginPage } from './_login/login';
import { LandingPage } from './landing';
import { pathMatcher } from './utils';

type Props = {};

export function MainHomePage({}: Props) {
  const pathname = usePathname();
  const isMatchLogin = pathMatcher(pathname, loginPath);

  return (
    <div
      className={cn(
        'col-span-2 lg:col-span-1',
        isMatchLogin && 'my-5 overflow-y-auto'
      )}
    >
      {isMatchLogin ? <LoginPage /> : <LandingPage />}
    </div>
  );
}

export function RestHomePage() {
  const pathname = usePathname();
  const isMatchLogin = pathMatcher(pathname, loginPath);

  return isMatchLogin ? <></> : <SectionExcludeNav>home</SectionExcludeNav>;
}
