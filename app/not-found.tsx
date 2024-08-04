import React from 'react';
import Link from 'next/link';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Button } from '@/components/ui/button';

type Props = {};

export default function NotFound() {
  return (
    <SectionExcludeNav className='flex flex-col items-center justify-center gap-20'>
      <div className='grid gap-4'>
        <div className='text-center text-lg font-bold'>Not Found</div>
        <div className='text-center'>Could not find requested resource</div>
      </div>
      <Button variant='outline' asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </SectionExcludeNav>
  );
}
