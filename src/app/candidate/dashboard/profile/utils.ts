import { getTranslations } from 'next-intl/server';
import { camelCase } from 'lodash';
import { Education } from '@/db/schema';
import { DegreeType, degreeOrder } from './types';

export const createSortedEducations = (educations: Education[]) =>
  educations.sort(
    (a, b) =>
      degreeOrder[a.degree as DegreeType] - degreeOrder[b.degree as DegreeType]
  );

export const getDeletedMessageByType = async (
  type: keyof IntlMessages['profile']
) => {
  const tComponentsToastSuccess = await getTranslations(
    'components.toast.success'
  );
  const tProfileConfirmDeleteDialogType = await getTranslations(
    'profile.confirmDeleteDialog.type'
  );
  return {
    title: tComponentsToastSuccess('title'),
    description: tComponentsToastSuccess('confirmDeleteDialog.description', {
      type: tProfileConfirmDeleteDialogType(
        camelCase(
          type
        ) as keyof IntlMessages['profile']['confirmDeleteDialog']['type']
      ),
    }),
  };
};

export const getTranslationsByType = async (
  type: keyof IntlMessages['profile'],
  mode: keyof IntlMessages['components']['responsiveDialog']['buttons']
) => {
  const tComponentsToast = await getTranslations('components.toast');
  const tComponentsResponsiveDialogButtons = await getTranslations(
    'components.responsiveDialog.buttons'
  );
  const tProfile = await getTranslations('profile');

  const profileType = tProfile(
    `${camelCase(type) as keyof IntlMessages['profile']}.title`
  );
  const dialogMode = tComponentsResponsiveDialogButtons(mode);

  return {
    title: tComponentsToast('success.title'),
    description: tComponentsToast('success.profile.description', {
      type: profileType,
      mode: dialogMode.toLocaleLowerCase(),
    }),
  };
};
