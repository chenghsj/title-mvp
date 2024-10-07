'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  href?: string;
} & React.ComponentProps<typeof Button>;

const BackButton = (props: Props) => {
  const router = useRouter();

  return (
    <Button
      size={'icon'}
      onClick={() => {
        if (props.href) {
          router.push(props.href);
          return;
        }
        router.back();
      }}
      variant={'ghost'}
      className={cn(props.className)}
    >
      <ChevronLeft size={18} />
    </Button>
  );
};

export default BackButton;
