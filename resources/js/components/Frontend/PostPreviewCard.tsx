import { Badge as BadgeRaw } from '@/components/ui/badge';
import type { ComponentType, ReactNode } from 'react';

const Badge = BadgeRaw as ComponentType<{ variant?: string; children?: ReactNode }>;
import { cn } from '@/lib/utils';
import type { Post } from '@/types';
import { Link } from '@inertiajs/react';
import {
  Card as CardRaw,
  CardContent as CardContentRaw,
  CardFooter as CardFooterRaw,
  CardHeader as CardHeaderRaw,
} from '../ui/card';

const Card = CardRaw as ComponentType<{ className?: string; children?: ReactNode }>;
const CardContent = CardContentRaw as ComponentType<{ children?: ReactNode }>;
const CardFooter = CardFooterRaw as ComponentType<{ children?: ReactNode }>;
const CardHeader = CardHeaderRaw as ComponentType<{ children?: ReactNode }>;
import ExploreButton from './ExploreButton';

type SearchLikePost = Post & {
  category?: Post['category'] | string | null;
  category_slug?: string;
};

type PostPreviewCardProps = {
  post: SearchLikePost;
  showCategoryTag?: boolean;
  className?: string;
};

const PostPreviewCard = ({
  post,
  showCategoryTag = false,
  className = '',
}: PostPreviewCardProps) => {
  const { title, slug, excerpt } = post;
  const file = post.media?.filter(
    media => media.collection_name === 'post-files'
  )[0];
  const hasContent = Boolean(post.content && post.content !== '');
  const categoryName =
    typeof post.category === 'string' ? post.category : post.category?.name;
  const categorySlug =
    typeof post.category === 'string'
      ? post.category_slug
      : (post.category?.slug ?? post.category_slug);
  const parentSlug =
    typeof post.category === 'object' && post.category
      ? post.category.parent?.slug
      : undefined;

  return (
    <Card className={cn('group rounded-md bg-bgDarker shadow-md', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          {showCategoryTag && categorySlug && (
            <Link href={`/category/${categorySlug}`}>
              <Badge variant="outline">{categoryName}</Badge>
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="mt-0 flex flex-col justify-center gap-2">
          {hasContent ? (
            <Link
              href={
                parentSlug
                  ? `/category/${parentSlug}/${categorySlug}/${slug}`
                  : `/category/${categorySlug}/${slug}`
              }
            >
              <h5 className="text-sm text-secondary-foreground lg:text-lg">
                {title}
              </h5>
            </Link>
          ) : (
            <a
              href={
                hasContent || !file
                  ? parentSlug
                    ? `/category/${parentSlug}/${categorySlug}/${slug}`
                    : `/category/${categorySlug}/${slug}`
                  : file?.original_url
              }
            >
              <h5 className="text-sm text-secondary-foreground lg:text-lg">
                {title}
              </h5>
            </a>
          )}

          <p
            className={`line-clamp-3 text-sm text-muted-foreground`}
            dangerouslySetInnerHTML={{ __html: excerpt ?? '' }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <ExploreButton
          href={`/category/${categorySlug}/${slug}`}
          className="w-full"
          text={`Read more: ${title}`}
        />
      </CardFooter>
    </Card>
  );
};

export default PostPreviewCard;
