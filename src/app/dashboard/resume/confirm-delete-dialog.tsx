import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { UserId } from '@/use-cases/types';
import { deleteResumeAction } from './actions';
import { useConfirmDialog } from './hooks';

type Props = {
  userId: UserId;
};

export const ConfirmDeleteDialog = ({ userId }: Props) => {
  const { toast } = useToast();
  const confirmDialog = useConfirmDialog();

  const { execute, isPending, error } = useServerAction(deleteResumeAction, {
    onSuccess: () => {
      confirmDialog.setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Resume deleted',
      });
    },
    onError: ({ err }) => {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const handleConfirmClick = () => {
    execute({ userId, resumeId: confirmDialog.resumeId! });
  };

  return (
    <Dialog open={confirmDialog.isOpen} onOpenChange={confirmDialog.setIsOpen}>
      <DialogContent
        className='w-[90%] rounded-md'
        onInteractOutside={(e) => isPending && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Confirm Resume Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the resume &quot;
            <span className='font-extrabold'>{confirmDialog.resumeTitle}</span>
            &quot;?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-y-3'>
          <Button
            onClick={() => confirmDialog.setIsOpen(false)}
            variant={'secondary'}
            disabled={isPending}
          >
            Close
          </Button>
          <Button disabled={isPending} onClick={handleConfirmClick}>
            {isPending && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
