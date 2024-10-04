'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/app/_root/_nav/actions';
import { useLoadingMask } from '@/components/loading-mask';

export function useLogout() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setLoading } = useLoadingMask();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction();
      router.refresh();
    });
  };

  useEffect(() => {
    if (isPending) {
      setLoading(true);
    }
  }, [isPending]);

  return {
    isPending,
    handleLogout,
  };
}
