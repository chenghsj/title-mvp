'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLoadingMask } from '@/components/loading-mask';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Button } from '@/components/ui/button';

type Props = { error: Error & { digest?: string } };

function ErrorPage({ error }: Props) {
  const tErrorMessages = useTranslations('errorMessages');
  const { isLoading, setIsLoading } = useLoadingMask();

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, []);
  return (
    <SectionExcludeNav className='flex flex-col items-center justify-center gap-y-4 whitespace-pre text-center'>
      <div className='max-w-md text-wrap'>{error.message}</div>
      <Button asChild variant={'outline'}>
        <Link href={'/sign-in'}>{tErrorMessages('backToSignInPage')}</Link>
      </Button>
    </SectionExcludeNav>
  );
}

export default ErrorPage;
