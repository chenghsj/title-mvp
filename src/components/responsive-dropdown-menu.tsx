import React, { ComponentProps, MouseEvent, ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Ellipsis, LucideIcon, Pencil, Trash } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export type ResponsiveDropdownMenuButtonType = {
  text?: string;
  buttonProps?: ComponentProps<typeof Button>;
  iconProps?: ComponentProps<LucideIcon>;
  icon?: LucideIcon;
};

export type MenuItem = {
  text: string;
  icon?: React.ReactNode | null;
  onClick: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  buttonProps?: ComponentProps<typeof Button>;
  iconProps?: ComponentProps<LucideIcon>;
};

type Props = {
  trigger?: JSX.Element;
  editButton?: ResponsiveDropdownMenuButtonType;
  deleteButton?: ResponsiveDropdownMenuButtonType;
  closeButton?: ResponsiveDropdownMenuButtonType;
  handleEditClick: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  handleDeleteClick?: (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => void;
  renderDropdownMenuContent?: ReactNode;
  renderDrawerContent?: ReactNode;
  dropdownMenuContentProps?: ComponentProps<typeof DropdownMenuContent>;
  dropdownMenuItemProps?: ComponentProps<typeof DropdownMenuItem>;
  drawerContentProps?: ComponentProps<typeof DrawerContent>;
};

export const ResponsiveDropdownMenu = ({
  trigger,
  editButton,
  deleteButton,
  closeButton,
  handleEditClick,
  handleDeleteClick,
  drawerContentProps,
  dropdownMenuContentProps,
  dropdownMenuItemProps,
  renderDropdownMenuContent,
  renderDrawerContent,
}: Props) => {
  const t = useTranslations('components.responsiveDropdownMenu.buttons');
  const { isMobile } = useDeviceDetect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const defaultTrigger = (
    <Button variant='ghost' size='icon'>
      <Ellipsis size={18} />
    </Button>
  );

  const TriggerElement = trigger || defaultTrigger;

  const EditIcon = editButton?.icon || Pencil;
  const DeleteIcon = deleteButton?.icon || Trash;

  const menuItems: (MenuItem | null)[] = [
    {
      text: editButton?.text || t('edit'),
      icon: (
        <EditIcon
          {...editButton?.iconProps}
          className={cn('mr-2 h-4 w-4', editButton?.iconProps?.className)}
        />
      ),
      onClick: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        handleEditClick(e);
        setIsDropdownOpen(false);
      },
      buttonProps: editButton?.buttonProps,
    },
    handleDeleteClick
      ? {
          text: deleteButton?.text || t('delete'),
          icon: (
            <DeleteIcon
              {...deleteButton?.iconProps}
              className={cn('mr-2 h-4 w-4', deleteButton?.iconProps?.className)}
            />
          ),
          onClick: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
            handleDeleteClick(e);
            setIsDropdownOpen(false);
          },
          buttonProps: deleteButton?.buttonProps,
        }
      : null,
  ];

  const drawerContent = renderDrawerContent || (
    <DrawerContent
      hideHandle
      className='border-none bg-transparent outline-none dark:bg-transparent'
      {...drawerContentProps}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <div className='hidden'>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <DrawerDescription></DrawerDescription>
      </div>
      <DrawerFooter className='space-y-1 pb-7'>
        <Card className='overflow-hidden rounded-2xl border-none'>
          <CardContent className='space-y-2 p-0 py-2 dark:bg-zinc-900'>
            {menuItems.map(
              (item, index) =>
                item && (
                  <React.Fragment key={index}>
                    {index > 0 && <Separator className='dark:bg-zinc-800' />}
                    <div className='mx-2'>
                      <Button
                        variant='ghost'
                        {...item.buttonProps}
                        className={cn(
                          'w-full rounded-xl text-base ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                          item.buttonProps?.className
                        )}
                        onClick={item.onClick}
                      >
                        {item.text}
                      </Button>
                    </div>
                  </React.Fragment>
                )
            )}
          </CardContent>
        </Card>
        <Card className='overflow-hidden rounded-2xl border-none'>
          <CardContent className='p-0 py-2 dark:bg-zinc-900'>
            <div className='mx-2'>
              <DrawerClose asChild>
                <Button
                  variant='ghost'
                  {...closeButton?.buttonProps}
                  className={cn(
                    'w-full rounded-xl text-center text-base',
                    closeButton?.buttonProps?.className
                  )}
                >
                  {closeButton?.text || t('cancel')}
                </Button>
              </DrawerClose>
            </div>
          </CardContent>
        </Card>
      </DrawerFooter>
    </DrawerContent>
  );

  const dropdownContent = renderDropdownMenuContent || (
    <DropdownMenuContent
      {...dropdownMenuContentProps}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {menuItems.map(
        (item, index) =>
          item && (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              {...dropdownMenuItemProps}
            >
              {item.icon}
              {item.text}
            </DropdownMenuItem>
          )
      )}
    </DropdownMenuContent>
  );

  return isMobile ? (
    <Drawer
      disablePreventScroll={false}
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DrawerTrigger asChild>{TriggerElement}</DrawerTrigger>
      {drawerContent}
    </Drawer>
  ) : (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger
        asChild
        data-prevent-nprogress
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {TriggerElement}
      </DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  );
};
