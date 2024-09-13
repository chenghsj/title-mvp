'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Education, JobExperience } from '@/db/schema';
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
  educations: Education[] | null;
  jobExperiences: JobExperience[] | null;
  setType: (type: FormType) => void;
  setEducationId: (educationId: number) => void;
  setJobId: (jobId: number) => void;
  setCoverId: (coverId: number) => void;
  setEducations: (educations: Education[]) => void;
  setJobExperiences: (jobExperiences: JobExperience[]) => void;
};

export const useProfileDialog = create<ProfileDialogtate>((set) => ({
  type: null,
  educationId: null,
  jobId: null,
  coverId: null,
  educations: null,
  jobExperiences: null,
  setType: (type) => set({ type }),
  setEducationId: (educationId) => set({ educationId }),
  setJobId: (jobId) => set({ jobId }),
  setCoverId: (coverId) => set({ coverId }),
  setEducations: (educations) => set({ educations }),
  setJobExperiences: (jobExperiences) => set({ jobExperiences }),
}));

export const useReturnByFormType = (formType: FormType) => {
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
