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
        'text-secondary-foreground bg-background/90 dark:bg-card/90 w-full rounded-lg border border-[#006181]/12 py-4 shadow-sm dark:border-[#006181]/25 dark:text-zinc-200',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Glassbox;
