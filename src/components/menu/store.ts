import { create } from 'zustand';

type NavMenuState = {
  isOpen: boolean;
  setIsOpen: () => void;
};
export const useNavMenu = create<NavMenuState>((set, get) => ({
  isOpen: false,
  setIsOpen: () => set(() => ({ isOpen: !get().isOpen })),
}));

type DashboardMenuState = {
  isOpen: boolean;
  setIsOpen: () => void;
};
export const useDashboardMenu = create<DashboardMenuState>((set, get) => ({
  isOpen: true,
  setIsOpen: () => set(() => ({ isOpen: !get().isOpen })),
}));
