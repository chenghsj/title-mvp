import { useSearchParams } from 'next/navigation';
import { create } from 'zustand';
import { Role } from '../types';

type EmailOTPDialogState = {
  email: string;
  setEmail: (email: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useEmailOTPDialog = create<EmailOTPDialogState>((set, get) => ({
  email: '',
  isOpen: false,
  setEmail: (email) => set({ email }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export const useGetRole = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as Role;

  return { role };
};
