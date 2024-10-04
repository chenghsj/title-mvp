import { MouseEvent } from 'react';
import { create } from 'zustand';
import { ModeType, useDialogState } from '@/hooks/store';

type ResumeDialogState = {
  resumeId: number | null;
  resumeTitle: string | null;
  setResumeId: (resumeId: number) => void;
  setResumeTitle: (resumeTitle: string) => void;
};

export const useResumeDialog = create<ResumeDialogState>((set, get) => ({
  resumeId: null,
  resumeTitle: null,
  setResumeId: (resumeId) => set({ resumeId }),
  setResumeTitle: (resumeTitle) => set({ resumeTitle }),
}));

type ButtonClickHandler = (
  mode: ModeType,
  id: number,
  title?: string
) => (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;

export const useCreateHandleMenuButtonClick = () => {
  const resumeDialog = useResumeDialog();
  const dialogState = useDialogState();

  const handleMenuButtonClick: ButtonClickHandler =
    (mode, id, title) => (e) => {
      e.stopPropagation();
      dialogState.setIsOpen(true);
      dialogState.setMode(mode);
      resumeDialog.setResumeId(id);

      if (mode === 'Delete') {
        resumeDialog.setResumeTitle(title!);
      }
    };

  return { handleMenuButtonClick };
};
