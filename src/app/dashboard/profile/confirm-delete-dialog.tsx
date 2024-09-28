import { useServerAction } from 'zsa-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import { deleteEducationAction, deleteJobExperienceAction } from './actions';
import { useProfileDialog } from './hooks';

type Props = {};

export const ConfirmDeleteDialog = ({}: Props) => {
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
      execute({ educationId: profileDialog.educationId! });
    } else {
      execute({ jobExperienceId: profileDialog.jobId! });
    }
  };

  if (dialogState.mode !== 'Delete') return null;

  return (
    <ResponsiveDialog
      title={`Confirm ${profileDialog.type} Deletion`}
      description={
        <>
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
