import { FileText } from 'lucide-react';

import { formatShortMonthDay } from '@/lib/helpers';
import { cn, htmlToText } from '@/lib/utils';
import type { Post } from '@/types';

type VerticalTimelineProps = {
  items?: Post[] | null;
  className?: string;
  emptyMessage?: string;
};

export default function VerticalTimeline({
  items = null,
  className = '',
  emptyMessage = 'No items found.',
}: VerticalTimelineProps) {
  if (!items?.length) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className={cn('relative -my-2', className)}>
      {items.map((item, index) => {
        const file = (item.media ?? []).find(
          m => m.collection_name === 'post-files'
        );
        const href = file?.original_url || null;
        const excerpt =
          htmlToText(item.excerpt)?.replace(/\s+/g, ' ').trim() ?? '';
        const showExcerpt = excerpt.length > 0 && !/^[.\u2026]+$/.test(excerpt);
        const isLast = index === items.length - 1;

        return (
          <li key={item.id} className="group relative py-6 pl-8 sm:pl-32">
            {!isLast ? (
              <span
                aria-hidden
                className="bg-theme-200 dark:bg-theme-700 absolute top-10 left-[0.45rem] h-[calc(100%-0.5rem)] w-px sm:left-[6.85rem]"
              />
            ) : null}

            <span
              aria-hidden
              className="border-theme-50 bg-theme-600 dark:border-theme-900 dark:bg-theme-400 absolute top-8 left-0 box-content h-3 w-3 -translate-x-1/2 rounded-full border-4 sm:left-[6.5rem] sm:ml-0"
            />

            <time className="bg-theme-100 text-theme-700 dark:bg-theme-800 dark:text-theme-200 left-0 mb-3 inline-flex h-6 min-w-20 translate-y-0.5 items-center justify-center rounded-full px-2.5 text-[0.7rem] font-semibold tracking-wide uppercase sm:absolute sm:mb-0">
              {formatShortMonthDay(
                item.published_at ? new Date(item.published_at) : new Date()
              )}
            </time>

            <div className="bg-bgDarker/80 dark:bg-card/40 rounded-xl border border-[#006181]/10 p-4 shadow-sm transition duration-200 group-hover:border-[#006181]/25 group-hover:shadow-md dark:border-[#006181]/20">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-secondary-foreground group-hover:text-primary font-serif text-sm leading-snug font-semibold tracking-tight underline-offset-4 transition group-hover:underline md:text-base lg:text-lg">
                    {item.title}
                  </h3>
                </a>
              ) : (
                <h3 className="text-secondary-foreground font-serif text-sm leading-snug font-semibold tracking-tight md:text-base lg:text-lg">
                  {item.title}
                </h3>
              )}

              {showExcerpt ? (
                <p className="text-secondary-foreground/70 mt-2 line-clamp-3 text-sm leading-relaxed">
                  {excerpt}
                </p>
              ) : null}

              {href ? (
                <p className="text-primary mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
                  <FileText className="h-3.5 w-3.5" aria-hidden />
                  Open PDF
                  <span className="sr-only"> (opens in a new tab)</span>
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
