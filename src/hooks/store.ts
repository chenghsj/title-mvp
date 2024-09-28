import { create } from 'zustand';

const ModeType = {
  Add: 'Add',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export type ModeType = keyof typeof ModeType;

type DialogState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: ModeType | null;
  setMode: (mode: ModeType | null) => void;
};

export const useDialogState = create<DialogState>((set) => {
  return {
    isOpen: false,
    setIsOpen: (isOpen) => {
      set({ isOpen });
    },
    mode: null,
    setMode: (mode) => set({ mode }),
  };
});

type DropdownState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useDropdownState = create<DropdownState>((set) => {
  return {
    isOpen: false,
    setIsOpen: (isOpen) => {
      set({ isOpen });
    },
  };
});
