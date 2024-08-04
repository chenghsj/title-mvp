'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Button } from '@/components/ui/button';

type Props = {};

function ErrorPage({}: Props) {
  const params = useSearchParams();
  const status = params.get('status');
  const message = params.get('message');

  return (
    <SectionExcludeNav className='flex flex-col items-center justify-center gap-y-4 whitespace-pre text-center'>
      {message}
      <Button asChild variant={'outline'}>
        <Link href={'/sign-in'}>Back to sign in page</Link>
      </Button>
    </SectionExcludeNav>
  );
}

export default ErrorPage;
