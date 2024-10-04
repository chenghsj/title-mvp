import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {};

export function LandingPage({}: Props) {
  const tLandingPage = useTranslations('LandingPage');

  return (
    <div className='flex h-full flex-col justify-center gap-4'>
      <div className='text-[56px] font-bold leading-[67.20px]'>
        {tLandingPage('title')}
      </div>
      <p className='mt-4 text-lg'>{tLandingPage('description')}</p>
      <div className='flex gap-4 pt-4'>
        <Button size={'lg'} asChild>
          <Link href='/explore'>{tLandingPage('buttons.explore')}</Link>
        </Button>
        <Button size={'lg'} asChild variant='outline'>
          <Link href={'/sign-up'}>{tLandingPage('buttons.sign-up')}</Link>
        </Button>
      </div>
    </div>
  );
}
