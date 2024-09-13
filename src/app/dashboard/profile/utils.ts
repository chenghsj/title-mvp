import { Education } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import { useProfileDialog } from './hooks';
import { ButtonClickHandler, DegreeType, degreeOrder } from './type';

export const createSortedEducations = (educations: Education[]) =>
  educations.sort(
    (a, b) =>
      degreeOrder[a.degree as DegreeType] - degreeOrder[b.degree as DegreeType]
  );

export const useCreateHandleMenuButtonClick = () => {
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();

  const handleMenuButtonClick: ButtonClickHandler =
    (mode, formType, id) => (e) => {
      if (mode === 'Edit' || mode === 'Delete') {
        if (formType === 'Education') {
          profileDialog.setEducationId(id!);
        } else if (formType === 'Job') {
          profileDialog.setJobId(id!);
        } else if (formType === 'Cover') {
          profileDialog.setCoverId(id!);
        }
      }
      dialogState.setIsOpen(true);
      dialogState.setMode(mode);
      profileDialog.setType(formType);
    };

  return { handleMenuButtonClick };
};
