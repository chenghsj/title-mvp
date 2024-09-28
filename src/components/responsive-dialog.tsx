import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useResizeObserver } from 'usehooks-ts';
import { LoaderButton } from '@/components/loader-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useDialogState } from '@/hooks/store';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

type FooterButtonProps<T> = {
  title?: string;
  props?: T;
};

type Props = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  content?: (footer: React.ReactNode) => JSX.Element;
  submitButton?: FooterButtonProps<React.ComponentProps<typeof LoaderButton>>;
  closeButton?: FooterButtonProps<React.ComponentProps<typeof Button>>;
  dialogContentProps?: React.ComponentProps<typeof DialogContent>;
  drawerContentProps?: React.ComponentProps<typeof DrawerContent>;
  dialogFooterProps?: React.ComponentProps<typeof DialogFooter>;
  drawerFooterProps?: React.ComponentProps<typeof DrawerFooter>;
};

export const ResponsiveDialog = ({
  title,
  description,
  content,
  submitButton,
  closeButton,
  dialogContentProps,
  drawerContentProps,
  dialogFooterProps,
  drawerFooterProps,
}: Props) => {
  const t = useTranslations('components.responsiveDialog.buttons');
  const contentRef = useRef<HTMLDivElement>(null);
  const { height } = useResizeObserver({
    ref: contentRef,
  });

  const dialogState = useDialogState();
  const { isMobile } = useDeviceDetect();

  const CloseButton = (
    <Button
      type='button'
      variant='secondary'
      {...closeButton?.props}
      onClick={() => {
        dialogState.setIsOpen(false);
      }}
    >
      {closeButton?.title || t('cancel')}
    </Button>
  );

  const SubmitButton = (
    <LoaderButton
      type='submit'
      isLoading={submitButton?.props?.isLoading || false}
      {...submitButton?.props}
    >
      {submitButton?.title ||
        (dialogState.mode === 'Add' ? t('create') : t('update'))}
    </LoaderButton>
  );

  const FooterComponent = isMobile ? DrawerFooter : DialogFooter;
  const CloseComponent = isMobile ? DrawerClose : DialogClose;

  const Footer = (
    <FooterComponent
      className={cn('gap-y-3', isMobile && 'flex-col-reverse px-0')}
      {...(isMobile ? drawerFooterProps : dialogFooterProps)}
    >
      <CloseComponent asChild>{CloseButton}</CloseComponent>
      {SubmitButton}
    </FooterComponent>
  );

  const Content = content ? content(Footer) : Footer;

  return isMobile ? (
    <Drawer open={dialogState.isOpen} onOpenChange={dialogState.setIsOpen}>
      <DrawerContent
        className='px-5 pb-5'
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...drawerContentProps}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <ScrollArea className='overflow-y-auto'>
          <div className='mx-1'>{Content}</div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={dialogState.isOpen} onOpenChange={dialogState.setIsOpen}>
      <DialogContent
        ref={contentRef}
        className='h-fit max-h-[80%] w-[90%] max-w-[800px] rounded-lg'
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...dialogContentProps}
        style={{ height }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className='overflow-y-auto'>
          <div className='mx-1'>{Content}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
