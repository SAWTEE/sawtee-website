import { TagsIcon } from 'lucide-react';

import type { Tag } from '@/types';

type PostTagsProps = {
  tags: Tag[];
};

export default function PostTags({ tags }: PostTagsProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      <TagsIcon
        className="text-muted-foreground h-3.5 w-3.5 shrink-0"
        aria-hidden
      />
      {tags.map(({ id, name }) => (
        <span
          key={id}
          className="text-muted-foreground bg-theme-600/6 dark:bg-theme-600/15 rounded px-1.5 py-0.5 text-xs font-medium tracking-wide"
        >
          {name}
        </span>
      ))}
    </div>
  );
}
