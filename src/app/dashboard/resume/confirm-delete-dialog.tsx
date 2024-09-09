import React from 'react';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '@/components/loader-button';
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
import { useDialogState } from '@/hooks/store';
import { UserId } from '@/use-cases/types';
import { deleteResumeAction } from './actions';
import { useResumeDialog } from './hooks';

type Props = {
  userId: UserId;
};

export const ConfirmDeleteDialog = ({ userId }: Props) => {
  const { toast } = useToast();
  const resumeDialog = useResumeDialog();
  const dialogState = useDialogState();

  const { execute, isPending, error } = useServerAction(deleteResumeAction, {
    onSuccess: () => {
      dialogState.setIsOpen(false);
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
    execute({ userId, resumeId: resumeDialog.resumeId! });
  };

  if (dialogState.mode !== 'Delete') return null;

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={dialogState.setIsOpen}>
      <DialogContent
        className='w-[90%] rounded-md'
        onInteractOutside={(e) => isPending && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Confirm Resume Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the resume &quot;
            <span className='font-extrabold'>{resumeDialog.resumeTitle}</span>
            &quot;?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-y-3'>
          <Button
            onClick={() => dialogState.setIsOpen(false)}
            variant={'secondary'}
            disabled={isPending}
          >
            Close
          </Button>
          <LoaderButton isLoading={isPending} onClick={handleConfirmClick}>
            Confirm
          </LoaderButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
