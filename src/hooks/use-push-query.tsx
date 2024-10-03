'use client';

import { useCallback, useEffect } from 'react';
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
        if (value) {
          _params.set(name, value);
        } else {
          _params.delete(name);
        }
      });
      router.replace(`${pathname}?${_params.toString()}`);
    },
    [pathname, searchParams, router]
  );

  useEffect(() => {
    if (params.length > 0) {
      pushQueryString(params);
    }
  }, [params, pushQueryString]);
}
