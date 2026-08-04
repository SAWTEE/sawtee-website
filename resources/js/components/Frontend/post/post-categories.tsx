import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import { Link } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';

type PostCategoryProps = ComponentPropsWithoutRef<typeof Button>;

export const PostCategory = ({ className, ...props }: PostCategoryProps) => (
  <Button
    className={cn(
      'category rounded-md px-3 py-1 text-sm font-semibold',
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
        'post-categories flex flex-wrap justify-center gap-4',
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
