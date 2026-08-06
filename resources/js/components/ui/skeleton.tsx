import { cn } from '@/lib/utils';

function Skeleton({ className = '', ...props }: any) {
  return (
    <div
      className={cn('bg-primary/10 animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
