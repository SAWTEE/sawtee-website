import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SimpleListProps = HTMLAttributes<HTMLDivElement> & {
  heading?: string | null;
  children?: ReactNode;
  className?: string;
};

export default function SimpleList({
  heading,
  children,
  className = '',
  ...rest
}: SimpleListProps) {
  return (
    <div
      className={cn('border-borderColor border-l-2 px-6', className)}
      {...rest}
    >
      {heading && (
        <h3 className="text-primary dark:text-foreground mb-4 font-serif text-lg font-semibold tracking-tight md:text-xl">
          {heading}
        </h3>
      )}
      <ul className="font-sans tracking-wide">{children}</ul>
    </div>
  );
}
