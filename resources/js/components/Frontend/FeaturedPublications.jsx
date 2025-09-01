import Glassbox from './Glassbox';
import SimpleList from './SimpleList';
import { Link } from '@inertiajs/react';

export const FeaturedPublications = ({ publications, blogPosts }) => {
  return (
    <Glassbox className="bg-white dark:bg-bgDarker">
      <SimpleList
        className="mx-auto max-w-lg rounded-xl border-none"
        heading={'Featured publications'}
      >
        {publications
          .sort((a, b) => a.created_at - b.created_at)
          .map((publication, idx) => {
            const media = publication.media.length
              ? publication.media.filter(
                  media =>
                    media.collection_name === 'publication_featured_image'
                )[0].original_url
              : `https://placehold.co/120x150/eee/000/webp?text=No+image`;
            return (
              <li
                className={
                  'group mb-4 flex w-full cursor-pointer items-center justify-between gap-6 last:mb-0'
                }
                key={publication.id}
              >
                <div className="w-2/3 max-w-full grow">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group-hover:opacity-80"
                    href={`/publications/${publication.file?.name}`}
                  >
                    <p className="md:text-md font-sans text-sm font-semibold leading-4 text-secondary-foreground group-hover:underline">
                      {publication.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {publication.subtitle}
                    </p>
                  </a>
                </div>

                {media && (
                  <div
                    title={publication.title}
                    aria-label={publication.title}
                    className="mx-auto h-[90px] w-1/3 max-w-16 overflow-hidden rounded-md"
                  >
                    <img
                      className="h-full w-full border object-cover"
                      src={media}
                      alt={publication.title}
                      loading="lazy"
                    />
                  </div>
                )}
              </li>
            );
          })}
      </SimpleList>
      <hr className="my-6" />
      {blogPosts && blogPosts.length > 0 && (
        <SimpleList
          className="mx-auto max-w-lg rounded-xl border-none"
          heading={'Blogs and Articles'}
        >
          {blogPosts
            .sort((a, b) => a.created_at - b.created_at)
            .map((post, idx) => {
              const media = post.media.length
                ? post.media.filter(
                    media => media.collection_name === 'post-featured-image'
                  )[0].original_url
                : `https://placehold.co/120x150/eee/000/webp?text=No+image`;
              return (
                <li
                  className={
                    'group mb-4 flex w-full cursor-pointer items-center justify-between gap-6 last:mb-0'
                  }
                  key={post.id}
                >
                  <div className="w-2/3 max-w-full grow">
                    <Link
                      className="group-hover:opacity-80"
                      href={`/category/${post.category.slug}/${post.slug}`}
                    >
                      <p className="md:text-md font-sans text-sm font-semibold leading-4 text-secondary-foreground group-hover:underline">
                        {post.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.subtitle}
                      </p>
                    </Link>
                  </div>

                  {media && (
                    <div
                      title={post.title}
                      aria-label={post.title}
                      className="mx-auto h-[90px] w-1/3 max-w-16 overflow-hidden rounded-md"
                    >
                      <img
                        className="h-full w-full border object-cover"
                        src={media}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                  )}
                </li>
              );
            })}
        </SimpleList>
      )}
    </Glassbox>
  );
};
