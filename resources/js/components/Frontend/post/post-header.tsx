import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import type { ReactNode } from 'react';
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
          'captialize my-3 text-2xl font-bold text-slate-800 dark:text-slate-300 md:text-3xl lg:my-5 xl:text-5xl',
          textStyle
        )}
      >
        {heading}
      </h1>
    )}

    {description && <p>{description}</p>}
    {children}
  </div>
);

export default PostHeader;
