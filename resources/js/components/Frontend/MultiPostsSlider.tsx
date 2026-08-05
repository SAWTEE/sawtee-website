import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '../ui/badge';

const MultiPostsCarousel = ({ data = undefined }: any) => {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {data.map((publication: any) => {
          const media = publication.media.length
            ? publication.media.filter(
                // @ts-ignore allowlist-migration
                media => media.collection_name === 'publication_featured_image'
              )[0].original_url
            : '/assets/SM-placeholder-150x150.png';
          const href = publication.file
            ? `/publications/${publication?.file?.name}`
            : null;
          const label = `Open publication: ${publication.title}`;

          return (
            <CarouselItem
              key={publication.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="group relative mx-auto flex aspect-3/4 w-45 items-end justify-start overflow-hidden rounded-md text-left">
                <img
                  src={media}
                  alt=""
                  width={180}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {href ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={href}
                    aria-label={label}
                    className="absolute inset-0 z-10 bg-linear-to-br from-transparent to-black/50"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 z-10 bg-linear-to-br from-transparent to-black/50"
                  />
                )}
                <div className="absolute left-4 top-3 z-20 flex items-center justify-between">
                  <Badge className="border-transparent bg-sky-800 px-2 font-sans text-[0.65rem] font-semibold text-white transition-all duration-200 ease-in-out group-hover:bg-sky-100 group-hover:text-sky-900">
                    {publication.category.name}
                  </Badge>
                </div>
                <div className="z-20 w-full rounded-b-md p-2 text-sm font-medium leading-4 text-white backdrop-blur-[2px] transition-all duration-200 ease-in-out group-hover:bg-black/20">
                  {href ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      title={publication.title}
                      href={href}
                      className="line-clamp-1 hover:underline group-hover:underline"
                    >
                      {publication.title}
                    </a>
                  ) : (
                    <span className="line-clamp-1">{publication.title}</span>
                  )}
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="border-borderColor dark:text-white" />
      <CarouselNext className="border-borderColor dark:text-white" />
    </Carousel>
  );
};

export default MultiPostsCarousel;
