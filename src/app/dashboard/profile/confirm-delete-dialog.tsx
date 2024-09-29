import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
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
  const locale = useLocale();
  const { toast } = useToast();
  const profileDialog = useProfileDialog();
  const dialogState = useDialogState();
  const tComponentsToast = useTranslations('components.toast');
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tProfileConfirmDeleteDialog = useTranslations(
    'profile.confirmDeleteDialog'
  );
  const tProfileConfirmDeleteDialogType = useTranslations(
    'profile.confirmDeleteDialog.type'
  );
  const tProfileEducationsDegrees = useTranslations(
    'profile.educations.degrees'
  );

  const getServerAction = (type: FormType) => {
    switch (type) {
      case 'Education':
        return deleteEducationAction;
      case 'Job':
        return deleteJobExperienceAction;
      case 'Avatar':
      case 'Cover':
        return deleteProfileImageAction;
      default:
        return null;
    }
  };

  const serverAction = getServerAction(profileDialog.type!) || null;

  const { execute, isPending, error } = useServerAction(serverAction!, {
    onSuccess: () => {
      dialogState.setIsOpen(false);
      toast({
        title: tComponentsToast('success.comfirmDeleteDialog.title'),
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
  });

  const handleConfirmClick = () => {
    if (profileDialog.type === 'Education') {
      execute({ educationId: profileDialog.educationId! });
    } else if (profileDialog.type === 'Job') {
      execute({ jobExperienceId: profileDialog.jobId! });
    } else if (profileDialog.type === 'Avatar') {
      execute({ type: 'avatar' });
    } else if (profileDialog.type === 'Cover') {
      execute({ type: 'cover' });
    }
  };

  const titleType = useMemo(() => {
    if (profileDialog.type === 'Education') {
      return 'Education';
    } else if (profileDialog.type === 'Job') {
      return 'Job Experience';
    } else if (profileDialog.type === 'Avatar') {
      return 'Avatar';
    } else if (profileDialog.type === 'Cover') {
      return 'Cover';
    }
    return '';
  }, [profileDialog.type, locale]);

  const descirptionTypePrefix = useMemo(() => {
    if (profileDialog.type === 'Education') {
      const degree = profileDialog.educations?.find(
        (edu) => edu.id === profileDialog.educationId
      )?.degree;
      return tProfileEducationsDegrees(
        camelCase(
          degree!
        ) as keyof IntlMessages['profile']['educations']['degrees']
      );
    } else if (profileDialog.type === 'Job') {
      const company = profileDialog.jobExperiences?.find(
        (job) => job.id === profileDialog.jobId
      )?.company;
      return company;
    } else if (profileDialog.type === 'Avatar') {
      return tProfileConfirmDeleteDialogType('avatar');
    } else if (profileDialog.type === 'Cover') {
      return tProfileConfirmDeleteDialogType('cover');
    }
    return '';
  }, [profileDialog.type, locale]);

  const descirptionTypeSuffix = useMemo(() => {
    if (profileDialog.type === 'Education') {
      return tProfileConfirmDeleteDialogType('education');
    } else if (profileDialog.type === 'Job') {
      return tProfileConfirmDeleteDialogType('expreience');
    } else if (
      profileDialog.type === 'Avatar' ||
      profileDialog.type === 'Cover'
    ) {
      return tProfileConfirmDeleteDialogType('image');
    }
    return '';
  }, [profileDialog.type, locale]);

  if (dialogState.mode !== 'Delete') return null;

  return (
    <ResponsiveDialog
      title={tProfileConfirmDeleteDialog('title', {
        title: tProfileConfirmDeleteDialogType(
          camelCase(
            titleType
          ) as keyof IntlMessages['profile']['confirmDeleteDialog']['type']
        ),
      })}
      description={tProfileConfirmDeleteDialog.rich('description', {
        prefix: descirptionTypePrefix,
        suffix: descirptionTypeSuffix,
        strong: (chunks) => <span className='font-bold'>{chunks}</span>,
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
