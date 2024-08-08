import { Link } from '@inertiajs/react';
import { Badge } from '../ui/badge';
import Glassbox from './Glassbox';
import SimpleList from './SimpleList';

export const FeaturedPublications = ({ publications }) => {
  return (
    <Glassbox className="bg-white dark:bg-bgDarker">
      <SimpleList
        className="mx-auto max-w-lg rounded-xl border-none"
        heading={'featured publications'}
      >
        {publications.map((publication, idx) => {
          const media = publication.media.length
            ? publication.media.filter(
                media => media.collection_name === 'publication_featured_image'
              )[0].original_url
            : '/assets/SM-placeholder-150x150.png';
          return (
            <li
              className={
                'group mb-4 flex w-full items-center justify-between gap-6 last:mb-0'
              }
              key={publication.id}
            >
              <div className="max-w-2/3 grow">
                <Link
                  className=""
                  href={`category/publications/${publication.category?.slug}`}
                >
                  <Badge
                    variant="outline"
                    className="mb-2 px-2 font-sans"
                    size={'sm'}
                  >
                    {publication.category?.name}
                  </Badge>
                </Link>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group-hover:opacity-80"
                  href={`/publications/${publication.file?.name}`}
                >
                  <p className="md:text-md font-sans text-sm leading-4 text-secondary-foreground group-hover:underline">
                    {publication.title}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {publication.subtitle}
                  </p>
                </a>
              </div>

              {media && (
                <div className="mx-auto w-1/3 max-w-20 overflow-hidden rounded-md">
                  <img
                    className="aspect-[3/4] w-full border object-cover"
                    src={media || '/assets/SM-placeholder-150x150.png'}
                    alt="Publication Cover"
                    loading="lazy"
                  />
                </div>
              )}
            </li>
          );
        })}
      </SimpleList>
    </Glassbox>
  );
};
