import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function SectionExcludeNav({ children, className, ...props }: Props) {
  return (
    <section
      className={cn(
        'h-[calc(100vh-var(--nav-h-sm))] md:h-[calc(100vh-var(--nav-h-md))]',
        'relative w-full font-roboto',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
