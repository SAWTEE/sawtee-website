import { formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { Tag } from '@/types';
import PostTags from './post-tags';

type PostMetaProps = {
  author?: string | null;
  date?: string | null;
  readingTime?: string | null;
  tags?: Tag[];
  className?: string;
};

const PostMeta = ({
  author,
  date,
  readingTime,
  tags,
  className,
  ...rest
}: PostMetaProps) => (
  <div className={cn('post-meta', className)} {...rest}>
    <div className="flex w-full flex-wrap items-center gap-6 gap-y-2 text-sm text-muted-foreground">
      {readingTime && <p>Reading Time: {readingTime}</p>}
      {author && <p>Author: {author}</p>}
      {date && <time dateTime={date}>Published date: {formatDate(date)}</time>}
      {tags && tags.length > 0 && <PostTags tags={tags} />}
    </div>
  </div>
);

export default PostMeta;
