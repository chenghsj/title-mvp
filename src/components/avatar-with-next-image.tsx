import React from 'react';
import { Suspense } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Props = {
  avatarUrl: string | null | undefined;
  avatarFallback: React.ReactNode;
  imageProps?: React.ComponentProps<typeof Image>;
  avatarProps?: React.ComponentProps<typeof Avatar>;
};

export const AvatarWithNextImage = ({
  avatarUrl,
  avatarProps,
  imageProps,
  avatarFallback,
}: Props) => {
  return (
    <Avatar {...avatarProps}>
      <Suspense fallback={avatarFallback}>
        {avatarUrl ? (
          <Image
            className='h-full w-full object-contain'
            src={avatarUrl}
            fill
            alt='profile image'
            {...imageProps}
          />
        ) : (
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        )}
      </Suspense>
    </Avatar>
  );
};
