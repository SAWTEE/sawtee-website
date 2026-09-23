import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type GlassboxProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};

const Glassbox = ({ children, className = '', ...rest }: GlassboxProps) => {
  return (
    <div
      className={cn(
        'text-secondary-foreground bg-background/90 dark:bg-card/90 border-theme-600/12 dark:border-theme-600/25 dark:text-foreground w-full rounded-lg border py-4 shadow-sm',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Glassbox;
