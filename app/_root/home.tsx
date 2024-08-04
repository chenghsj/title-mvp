'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { loginPath } from '@/config/site';
import { pathMatcher } from '@/config/validation';
import { cn } from '@/lib/utils';
import { LoginPage } from './_login/login';
import { LandingPage } from './landing';

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
