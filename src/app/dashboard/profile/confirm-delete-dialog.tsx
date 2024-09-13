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
import { deleteEducationAction, deleteJobExperienceAction } from './actions';
import { useProfileDialog } from './hooks';

type Props = {
  userId: UserId;
};

export const ConfirmDeleteDialog = ({ userId }: Props) => {
  const { toast } = useToast();
  const profileDialog = useProfileDialog();
  const dialogState = useDialogState();

  const { execute, isPending, error } = useServerAction(
    profileDialog.type === 'Education'
      ? deleteEducationAction
      : deleteJobExperienceAction,
    {
      onSuccess: () => {
        dialogState.setIsOpen(false);
        toast({
          title: 'Success',
          description: `${profileDialog.type === 'Education' ? 'Education' : 'Experience'} deleted`,
        });
      },
      onError: ({ err }) => {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const handleConfirmClick = () => {
    if (profileDialog.type === 'Education') {
      execute({ userId, educationId: profileDialog.educationId! });
    } else {
      execute({ userId, jobExperienceId: profileDialog.jobId! });
    }
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
            Are you sure you want to delete the{' '}
            <span className='font-bold'>
              {profileDialog.type === 'Education'
                ? profileDialog.educations?.find(
                    (edu) => edu.id === profileDialog.educationId
                  )?.degree
                : profileDialog.jobExperiences?.find(
                    (job) => job.id === profileDialog.jobId
                  )?.company}
            </span>{' '}
            {profileDialog.type === 'Education' ? 'degree' : 'experience'}?
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
