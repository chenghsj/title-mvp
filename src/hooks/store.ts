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

// export const useDialogState = () => {
//   const dialogState = _useDialogState();

//   const pathname = usePathname();

//   useEffect(() => {
//     dialogState.setIsOpen(false);
//     dialogState.setMode(null);
//   }, [pathname]);

//   return _useDialogState();
// };
