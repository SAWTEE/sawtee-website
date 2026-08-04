import ExploreButton from '@/components/Frontend/ExploreButton';
import Glassbox from '@/components/Frontend/Glassbox';
import { formatDate } from '@/lib/helpers';
import { Link } from '@inertiajs/react';

const EventsArchive = ({ posts, ...rest }) => {
  if (!posts || posts.length <= 0) return 'No posts found';

  return (
    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-20 p-8">
      {posts.map(
        ({ id, title, slug, media, category, excerpt, published_at }) => {
          const featured_image = media.filter(
            media => media.collection_name === 'post-featured-image'
          )[0];

          return (
            <Glassbox
              key={id}
              className={
                'relative flex w-full flex-col items-start overflow-hidden py-0 shadow xl:flex-row xl:bg-transparent xl:py-4 xl:shadow-none'
              }
              {...rest}
            >
              <div className="order-1 flex flex-col justify-between gap-2 px-4 xl:ml-6 xl:min-h-[180px]">
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-300 xl:text-lg">
                  <time className="mb-1 block text-sm font-normal text-slate-600 dark:text-slate-300">
                    {formatDate(published_at)}
                  </time>
                  <Link
                    href={`/category/${category.slug}/${slug}`}
                    className="block leading-5 hover:underline hover:underline-offset-2"
                  >
                    {title}
                  </Link>
                </h3>

                <div className="prose prose-sm prose-slate text-slate-600 dark:text-slate-300">
                  <p className="line-clamp-3">{excerpt}</p>
                </div>
                <ExploreButton
                  className="px-0"
                  link={`/category/${category.slug}/${slug}`}
                  text="Read more"
                />
              </div>
              <img
                src={featured_image?.original_url}
                alt={title}
                className="mb-4 aspect-video h-full w-full rounded-b-none bg-bgDarker object-cover xl:mb-0 xl:w-80 xl:shrink-0 xl:rounded-lg xl:shadow-md"
                width="1216"
                height="640"
              />
            </Glassbox>
          );
        }
      )}
    </div>
  );
};

export default EventsArchive;
