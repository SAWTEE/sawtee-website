import { Link } from '@inertiajs/react';
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type ExploreButtonProps = {
  text?: string;
  link?: string | null;
  href?: string | null;
  className?: string;
};

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
    <Link
      href={target}
      className={cn(
        'flex max-w-max items-center gap-1 rounded-md py-2 text-sm font-medium text-[#006181] underline underline-offset-2 hover:text-[#006181]/80 hover:underline-offset-4 dark:text-[#4da3c0] dark:hover:text-[#4da3c0]/80',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {text}
      {hovered ? (
        <ArrowRightIcon className="h-4 w-4" aria-hidden />
      ) : (
        <ChevronRightIcon className="h-4 w-4" aria-hidden />
      )}
    </Link>
  );
};

export default ExploreButton;
