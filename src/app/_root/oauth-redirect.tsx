'use client';

import { useEffect } from 'react';
import { PublicError } from '@/use-cases/errors';
import LoadingPage from '../loading';

type Props = {
  oauthError: string | null;
};

export const OAuthRedirect = ({ oauthError }: Props) => {
  useEffect(() => {
    if (oauthError) {
      throw new PublicError(oauthError);
    }
  }, [oauthError]);

  return <LoadingPage />;
};
