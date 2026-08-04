import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

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
      type="button"
      role="button"
      href={target}
      className={cn(
        'flex max-w-max items-center gap-1 rounded-md py-2 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80 hover:underline-offset-4',
        className
      )}
      onMouseEnter={() => setHovered(!hovered)}
      onMouseLeave={() => setHovered(!hovered)}
      {...rest}
    >
      {text}
      {hovered ? (
        <ArrowRightIcon className="h-4 w-4" />
      ) : (
        <ChevronRightIcon className="h-4 w-4" />
      )}
    </Link>
  );
};

export default ExploreButton;
