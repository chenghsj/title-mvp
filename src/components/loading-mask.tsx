'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { SectionExcludeNav } from './section-exclude-nav';

type LoadingMaskContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingMaskContext = createContext<LoadingMaskContextType | undefined>(
  undefined
);

export const useLoadingMask = () => {
  const context = useContext(LoadingMaskContext);
  if (!context) {
    throw new Error('useLoadingMask must be used within a LoadingMaskProvider');
  }
  return context;
};

type LoadingMaskProviderProps = {
  children: ReactNode;
};

export const LoadingMaskProvider = ({ children }: LoadingMaskProviderProps) => {
  const [isLoading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <LoadingMaskContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && (
        <SectionExcludeNav className='absolute top-[var(--nav-h-sm)] z-40 bg-white opacity-70 dark:bg-black md:top-[var(--nav-h-md)]'>
          <LoadingPage />
        </SectionExcludeNav>
      )}
      {children}
    </LoadingMaskContext.Provider>
  );
};
