'use client';

import React from 'react';
import Link from 'next/link';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Button } from '@/components/ui/button';

type Props = { error: Error & { digest?: string } };

function ErrorPage({ error }: Props) {
  return (
    <SectionExcludeNav className='flex flex-col items-center justify-center gap-y-4 whitespace-pre text-center'>
      {error.message}
      <Button asChild variant={'outline'}>
        <Link href={'/sign-in'}>Back to sign in page</Link>
      </Button>
    </SectionExcludeNav>
  );
}

export default ErrorPage;
