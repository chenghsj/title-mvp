'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/app/_root/_nav/actions';

export function useLogout() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction();
      router.refresh();
    });
  };
  return {
    isPending,
    handleLogout,
  };
}
