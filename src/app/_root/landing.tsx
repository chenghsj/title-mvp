import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {};

export function LandingPage({}: Props) {
  const tLandingPage = useTranslations('LandingPage');

  return (
    <div className='flex h-full flex-col justify-center gap-8'>
      <div className='text-[56px] font-bold leading-[67.20px]'>
        {tLandingPage('title')}
      </div>
      <p className='mt-4 text-lg'>{tLandingPage('description')}</p>
      <div className='flex gap-4 pt-4'>
        <Button rounded='full' className='h-auto px-6 py-3 text-base' asChild>
          <Link href='/explore'>{tLandingPage('buttons.explore')}</Link>
        </Button>
        <Button
          asChild
          variant='outline'
          rounded='full'
          className='h-auto px-6 py-3 text-base'
        >
          <Link href={'/sign-up'}>{tLandingPage('buttons.sign-up')}</Link>
        </Button>
      </div>
    </div>
  );
}
