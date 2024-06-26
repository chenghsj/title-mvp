'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  pathToMatch: string[];
  defaultRender: React.ReactNode;
  matchedPathRender: React.ReactNode;
};

export function ConditionalRender({
  pathToMatch,
  defaultRender,
  matchedPathRender,
}: Props) {
  const pathname = usePathname();

  const isMatch = pathToMatch.some((path) =>
    new RegExp(`^${path}(/.+)?/?$`, 'i').test(pathname)
  );

  return <>{isMatch ? matchedPathRender : defaultRender}</>;
}
