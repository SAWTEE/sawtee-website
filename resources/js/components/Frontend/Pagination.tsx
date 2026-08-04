import { cn } from '@/lib/utils';
import type { PaginationLink } from '@/types';
import { Link } from '@inertiajs/react';
import { MoveLeft, MoveRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';

type PaginationButtonProps = {
  link?: string | null;
  isDisabled?: boolean;
  label?: string;
  slot?: 'before' | 'after';
  children?: ReactNode;
  className?: string;
};

const PaginationButton = ({
  link,
  isDisabled,
  label = '',
  slot,
  children,
  ...rest
}: PaginationButtonProps) => {
  return isDisabled ? (
    <div
      className="group w-full cursor-not-allowed"
      aria-disabled={isDisabled}
      {...rest}
    >
      <Button
        aria-label={label}
        disabled={isDisabled}
        variant="outline"
        size="lg"
        className="w-full dark:border-borderColor dark:bg-bgDarker dark:text-white"
      >
        {slot === 'before' && children}
        <span>{label}</span>
        {slot === 'after' && children}
      </Button>
    </div>
  ) : (
    <Link
      className="group w-full"
      href={link ?? '#'}
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

type PaginationProps = {
  prevPage?: string | null;
  nextPage?: string | null;
  currentPage?: number;
  totalPages?: number;
  className?: string;
  nextButtonLabel?: string;
  prevButtonLabel?: string;
  links?: PaginationLink[];
};

const Pagination = ({
  prevPage,
  nextPage,
  currentPage,
  totalPages,
  className = '',
  nextButtonLabel = 'Older Posts',
  prevButtonLabel = 'Newer Posts',
}: PaginationProps) => {
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
