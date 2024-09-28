'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {};

export const NotFoundPage = (props: Props) => {
  const tNotFound = useTranslations('not-found');
  return (
    <>
      <div className='grid gap-4'>
        <div className='text-center text-lg font-bold'>
          {tNotFound('title')}
        </div>
        <div className='text-center'>{tNotFound('description')}</div>
      </div>
      <Button variant='outline' asChild>
        <Link href='/'>{tNotFound('buttons.back-to-home')}</Link>
      </Button>
    </>
  );
};
