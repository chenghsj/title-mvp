import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { initialRole } from '../@auth/login/role-switch';

type Props = {};

function HomePage({}: Props) {
  return (
    <div className='flex h-full flex-col justify-center gap-8'>
      <div className='text-[56px] font-bold leading-[67.20px]'>
        Discover the power of video resumes
      </div>
      <p className='mt-4 text-lg'>
        Stand out from the crowd with a dynamic video resume that showcases your
        skills and personality.
      </p>
      <div className='flex gap-4 pt-4'>
        <Button rounded='full' className='h-auto px-6 py-3 text-base' asChild>
          <Link href='/explore'>Explore</Link>
        </Button>
        <Button
          asChild
          variant='outline'
          rounded='full'
          className='h-auto px-6 py-3 text-base'
        >
          <Link
            href={{
              pathname: '/sign-up',
              query: { role: initialRole },
            }}
          >
            Sign Up
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
