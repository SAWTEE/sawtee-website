import type { ReactNode } from 'react';

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

const MetaSep = () => (
  <span className="text-[#006181]/35 dark:text-[#006181]/50" aria-hidden>
    ·
  </span>
);

const PostMeta = ({
  author,
  date,
  readingTime,
  tags,
  className,
  ...rest
}: PostMetaProps) => {
  const items: Array<{ key: string; node: ReactNode }> = [];

  if (readingTime) {
    items.push({ key: 'reading', node: <span>{readingTime}</span> });
  }
  if (author) {
    items.push({ key: 'author', node: <span>{author}</span> });
  }
  if (date) {
    items.push({
      key: 'date',
      node: <time dateTime={date}>{formatDate(date)}</time>,
    });
  }

  return (
    <div className={cn('post-meta', className)} {...rest}>
      <div className="text-muted-foreground flex w-full flex-wrap items-center gap-x-2.5 gap-y-2 text-sm tracking-wide">
        {items.map((item, i) => (
          <span key={item.key} className="inline-flex items-center gap-2.5">
            {i > 0 && <MetaSep />}
            {item.node}
          </span>
        ))}
        {tags && tags.length > 0 && (
          <span className="inline-flex items-center gap-2.5">
            {items.length > 0 && <MetaSep />}
            <PostTags tags={tags} />
          </span>
        )}
      </div>
    </div>
  );
};

export default PostMeta;
