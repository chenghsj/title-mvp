'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '@/components/loader-button';
import {
  AlertDialog,
  AlertDialogCancel,
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
import { useToast } from '@/components/ui/use-toast';
import { deleteAccountAction } from './actions';

const deleteSchema = z.object({
  confirm: z.string().refine((v) => v === 'Delete account'),
});

type Props = {};

function AccountPage({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
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

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Delete Account</Button>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <LoaderButton isLoading={isPending} variant='destructive'>
                Delete
              </LoaderButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AccountPage;
