import { Card } from '@/components/ui/glass/card';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

type GlassboxProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};

const Glassbox = ({ children, className = '', ...rest }: GlassboxProps) => {
  return (
    <Card
      className={cn(
        'text-secondary-foreground w-full gap-0 rounded-lg py-4 dark:text-zinc-200',
        className
      )}
      {...rest}
    >
      {children}
    </Card>
  );
};

export default Glassbox;
