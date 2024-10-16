'use client';

import * as React from 'react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { LoadingMaskProvider } from '@/components/loading-mask';
import { TanstackQueryProvider } from '@/components/providers/tanstack-query-provider';
import { SessionProvider } from '@/hooks/use-session';
import { validateRequest } from '@/lib/auth';
import { ZodErrorMapLayout } from './zod-error-map-layout';

type ProvidersProps = {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  session: Awaited<ReturnType<typeof validateRequest>>;
  messages: AbstractIntlMessages;
  locale: string;
  timeZone: string;
};

export const Providers = ({
  children,
  themeProps,
  session,
  messages,
  locale,
  timeZone,
}: ProvidersProps) => {
  return (
    <TanstackQueryProvider>
      <SessionProvider session={session}>
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone={timeZone}
        >
          <ZodErrorMapLayout>
            <NextThemesProvider {...themeProps}>
              <LoadingMaskProvider>{children}</LoadingMaskProvider>
            </NextThemesProvider>
          </ZodErrorMapLayout>
        </NextIntlClientProvider>
      </SessionProvider>
    </TanstackQueryProvider>
  );
};
