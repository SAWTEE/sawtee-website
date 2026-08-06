import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DateFormat } from '@/lib/helpers';
import type { Post } from '@/types';

type CovidArchiveProps = {
  posts?: Post[];
};

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
      {posts.map(post => {
        const authors = (): string[] => {
          if (post.author) {
            return post.author.replace('and', ',').split(',');
          }
          return [];
        };

        return (
          <article
            key={post.id}
            className="border-borderColor/70 bg-bgDarker/80 rounded-lg border border-l-[3px] border-l-[#006181] p-5 shadow-sm md:p-6 dark:border-white/10 dark:border-l-[#006181]/80 dark:bg-black/40"
          >
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

            {post.author ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-2">
                <div className="flex -space-x-3 transition-all duration-300 ease-in hover:space-x-1 rtl:space-x-reverse">
                  <TooltipProvider>
                    {authors().map(author => (
                      <Tooltip key={author}>
                        <TooltipTrigger>
                          <div className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#006181]/20 bg-[#006181]/8 shadow-sm dark:border-[#006181]/35 dark:bg-[#006181]/15">
                            <span className="text-xs font-medium text-[#006181] dark:text-[#4da3c0]">
                              {author.split(' ').map(initial => {
                                return initial[0];
                              })}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
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
      })}
    </section>
  );
};

export default CovidArchive;
