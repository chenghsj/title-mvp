'use client';

import { MouseEvent, useEffect, useState } from 'react';
import { create } from 'zustand';
import { Education, JobExperience } from '@/db/schema/candidate';
import { ModeType, useDialogState } from '@/hooks/store';

const ProfileType = {
  Education: 'Education',
  JobExperience: 'Job Experience',
  Cover: 'Cover',
  Avatar: 'Avatar',
  DisplayName: 'DisplayName',
} as const;

export type FormType = keyof typeof ProfileType;

type ProfileDialogtate = {
  type: FormType | null;
  educationId: number | null;
  jobId: number | null;
  coverId: string | null;
  imageId: string | null;
  educations: Education[] | null;
  jobExperiences: JobExperience[] | null;
  setType: (type: FormType) => void;
  setEducationId: (educationId: number) => void;
  setJobId: (jobId: number) => void;
  setCoverId: (coverId: string) => void;
  setImageId: (imageId: string) => void;
  setEducations: (educations: Education[]) => void;
  setJobExperiences: (jobExperiences: JobExperience[]) => void;
};

export const useProfileDialog = create<ProfileDialogtate>((set) => ({
  type: null,
  educationId: null,
  jobId: null,
  coverId: null,
  imageId: null,
  educations: null,
  jobExperiences: null,
  setType: (type) => set({ type }),
  setEducationId: (educationId) => set({ educationId }),
  setJobId: (jobId) => set({ jobId }),
  setCoverId: (coverId) => set({ coverId }),
  setImageId: (imageId) => set({ imageId }),
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

type ButtonClickHandler = (
  mode: ModeType,
  formType: FormType,
  id?: number | string
) => (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;

export const useCreateHandleMenuButtonClick = () => {
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();

  const handleMenuButtonClick: ButtonClickHandler =
    (mode, formType, id) => (e) => {
      if (mode === 'Edit' || mode === 'Delete') {
        if (formType === 'Education') {
          profileDialog.setEducationId(id! as number);
        } else if (formType === 'JobExperience') {
          profileDialog.setJobId(id! as number);
        } else if (formType === 'Cover') {
          profileDialog.setCoverId(id! as string);
        } else if (formType === 'Avatar') {
          profileDialog.setImageId(id! as string);
        }
      }
      dialogState.setIsOpen(true);
      dialogState.setMode(mode);
      profileDialog.setType(formType);
    };

  return { handleMenuButtonClick };
};
