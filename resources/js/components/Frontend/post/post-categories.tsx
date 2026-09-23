import type { ComponentPropsWithoutRef } from 'react';

import InertiaLink from '@/components/shared/InertiaLink';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

type PostCategoryProps = ComponentPropsWithoutRef<typeof Button>;

const PostCategory = ({ className, ...props }: PostCategoryProps) => (
  <Button variant="chip" className={className} {...props} />
);

type PostCategoriesProps = {
  category: Category;
  className?: string;
};

const PostCategories = ({
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
      <InertiaLink href={`/category/${category.slug}`}>
        <PostCategory>{category.name}</PostCategory>
      </InertiaLink>
    </div>
  );
};

export default PostCategories;
