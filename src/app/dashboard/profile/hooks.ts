import { create } from 'zustand';

export const ModeType = {
  Edit: 'Edit',
  Add: 'Add',
} as const;

export type TMode = keyof typeof ModeType;

type ModeState = {
  mode: TMode | null;
  setMode: (mode: TMode) => void;
};

export const DialogType = {
  Education: 'Education',
  Job: 'Job',
  Cover: 'Cover',
} as const;

export type TDialog = keyof typeof DialogType;

type DialogState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  type: TDialog | null;
  setType: (type: TDialog) => void;
};

/**
 * Hooks
 */
export const useMode = create<ModeState>((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),
}));

export const useDialog = create<DialogState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  type: null,
  setType: (type) => set({ type }),
}));
