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
  return (
    <>{pathToMatch.includes(pathname) ? matchedPathRender : defaultRender}</>
  );
}
