import { cn } from '@/lib/utils';

const Glassbox = ({ children, className, ...rest }) => {
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
