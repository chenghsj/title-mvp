import React from 'react';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Spinner } from '@/components/ui/spinner';

type Props = {};

function LoadingPage({}: Props) {
  return (
    <SectionExcludeNav className='flex items-center justify-center'>
      <Spinner />
    </SectionExcludeNav>
  );
}

export default LoadingPage;
