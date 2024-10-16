'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '@/components/loader-button';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { deleteAccountAction } from './actions';

const confirmDeleteString = 'Delete account';

const deleteSchema = (t: ReturnType<typeof useTranslations<'zod'>>) =>
  z.object({
    confirm: z
      .string({ required_error: t('custom.invalid_string.required') })
      .refine((v) => v === confirmDeleteString, {
        message: t('custom.invalid_string.string_not_match'),
      }),
  });

type DeleteSchemaSchemaType = z.infer<ReturnType<typeof deleteSchema>>;

type Props = {};

export const DeleteAccount = (props: Props) => {
  const { isMobile } = useDeviceDetect();
  const { toast } = useToast();
  const dialogState = useDialogState();
  const router = useRouter();

  const tZod = useTranslations('zod');
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tSettingsSubmenusAccount = useTranslations('settings.submenus.account');

  const form = useForm<DeleteSchemaSchemaType>({
    resolver: zodResolver(deleteSchema(tZod)),
    mode: 'onChange',
    defaultValues: {
      confirm: undefined,
    },
  });

  const { execute: deleteAccount, isPending } = useServerAction(
    deleteAccountAction,
    {
      onSuccess: ({ data }) => {
        toast({
          title: data.message.title,
          description: data.message.description,
        });
        dialogState.setIsOpen(false);
        router.push('/');
        router.refresh();
      },
      onError: ({ err }) => {
        toast({
          title: err.code,
          description: err.message || 'Failed to delete account.',
          variant: 'destructive',
        });
        dialogState.setIsOpen(false);
      },
    }
  );

  const onSubmit = () => {
    deleteAccount();
  };

  const content = (footer: React.ReactNode) => (
    <div className='space-y-2'>
      <p className='text-sm text-red-500'>
        {tSettingsSubmenusAccount.rich('form.placeholders.confirm', {
          keyword: `'${confirmDeleteString}'`,
        })}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FormField
            control={form.control}
            name='confirm'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder={confirmDeleteString} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter
            className={cn('gap-y-3', isMobile && 'flex-col-reverse px-0')}
          >
            <Button
              variant={'secondary'}
              type='button'
              onClick={(e) => dialogState.setIsOpen(false)}
            >
              {tComponentsResponsiveDialog('buttons.cancel')}
            </Button>
            <LoaderButton
              disabled={!!form.formState.errors.confirm}
              isLoading={isPending}
              variant='destructive'
            >
              {tComponentsResponsiveDialog('buttons.delete')}
            </LoaderButton>
          </AlertDialogFooter>
        </form>
      </Form>
    </div>
  );

  useEffect(() => {
    if (!dialogState.isOpen) {
      form.reset();
    }
  }, [dialogState.isOpen]);

  return (
    <div className='space-y-3'>
      <div className='text-2xl font-medium text-red-500'>
        {tSettingsSubmenusAccount('deleteAccount.title')}
      </div>
      <Separator />
      <div className='text-sm'>
        {tSettingsSubmenusAccount('deleteAccount.description')}
      </div>
      <Button
        variant='destructive'
        size='sm'
        onClick={() => dialogState.setIsOpen(true)}
      >
        {tSettingsSubmenusAccount('deleteAccount.trigger.title')}
      </Button>
      <ResponsiveDialog
        title={tSettingsSubmenusAccount('form.title')}
        description={tSettingsSubmenusAccount('form.description')}
        dialogContentProps={{
          className: 'max-w-[500px]',
        }}
        content={content}
      />
    </div>
  );
};
