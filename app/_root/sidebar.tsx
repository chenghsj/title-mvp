'use client';

import React from 'react';
import { MenuIcon } from 'lucide-react';
import { Menu } from '@/components/menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useNavMenu } from '@/hooks/use-store';
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
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className='w-64' side={'left'}>
        <SheetHeader>
          <div className='relative flex h-7 w-full justify-center'>
            <div
              className={cn('relative h-full', isMobile ? 'w-20' : 'w-[136px]')}
              onClick={() => {
                console.log('clicked');
                setIsOpen(false);
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
