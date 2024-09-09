import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { useDialogState } from '@/hooks/store';

const ProfileType = {
  Education: 'Education',
  Job: 'Job',
  Cover: 'Cover',
} as const;

export type FormType = keyof typeof ProfileType;

type ProfileDialogtate = {
  type: FormType | null;
  educationId: number | null;
  jobId: number | null;
  coverId: number | null;
  setType: (type: FormType) => void;
  setEducationId: (educationId: number) => void;
  setJobId: (jobId: number) => void;
  setCoverId: (coverId: number) => void;
};

export const useProfileDialog = create<ProfileDialogtate>((set) => ({
  type: null,
  educationId: null,
  jobId: null,
  coverId: null,
  setType: (type) => set({ type }),
  setEducationId: (educationId) => set({ educationId }),
  setJobId: (jobId) => set({ jobId }),
  setCoverId: (coverId) => set({ coverId }),
}));

export const useReturnbyFormType = (formType: FormType) => {
  const [shouldReturn, setShouldReturn] = useState(false);
  const profileDialog = useProfileDialog();
  const dialogState = useDialogState();

  useEffect(() => {
    if (
      profileDialog.type !== formType ||
      (dialogState.mode !== 'Add' && dialogState.mode !== 'Edit')
    ) {
      setShouldReturn(true);
    } else {
      setShouldReturn(false);
    }
  }, [profileDialog.type, dialogState.mode]);

  return { shouldReturn };
};
