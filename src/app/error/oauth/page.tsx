'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Role } from '@/app/_root/types';
import ErrorPage from '@/app/error';
import LoadingPage from '@/app/loading';

type Props = {};

const OAuthErrorPage = (props: Props) => {
  const params = useSearchParams();
  const message = params.get('message');
  const role = params.get('role') as Role;

  const [errorMessage, setErrorMessage] = useState<string>(
    message || 'An oauth error occurred'
  );

  const [loading, setLoading] = useState(true);

  const tErrorMessages = useTranslations('errorMessages.public');
  const tLogin = useTranslations('login');

  useEffect(() => {
    if (message === 'RoleError') {
      setErrorMessage(
        tErrorMessages('RoleError', {
          role: tLogin(role),
        })
      );
    }
    setLoading(false);
  }, [message, role, tErrorMessages, tLogin]);

  if (loading) {
    return <LoadingPage />;
  }

  return <ErrorPage error={{ name: 'OAuthError', message: errorMessage }} />;
};

export default OAuthErrorPage;
