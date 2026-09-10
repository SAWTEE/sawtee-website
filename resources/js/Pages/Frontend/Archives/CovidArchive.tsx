import { useMemo } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DateFormat } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

type CovidArchiveProps = {
  posts?: Post[];
};

function parseAuthors(author: string | null | undefined): string[] {
  if (!author) {
    return [];
  }

  return author
    .replace(/\band\b/gi, ',')
    .split(',')
    .map(name => name.trim())
    .filter(Boolean);
}

function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0] ?? '')
    .join('')
    .slice(0, 3);
}

const AUTHOR_TOOLTIP_CLASSNAME =
  'border border-[#006181]/20 bg-white text-[#0b3a48] shadow-md dark:border-[#4da3c0]/35 dark:bg-[#0b3a48] dark:text-[#e8f6fb]';

const CovidArchive = ({ posts = [] }: CovidArchiveProps) => {
  if (!posts.length) {
    return (
      <p className="text-muted-foreground font-serif text-lg tracking-tight">
        No resources found
      </p>
    );
  }

  return (
    <section
      className="mx-auto w-full max-w-3xl space-y-5 px-1 md:space-y-6 md:px-2"
      aria-label="COVID-19 resources"
    >
      {posts.map(post => (
        <CovidResourceCard key={post.id} post={post} />
      ))}
    </section>
  );
};

function CovidResourceCard({ post }: { post: Post }) {
  const authors = useMemo(() => parseAuthors(post.author), [post.author]);
  const hasAvatarStack = authors.length > 1;

  return (
    <article className="border-borderColor/70 bg-bgDarker/80 rounded-lg border border-l-[3px] border-l-[#006181] p-5 shadow-sm md:p-6 dark:border-white/10 dark:border-l-[#006181]/80 dark:bg-black/40">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {post.genre ? (
          <span className="inline-flex items-center border border-[#006181]/25 bg-[#006181]/8 px-2.5 py-1 text-xs font-medium tracking-wide text-[#006181] uppercase dark:border-[#006181]/40 dark:bg-[#006181]/15 dark:text-[#4da3c0]">
            {post.genre}
          </span>
        ) : (
          <span />
        )}

        <time className="text-muted-foreground text-sm font-medium">
          {DateFormat(post.published_at)}
        </time>
      </div>

      <a
        href={post.link ?? undefined}
        className="group block focus-visible:outline-none"
      >
        <h3 className="text-primary font-serif text-base leading-snug font-semibold tracking-tight underline-offset-4 transition-colors group-hover:text-[#006181] group-hover:underline group-focus-visible:text-[#006181] group-focus-visible:underline md:text-lg dark:text-zinc-100 dark:group-hover:text-[#4da3c0] dark:group-focus-visible:text-[#4da3c0]">
          {post.title}
        </h3>
      </a>

      {authors.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-2">
          <div
            className={cn(
              'group/authors flex items-center',
              hasAvatarStack && 'pr-1'
            )}
            data-avatar-stack={hasAvatarStack ? 'true' : 'false'}
          >
            <TooltipProvider delayDuration={120}>
              {authors.map((author, index) => (
                <Tooltip key={`${post.id}-${author}`}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'relative inline-flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#006181]/20 bg-[#006181]/8 shadow-sm outline-none transition-[margin,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#006181]/45 dark:border-[#006181]/35 dark:bg-[#006181]/15 dark:focus-visible:ring-[#4da3c0]/50',
                        'motion-reduce:transition-none',
                        hasAvatarStack &&
                          index > 0 &&
                          '-ml-3 group-hover/authors:ml-1.5 group-focus-within/authors:ml-1.5'
                      )}
                      style={{ zIndex: authors.length - index }}
                      aria-label={author}
                    >
                      <span className="text-xs font-medium text-[#006181] dark:text-[#4da3c0]">
                        {authorInitials(author)}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    data-covid-author-tooltip
                    className={AUTHOR_TOOLTIP_CLASSNAME}
                  >
                    <p>{author}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default CovidArchive;
export { AUTHOR_TOOLTIP_CLASSNAME, authorInitials, parseAuthors };
