import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { Button } from '../ui/button';

const PaginationButton = ({
  link,
  isDisabled,
  label = '',
  icon,
  slot,
  children,
  ...rest
}) => {
  return (
    <Link
      className="group w-full"
      href={link ?? undefined}
      aria-disabled={isDisabled}
      {...rest}
    >
      <Button
        aria-label={label}
        disabled={isDisabled}
        variant="outline"
        size="lg"
        className="w-full disabled:pointer-events-none disabled:cursor-not-allowed dark:border-borderColor dark:bg-bgDarker dark:text-white"
      >
        {slot === 'before' && children}
        <span>{label}</span>
        {slot === 'after' && children}
      </Button>
    </Link>
  );
};

const Pagination = ({
  links,
  prevPage,
  nextPage,
  currentPage,
  totalPages,
  className,
  nextButtonLabel = 'Older Posts',
  prevButtonLabel = 'Newer Posts',
}) => {
  return (
    <div className={cn('flex w-full gap-10', className)}>
      <PaginationButton
        link={prevPage}
        label={prevButtonLabel}
        isDisabled={currentPage === 1}
        slot="before"
      >
        <MoveLeft className="mr-3 translate-x-[100%] opacity-0 transition-all duration-100 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:mr-4" />
      </PaginationButton>
      <PaginationButton
        link={nextPage}
        label={nextButtonLabel}
        slot="after"
        isDisabled={totalPages === currentPage}
      >
        <MoveRight className="ml-3 -translate-x-[100%] opacity-0 transition-all duration-100 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:ml-4" />
      </PaginationButton>
    </div>
  );
};

export default Pagination;
