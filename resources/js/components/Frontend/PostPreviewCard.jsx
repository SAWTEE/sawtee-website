import PostCategories from '@/components/Frontend/post/post-categories';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import ExploreButton from './ExploreButton';

const PostPreviewCard = ({ post, showCategoryTag = false, className }) => {
  const { title, slug, excerpt } = post;
  const file = post.media?.filter(
    media => media.collection_name === 'post-files'
  )[0];
  const hasContent = post.content && post.content !== '';
  const category = { name: post.category, slug: post.category_slug };

  return (
    <Card className={cn('group rounded-md bg-bgDarker shadow-md', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          {showCategoryTag && (
            <Link href={`/category/${category.slug}`}>
              <Badge variant="outline">{category.name}</Badge>
            </Link>
          )}

          {/* <time className={`text-sm text-muted-foreground`}>
            {formatDate(published_at)}
          </time> */}
        </div>
      </CardHeader>

      <CardContent>
        <div className="mt-0 flex flex-col justify-center gap-2">
          {hasContent ? (
            <Link
              href={
                category.parent
                  ? `/category/${category.parent?.slug}/${category.slug}/${slug}`
                  : `/category/${category.slug}/${slug}`
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
                  ? category.parent
                    ? `/category/${category.parent?.slug}/${category.slug}/${slug}`
                    : `/category/${category.slug}/${slug}`
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
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <ExploreButton
          href={`/category/${category.slug}/${slug}`}
          className="w-full"
          text="Read more"
        />
      </CardFooter>
    </Card>
  );
};

export default PostPreviewCard;
