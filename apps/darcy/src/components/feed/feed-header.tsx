'use client';

import useHideOnScroll from '@/hooks/useHideOnScroll';
import { cn } from '@/lib/utils';
import { ComponentProps, useRef } from 'react';

export default function FeedHeader({ children, ...props }: ComponentProps<'div'>) {
  const header = useRef<HTMLDivElement>(null);
  useHideOnScroll(header, 'down');

  return (
    <div
      className={cn(
        'sticky top-0 w-full border-b border-b-border bg-white/60 dark:bg-black/60 backdrop-blur-md z-10 transition-all duration-300',
        props.className
      )}
      ref={header}
    >
      {children}
    </div>
  );
}
