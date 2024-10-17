// fix combobox cannot be selected after mobile virtual keyboard is closed
import React, { ComponentProps } from 'react';
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
  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerHeader className='hidden'>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <DrawerContent onOpenAutoFocus={(e) => e.preventDefault()} />
      </Drawer>
      <Drawer modal={false} open={open} onOpenChange={onOpenChange} {...rest}>
        {children}
      </Drawer>
    </>
  );
};
