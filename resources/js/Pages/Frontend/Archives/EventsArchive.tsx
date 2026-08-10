import { Link } from '@inertiajs/react';
import type { HTMLAttributes } from 'react';

import ExploreButton from '@/components/Frontend/ExploreButton';
import Glassbox from '@/components/Frontend/Glassbox';
import { formatDate } from '@/lib/helpers';
import type { Post } from '@/types';

type EventsArchiveProps = HTMLAttributes<HTMLDivElement> & {
  posts?: Post[] | null;
};

const EventsArchive = ({ posts = null, ...rest }: EventsArchiveProps) => {
  if (!posts || posts.length <= 0) return 'No posts found';

  return (
    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-12 p-8 xl:gap-y-16">
      {posts.map(
        ({ id, title, slug, media, category, excerpt, published_at }) => {
          const featured_image = (media ?? []).filter(
            item => item.collection_name === 'post-featured-image'
          )[0];

          return (
            <Glassbox
              key={id}
              className="relative flex w-full flex-col overflow-hidden p-0 shadow-sm xl:flex-row xl:items-stretch xl:gap-6 xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none"
              {...rest}
            >
              <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-zinc-100 xl:aspect-auto xl:min-h-55 xl:w-[min(42%,28rem)] xl:self-stretch xl:rounded-lg dark:bg-zinc-800/60">
                {featured_image?.original_url ? (
                  <img
                    src={featured_image.original_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    width="1216"
                    height="640"
                    loading="lazy"
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 px-5 py-5 xl:px-0 xl:py-1">
                <div className="space-y-2">
                  <time className="block text-sm font-normal text-slate-600 dark:text-slate-300">
                    {formatDate(published_at)}
                  </time>
                  <h3 className="text-md font-semibold text-slate-800 xl:text-lg dark:text-slate-300">
                    <Link
                      href={`/category/${category?.slug}/${slug}`}
                      className="block leading-snug hover:underline hover:underline-offset-2"
                    >
                      {title}
                    </Link>
                  </h3>
                  {excerpt ? (
                    <div className="prose prose-sm prose-slate text-slate-600 dark:text-slate-300">
                      <p className="line-clamp-3">{excerpt}</p>
                    </div>
                  ) : null}
                </div>

                <ExploreButton
                  className="mt-1 w-fit max-w-full px-0"
                  link={`/category/${category?.slug}/${slug}`}
                  text="Read more"
                  aria-label={`Read more: ${title}`}
                  title={`Read more: ${title}`}
                />
              </div>
            </Glassbox>
          );
        }
      )}
    </div>
  );
};

export default EventsArchive;
