import { create } from 'zustand';

const DialogType = {
  Add: 'Add',
  Edit: 'Edit',
} as const;

type TDialog = keyof typeof DialogType;

type ResumeDialogState = {
  type: TDialog | null;
  isOpen: boolean;
  resumeId: number | null;
  setIsOpen: (open: boolean) => void;
  setType: (type: TDialog) => void;
  setResumeId: (resumeId: number) => void;
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
  type: 'Add',
  resumeId: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setType: (type) => set({ type }),
  setResumeId: (resumeId) => set({ resumeId }),
}));

export const useConfirmDialog = create<ConfirmDialogState>((set, get) => ({
  isOpen: false,
  resumeId: null,
  resumeTitle: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setResumeId: (resumeId) => set({ resumeId }),
  setResumeTitle: (resumeTitle) => set({ resumeTitle }),
}));
