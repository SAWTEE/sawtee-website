import { cn, htmlToText } from '@/lib/utils';
import type { Research, ResearchByYear } from '@/types';
import { Download, ExternalLink } from 'lucide-react';

type ResearchArchiveProps = {
  posts?: ResearchByYear | Research[] | null;
};

function toByYear(posts: ResearchByYear | Research[]): ResearchByYear {
  if (!Array.isArray(posts)) {
    return posts;
  }

  return posts.reduce<ResearchByYear>((acc, item) => {
    const key = String(item.year);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}

function researchHref(item: Research): string | undefined {
  if (item.file?.name) {
    return `/Research_Reports/${item.file.name}`;
  }

  return item.link ?? undefined;
}

function featuredImage(item: Research): string | undefined {
  return (item.media ?? []).find(
    m => m.collection_name === 'research_featured_image'
  )?.original_url;
}

const ResearchArchive = ({ posts = null }: ResearchArchiveProps) => {
  if (!posts) {
    return (
      <p className="text-muted-foreground font-serif text-lg tracking-tight">
        No research found
      </p>
    );
  }

  const byYear = toByYear(posts);
  const sortedYears = Object.entries(byYear).sort(
    ([a], [b]) => Number(b) - Number(a)
  );

  if (sortedYears.length <= 0) {
    return (
      <p className="text-muted-foreground font-serif text-lg tracking-tight">
        No research found
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-1 md:px-2" aria-label="Research by year">
      <ol className="relative m-0 list-none space-y-12 p-0 md:space-y-16">
        {sortedYears.map(([year, items]) => (
          <li key={year} className="relative">
            <div className="mb-6 flex items-center gap-4 md:mb-8">
              <time
                dateTime={year}
                className="text-primary inline-flex min-w-18 items-center justify-center border border-[#006181]/25 bg-[#006181]/8 px-3 py-1.5 font-serif text-lg font-semibold tracking-tight text-[#006181] md:min-w-22 md:text-xl dark:border-[#006181]/40 dark:bg-[#006181]/15 dark:text-[#4da3c0]"
              >
                {year}
              </time>
              <div
                className="h-px flex-1 bg-[#006181]/15 dark:bg-[#006181]/25"
                aria-hidden
              />
            </div>

            <ol className="relative m-0 list-none border-l border-[#006181]/20 pl-6 md:pl-8 dark:border-[#006181]/30">
              {items.map(item => {
                const href = researchHref(item);
                const image = featuredImage(item);
                const description = item.description
                  ? htmlToText(item.description)
                  : null;
                const isExternal = Boolean(item.link && !item.file);

                return (
                  <li key={item.id} className="relative pb-8 last:pb-0 md:pb-10">
                    <span
                      className="absolute top-1.5 left-0 h-2.5 w-2.5 -translate-x-[calc(1.5rem+1px+50%)] rounded-full border-2 border-[#006181] bg-white md:-translate-x-[calc(2rem+1px+50%)] dark:border-[#4da3c0] dark:bg-zinc-950"
                      aria-hidden
                    />

                    <article className="group flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                      {image ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'block w-full shrink-0 overflow-hidden rounded-md border border-[#006181]/10 sm:w-24 dark:border-white/10',
                            !href && 'pointer-events-none'
                          )}
                        >
                          <img
                            src={image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="aspect-3/4 w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                          />
                        </a>
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-primary font-serif text-base leading-snug font-semibold tracking-tight md:text-lg dark:text-zinc-100">
                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-4 transition-colors hover:text-[#006181] hover:underline focus-visible:text-[#006181] focus-visible:underline focus-visible:outline-none dark:hover:text-[#4da3c0] dark:focus-visible:text-[#4da3c0]"
                            >
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </h3>

                        {item.subtitle ? (
                          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed md:text-[0.95rem]">
                            {item.subtitle}
                          </p>
                        ) : null}

                        {description ? (
                          <p className="text-muted-foreground/90 mt-2 line-clamp-3 text-sm leading-relaxed">
                            {description}
                          </p>
                        ) : null}

                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-[#006181] uppercase transition-opacity hover:opacity-80 dark:text-[#4da3c0]"
                          >
                            {isExternal ? (
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <Download className="h-3.5 w-3.5" aria-hidden />
                            )}
                            {isExternal ? 'View' : 'Download'}
                          </a>
                        ) : null}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ResearchArchive;
