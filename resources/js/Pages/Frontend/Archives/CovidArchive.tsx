import { type CSSProperties, useMemo } from 'react';

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
  'border border-theme-600/20 bg-white text-theme-ink shadow-md dark:border-theme-450/35 dark:bg-theme-ink dark:text-theme-mist';

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
    <article className="border-borderColor/70 bg-bgDarker/80 border-l-theme-600 dark:border-l-theme-600/80 rounded-lg border border-l-3 p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-black/40">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {post.genre ? (
          <span className="border-theme-600/25 bg-theme-600/8 text-theme-600 dark:border-theme-600/40 dark:bg-theme-600/15 dark:text-theme-450 inline-flex items-center border px-2.5 py-1 text-xs font-medium tracking-wide uppercase">
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
        <h3 className="text-primary group-hover:text-theme-600 group-focus-visible:text-theme-600 dark:text-foreground dark:group-hover:text-theme-450 dark:group-focus-visible:text-theme-450 font-serif text-base leading-snug font-semibold tracking-tight underline-offset-4 transition-colors group-hover:underline group-focus-visible:underline md:text-lg">
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
                        'border-theme-600/20 bg-theme-600/8 focus-visible:ring-theme-600/45 dark:border-theme-600/35 dark:bg-theme-600/15 dark:focus-visible:ring-theme-450/50 relative inline-flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border shadow-sm transition-all duration-500 ease-out outline-none focus-visible:ring-2',
                        'stack-index motion-reduce:transition-none',
                        hasAvatarStack &&
                          index > 0 &&
                          '-ml-3 group-focus-within/authors:ml-1.5 group-hover/authors:ml-1.5'
                      )}
                      style={
                        {
                          '--stack': authors.length - index,
                        } as CSSProperties
                      }
                      aria-label={author}
                    >
                      <span className="text-theme-600 dark:text-theme-450 text-xs font-medium">
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
