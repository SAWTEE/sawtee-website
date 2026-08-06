import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

type GlassboxProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};

const Glassbox = ({ children, className = '', ...rest }: GlassboxProps) => {
  return (
    <div
      className={cn(
        'text-secondary-foreground w-full rounded-lg border border-white/40 bg-white/70 py-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/55 dark:text-zinc-200',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Glassbox;
