'use client';

import { createContext, useContext } from 'react';
import { validateRequest } from '@/lib/auth';

type ContextType = Awaited<ReturnType<typeof validateRequest>>;

const SessionContext = createContext<ContextType>({
  session: null,
  user: null,
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({
  children,
  session,
}: React.PropsWithChildren<{ session: ContextType }>) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
