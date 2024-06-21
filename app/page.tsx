'use client';

import { ConditionalRender } from '@/components/conditional-render';
import { SectionExcludingNav } from '@/components/styled/styled-section';
import { loginPath } from '@/config/site';

export default function Home() {
  const defaultRender = <SectionExcludingNav>Home</SectionExcludingNav>;

  return (
    <ConditionalRender
      pathToMatch={loginPath}
      defaultRender={defaultRender}
      matchedPathRender={null}
    />
  );
}
