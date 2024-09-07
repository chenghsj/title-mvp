'use client';

import React from 'react';
import { LuMenu } from 'react-icons/lu';
import { Menu } from '@/components/menu/menu';
import { useNavMenu } from '@/components/menu/store';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { LogoLink } from './_nav/logo-link';

type Props = {
  isMobile?: boolean;
};

export function Sidebar({ isMobile }: Props) {
  const { isOpen, setIsOpen } = useNavMenu();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className='md:hidden'>
        <Button
          className='h-8 w-9 border-opacity-25 dark:border-zinc-600'
          variant='outline'
          size={'icon'}
        >
          <LuMenu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className='w-64' side={'left'}>
        <SheetHeader>
          <div className='relative flex h-7 w-full justify-center'>
            <div
              className={cn('relative h-full', isMobile ? 'w-20' : 'w-[136px]')}
              onClick={() => {
                setIsOpen();
              }}
            >
              <LogoLink />
            </div>
          </div>
        </SheetHeader>
        <Menu type='nav' />
      </SheetContent>
    </Sheet>
  );
}
