import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { camelCase } from 'lodash';
import { useServerAction } from 'zsa-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import {
  deleteEducationAction,
  deleteJobExperienceAction,
  deleteProfileImageAction,
} from './actions';
import { FormType, useProfileDialog } from './hooks';

type Props = {};

export const ConfirmDeleteDialog = ({}: Props) => {
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tProfileConfirmDeleteDialog = useTranslations(
    'profile.confirmDeleteDialog'
  );
  const tProfileConfirmDeleteDialogType = useTranslations(
    'profile.confirmDeleteDialog.type'
  );
  const tProfileEducationDegrees = useTranslations('profile.education.degrees');

  const { toast } = useToast();
  const profileDialog = useProfileDialog();
  const dialogState = useDialogState();
  const profileDialogTypeRef = useRef<FormType | null>(null);

  useEffect(() => {
    profileDialogTypeRef.current = profileDialog.type;
  }, [profileDialog.type]);

  const serverActions: { [key in FormType]?: any } = {
    Education: deleteEducationAction,
    JobExperience: deleteJobExperienceAction,
    Avatar: deleteProfileImageAction,
    Cover: deleteProfileImageAction,
  };

  const serverAction = serverActions[profileDialog.type!];

  const { execute, isPending } = useServerAction(serverAction, {
    onSuccess: ({ data }) => {
      dialogState.setIsOpen(false);
      toast({
        title: data.message.title,
        description: data.message.description,
      });
    },
    onError: ({ err }) => {
      console.log(err);
      toast({
        title: err.code,
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const handleConfirmClick = () => {
    switch (profileDialog.type) {
      case 'Education':
        execute({ educationId: profileDialog.educationId! });
        break;
      case 'JobExperience':
        execute({ jobExperienceId: profileDialog.jobId! });
        break;
      case 'Avatar':
        execute({ type: 'avatar' });
        break;
      case 'Cover':
        execute({ type: 'cover' });
        break;
      default:
        break;
    }
  };

  const getTitleType = () =>
    tProfileConfirmDeleteDialogType(
      camelCase(
        profileDialog.type!
      ) as keyof IntlMessages['profile']['confirmDeleteDialog']['type']
    );

  const getDescriptionTypePrefix = () => {
    switch (profileDialog.type) {
      case 'Education': {
        const degree = profileDialog.educations?.find(
          (edu) => edu.id === profileDialog.educationId
        )?.degree;
        return tProfileEducationDegrees(
          camelCase(
            degree!
          ) as keyof IntlMessages['profile']['education']['degrees']
        );
      }
      case 'JobExperience': {
        const company = profileDialog.jobExperiences?.find(
          (job) => job.id === profileDialog.jobId
        )?.company;
        return company;
      }
      case 'Avatar':
      case 'Cover':
        return tProfileConfirmDeleteDialogType(
          camelCase(
            profileDialog.type!
          ) as keyof IntlMessages['profile']['confirmDeleteDialog']['type']
        );
      default:
        return '';
    }
  };

  const getDescriptionTypeSuffix = () => {
    switch (profileDialog.type) {
      case 'Education':
        return tProfileConfirmDeleteDialogType('education');
      case 'JobExperience':
        return tProfileConfirmDeleteDialogType('experience');
      case 'Avatar':
      case 'Cover':
        return tProfileConfirmDeleteDialogType('image');
      default:
        return '';
    }
  };

  if (dialogState.mode !== 'Delete') return null;

  return (
    <ResponsiveDialog
      title={tProfileConfirmDeleteDialog('title', {
        title: getTitleType(),
      })}
      description={tProfileConfirmDeleteDialog.rich('description', {
        prefix: getDescriptionTypePrefix(),
        suffix: getDescriptionTypeSuffix(),
        strong: (chunks) => <span className='font-bold'>{chunks}</span>,
      })}
      dialogContentProps={{
        className: 'max-w-[500px] w-[90%] rounded-lg',
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
