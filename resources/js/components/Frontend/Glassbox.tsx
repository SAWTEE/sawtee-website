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
        'border-1 w-full rounded-md border-borderColor bg-bgDarker py-4 shadow-md dark:text-muted-foreground',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Glassbox;
