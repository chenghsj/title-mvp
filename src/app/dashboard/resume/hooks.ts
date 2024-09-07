import { create } from 'zustand';

type ResumeDialogState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

type ConfirmDialogState = {
  isOpen: boolean;
  resumeId: number | null;
  resumeTitle: string | null;
  setIsOpen: (open: boolean) => void;
  setResumeId: (resumeId: number) => void;
  setResumeTitle: (resumeTitle: string) => void;
};

/**
 * Hooks
 */
export const useResumeDialog = create<ResumeDialogState>((set, get) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export const useConfirmDialog = create<ConfirmDialogState>((set, get) => ({
  isOpen: false,
  resumeId: null,
  resumeTitle: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setResumeId: (resumeId) => set({ resumeId }),
  setResumeTitle: (resumeTitle) => set({ resumeTitle }),
}));
