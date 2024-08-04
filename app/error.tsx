'use client';

import React from 'react';
import { SectionExcludeNav } from '@/components/section-exclude-nav';

type Props = { error: Error & { digest?: string } };

function ErrorPage({ error }: Props) {
  return <SectionExcludeNav>{error.message}</SectionExcludeNav>;
}

export default ErrorPage;
