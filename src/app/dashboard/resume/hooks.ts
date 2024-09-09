import { create } from 'zustand';

type ResumeDialogState = {
  resumeId: number | null;
  resumeTitle: string | null;
  setResumeId: (resumeId: number) => void;
  setResumeTitle: (resumeTitle: string) => void;
};

/**
 * Hooks
 */
export const useResumeDialog = create<ResumeDialogState>((set, get) => ({
  resumeId: null,
  resumeTitle: null,
  setResumeId: (resumeId) => set({ resumeId }),
  setResumeTitle: (resumeTitle) => set({ resumeTitle }),
}));
