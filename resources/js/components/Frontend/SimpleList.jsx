import { cn } from '@/lib/utils';

export default function SimpleList({ heading, children, className, ...rest }) {
  return (
    <div
      className={cn('border-l-2 border-[var(--color-border)] px-6', className)}
      {...rest}
    >
      {heading && (
        <h3 className="mb-4 text-lg font-semibold dark:text-secondary-foreground md:text-xl">
          {heading}
        </h3>
      )}
      <ul className="font-sans tracking-wide">{children}</ul>
    </div>
  );
}
