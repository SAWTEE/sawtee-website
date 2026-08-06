import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { Category } from '@/types';

import PostCategories from './post-categories';

type PostHeaderProps = {
  heading?: string | null;
  categories?: Category | null;
  description?: string | null;
  color?: string;
  className?: string;
  textStyle?: string;
  children?: ReactNode;
};

const PostHeader = ({
  heading,
  categories = null,
  description,
  className = '',
  textStyle,
  children,
  ...rest
}: PostHeaderProps) => (
  <div
    className={cn('post-header text-left md:text-center', className)}
    {...rest}
  >
    {categories && <PostCategories category={categories} />}
    {heading && (
      <h1
        className={cn(
          'text-primary my-3 font-serif text-2xl font-semibold tracking-tight capitalize md:text-3xl lg:my-4 xl:text-4xl dark:text-zinc-100',
          textStyle
        )}
      >
        {heading}
      </h1>
    )}

    {description && (
      <p className="text-muted-foreground mt-2 max-w-prose text-base leading-relaxed md:text-lg">
        {description}
      </p>
    )}
    {children}
  </div>
);

export default PostHeader;
