import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// import required modules
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Badge } from '../ui/badge';

const MultiPostsCarousel = ({ children, data, ...rest }) => {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {data.map(publication => {
          const media = publication.media.length
            ? publication.media.filter(
                media => media.collection_name === 'publication_featured_image'
              )[0].original_url
            : '/assets/SM-placeholder-150x150.png';
          return (
            <CarouselItem
              key={publication.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div
                className="group relative mx-auto flex aspect-[3/4] w-[180px] items-end justify-start overflow-hidden rounded-md bg-cover bg-center text-left"
                style={{
                  backgroundImage: `url(${media})`,
                  backgroundSize: 'cover',
                  imageBlendMode: 'grayscale',
                }}
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    publication.file
                      ? `/publications/${publication?.file?.name}`
                      : '#'
                  }
                  className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50"
                />
                <div className="absolute left-4 top-3 flex items-center justify-between">
                  <Badge className="cursor-pointer bg-sky-600 px-2 font-sans text-[0.65rem] text-white transition-all duration-200 ease-in-out group-hover:bg-sky-100/80 group-hover:text-sky-700">
                    {publication.category.name}
                  </Badge>
                </div>
                <div className="z-10 w-full rounded-b-md p-2 text-sm font-medium leading-4 text-white backdrop-blur-[2px] transition-all duration-200 ease-in-out group-hover:bg-black/20">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    title={publication.title}
                    href={
                      publication.file
                        ? `/publications/${publication?.file?.name}`
                        : '#'
                    }
                    className="line-clamp-1 hover:underline group-hover:underline"
                  >
                    {publication.title}
                  </a>
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
