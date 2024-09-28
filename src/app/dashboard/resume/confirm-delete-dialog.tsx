'use client';

import { useServerAction } from 'zsa-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import { deleteResumeAction } from './actions';
import { useResumeDialog } from './hooks';

type Props = {};

export const ConfirmDeleteDialog = ({}: Props) => {
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
    execute({ resumeId: resumeDialog.resumeId! });
  };

  if (dialogState.mode !== 'Delete') return null;

  return (
    <ResponsiveDialog
      title='Confirm Resume Deletion'
      description={
        <>
          Are you sure you want to delete the resume {'"'}
          <span className='font-extrabold'>{resumeDialog.resumeTitle}</span>
          {'"'}?
        </>
      }
      dialogContentProps={{
        className: 'max-w-[500px]',
      }}
      submitButton={{
        title: 'Confirm',
        props: {
          onClick: handleConfirmClick,
          isLoading: isPending,
        },
      }}
    />
  );
};
