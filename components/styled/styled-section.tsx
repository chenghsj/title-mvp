import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function SectionExcludingNav({ children, className, ...props }: Props) {
  return (
    <section
      className={cn(
        'relative h-[calc(100vh-var(--nav-h))] w-full font-roboto',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
