import { Link } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

type PostCategoryProps = ComponentPropsWithoutRef<typeof Button>;

export const PostCategory = ({ className, ...props }: PostCategoryProps) => (
  <Button
    variant="outline"
    className={cn(
      'category h-auto rounded-md border-[#006181]/25 px-3 py-1 text-xs font-medium tracking-wide text-[#006181] uppercase hover:bg-[#006181]/8 hover:text-[#006181] dark:border-[#006181]/40 dark:text-[#4da3c0] dark:hover:bg-[#006181]/15',
      className
    )}
    {...props}
  />
);

type PostCategoriesProps = {
  category: Category;
  className?: string;
};

export const PostCategories = ({
  category,
  className = '',
  ...props
}: PostCategoriesProps) => {
  return (
    <div
      className={cn(
        'post-categories mb-3 flex flex-wrap justify-center gap-2',
        className
      )}
      {...props}
    >
      <Link href={`/category/${category.slug}`}>
        <PostCategory>{category.name}</PostCategory>
      </Link>
    </div>
  );
};

export default PostCategories;
