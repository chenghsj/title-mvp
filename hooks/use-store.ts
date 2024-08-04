import { create } from 'zustand';

type NavMenuState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const useNavMenu = create<NavMenuState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
}));

type DashboardMenuState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const useDashboardMenu = create<DashboardMenuState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
}));
