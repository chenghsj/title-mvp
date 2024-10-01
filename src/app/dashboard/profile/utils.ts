import { getTranslations } from 'next-intl/server';
import { camelCase } from 'lodash';
import { Education } from '@/db/schema';
import { FormType } from './hooks';
import { DegreeType, degreeOrder } from './types';

export const createSortedEducations = (educations: Education[]) =>
  educations.sort(
    (a, b) =>
      degreeOrder[a.degree as DegreeType] - degreeOrder[b.degree as DegreeType]
  );

export const getSuccessMessageByType = async (type: FormType) => {
  const tComponentsToastSuccess = await getTranslations(
    'components.toast.success'
  );
  const tProfileConfirmDeleteDialogType = await getTranslations(
    'profile.confirmDeleteDialog.type'
  );
  return {
    title: tComponentsToastSuccess('confirmDeleteDialog.title'),
    description: tComponentsToastSuccess('confirmDeleteDialog.description', {
      type: tProfileConfirmDeleteDialogType(
        camelCase(
          type
        ) as keyof IntlMessages['profile']['confirmDeleteDialog']['type']
      ),
    }),
  };
};
