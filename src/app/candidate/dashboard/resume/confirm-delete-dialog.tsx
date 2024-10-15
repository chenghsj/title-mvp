'use client';

import { useTranslations } from 'next-intl';
import { useServerAction } from 'zsa-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import { deleteResumeAction } from './actions';
import { useResumeDialog } from './hooks';

type Props = {};

export const ConfirmDeleteDialog = ({}: Props) => {
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tResume = useTranslations('resume');
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
      dialogState.setIsOpen(false);
      toast({
        title: err.code,
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
      title={tResume('confirmDeleteDialog.title')}
      description={tResume.rich('confirmDeleteDialog.description', {
        resumeTitle: resumeDialog.resumeTitle,
        strong: (chunks) => <span className='font-extrabold'>{chunks}</span>,
      })}
      dialogContentProps={{
        className: 'max-w-[500px]',
      }}
      submitButton={{
        title: tComponentsResponsiveDialog('buttons.confirm'),
        props: {
          onClick: handleConfirmClick,
          isLoading: isPending,
        },
      }}
    />
  );
};
