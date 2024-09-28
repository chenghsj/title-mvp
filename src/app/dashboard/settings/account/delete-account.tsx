'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '@/components/loader-button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { deleteAccountAction } from './actions';

const confirmDeleteString = 'Delete account';

const deleteSchema = z.object({
  confirm: z.string().refine((v) => v === confirmDeleteString),
});

type Props = {};

export const DeleteAccount = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    mode: 'onChange',
    defaultValues: {
      confirm: undefined,
    },
  });

  const { execute: deleteAccount, isPending } = useServerAction(
    deleteAccountAction,
    {
      onSuccess: () => {
        toast({
          title: 'Account Deleted',
          description: 'Your account has been successfully deleted.',
        });
      },
      onError: ({ err }) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to delete account.',
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = () => {
    deleteAccount();
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  return (
    <div className='space-y-3'>
      <div className='text-2xl font-medium text-red-500'>Delete Account</div>
      <Separator />
      <div className='text-sm'>
        Once you delete your account, there is no going back. Please be certain.
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant='destructive' size='sm'>
            Delete your account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all of your data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <p className='text-sm text-red-500'>
            {`Please type 'Delete account' to confirm`}
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
              <AlertDialogFooter>
                <Button
                  variant={'secondary'}
                  type='button'
                  onClick={(e) => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <LoaderButton
                  disabled={!!form.formState.errors.confirm}
                  isLoading={isPending}
                  variant='destructive'
                >
                  Delete
                </LoaderButton>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
