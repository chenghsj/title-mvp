'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

type ProvidersProps = {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  // session: Awaited<ReturnType<typeof validateRequest>>;
};

export const Providers = ({ children, themeProps }: ProvidersProps) => {
  return <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>;
};
