'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { TanstackQueryProvider } from '@/components/providers/tanstack-query-provider';
import { SessionProvider } from '@/hooks/use-session';
import { validateRequest } from '@/lib/auth';

type ProvidersProps = {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  session: Awaited<ReturnType<typeof validateRequest>>;
};

export const Providers = ({
  children,
  themeProps,
  session,
}: ProvidersProps) => {
  return (
    <TanstackQueryProvider>
      <SessionProvider session={session}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </SessionProvider>
    </TanstackQueryProvider>
  );
};
