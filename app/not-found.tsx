import React from 'react';
import Link from 'next/link';
import { SectionExcludingNav } from '@/components/styled/styled-section';
import { Button } from '@/components/ui/button';

type Props = {};

export default function NotFound() {
  return (
    <SectionExcludingNav className='flex flex-col items-center justify-center gap-20'>
      <div className='grid gap-4'>
        <div className='text-center text-lg font-bold'>Not Found</div>
        <div className='text-center'>Could not find requested resource</div>
      </div>
      <Button variant='outline' asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </SectionExcludingNav>
  );
}
