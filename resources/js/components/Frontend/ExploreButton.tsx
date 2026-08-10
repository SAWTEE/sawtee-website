import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';

import InertiaLink from '@/components/shared/InertiaLink';
import { cn } from '@/lib/utils';

type ExploreButtonProps = {
  text?: string;
  link?: string | null;
  href?: string | null;
  className?: string;
  /** Native HTML title/tooltip (e.g. full label when truncated). */
  title?: string;
} & Omit<ComponentProps<typeof InertiaLink>, 'href' | 'className' | 'children'>;

const ExploreButton = ({
  text = 'Explore All',
  link,
  href,
  className = '',
  ...rest
}: ExploreButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const target = link ?? href ?? '#';

  return (
    <InertiaLink
      href={target}
      className={cn(
        'inline-flex max-w-full min-w-0 items-center gap-1 rounded-md py-2 text-sm font-medium text-[#006181] underline underline-offset-2 hover:text-[#006181]/80 hover:underline-offset-4 dark:text-[#4da3c0] dark:hover:text-[#4da3c0]/80',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      <span className="truncate">{text}</span>
      {hovered ? (
        <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <ChevronRightIcon className="h-4 w-4 shrink-0" aria-hidden />
      )}
    </InertiaLink>
  );
};

export default ExploreButton;
