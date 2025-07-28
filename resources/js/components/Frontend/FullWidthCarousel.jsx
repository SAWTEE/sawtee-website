import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

const FullWidthCarousel = ({
  slides,
  responsiveImages,
  autoplay = false,
  ...rest
}) => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: true,
          }),
        ]}
        className="max-h-[600px] w-full max-w-6xl"
        {...rest}
      >
        <CarouselContent>
          {slides?.map(slide => (
            <CarouselItem
              key={slide.id}
              className="group relative flex w-full items-center justify-center p-0"
            >
              <img
                src={slide.media[0]?.original_url}
                alt="slide"
                className="h-full w-full object-cover transition-all duration-500 ease-in"
              />
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/20">
                <span className="text-4xl font-semibold leading-5 tracking-normal text-secondary-foreground text-white">
                  {slide.title}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 z-[20] -translate-y-1/2 dark:text-white" />
        <CarouselNext className="absolute right-4 top-1/2 z-[20] -translate-y-1/2 dark:text-white" />
        <div className="text-md absolute bottom-0 left-0 right-0 py-2 text-center text-white">
          {current} of {count}
        </div>
      </Carousel>
    </div>
  );
};

export default FullWidthCarousel;
