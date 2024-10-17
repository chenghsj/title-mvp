'use client';

// fix combobox cannot be selected after mobile virtual keyboard is closed
import React, { ComponentProps, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof Drawer>;

export const NestedDrawer = ({
  children,
  open,
  onOpenChange,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <>
      <Drawer open={open ?? isOpen} onOpenChange={onOpenChange ?? setIsOpen}>
        <DrawerHeader className='hidden'>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <DrawerContent onOpenAutoFocus={(e) => e.preventDefault()} />
      </Drawer>
      <Drawer
        modal={false}
        open={open ?? isOpen}
        onOpenChange={onOpenChange ?? setIsOpen}
        {...rest}
      >
        {children}
      </Drawer>
    </>
  );
};
