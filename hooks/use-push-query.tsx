'use client';

import { useCallback } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Query = {
  name: string;
  value: string;
}[];

export function usePushQuery(params: Query) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pushQueryString = useCallback(
    (params: Query) => {
      const _params = new URLSearchParams(searchParams.toString());
      params.forEach(({ name, value }) => {
        _params.set(name, value);
      });
      router.push(`${pathname}?${_params.toString()}`);
    },
    [searchParams]
  );

  useEffect(() => {
    pushQueryString(params);
  }, []);
}
