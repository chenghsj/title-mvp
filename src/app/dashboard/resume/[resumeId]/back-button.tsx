'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {};

const BackButton = (props: Props) => {
  const router = useRouter();

  return (
    <Button
      size={'icon'}
      onClick={() => {
        router.back();
      }}
      variant={'ghost'}
    >
      <ChevronLeft />
    </Button>
  );
};

export default BackButton;
