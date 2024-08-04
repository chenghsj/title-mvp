'use client';

import { AppProgressBar } from 'next-nprogress-bar';
import { useTheme } from 'next-themes';

export const ProgressBar = () => {
  const { theme } = useTheme();

  return (
    <AppProgressBar
      height='2px'
      color={theme === 'dark' ? '#fff' : '#000'}
      options={{ showSpinner: false }}
      memo={false}
      shallowRouting
    />
  );
};
