import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

const FullWidthCarousel = ({
  slides = undefined,
  responsiveImages = undefined,
  className = '',
  ...rest
}: any) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!slides?.length) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        plugins={[
          Autoplay({
            delay: 5500,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
        {...rest}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide: any, index: number) => {
            const imageSrc = slide.media?.[0]?.original_url;
            const srcSet = responsiveImages?.[index] || undefined;
            const hasCopy = Boolean(slide.title || slide.subtitle);

            return (
              <CarouselItem
                key={slide.id}
                className="relative basis-full pl-0"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-theme-900 sm:aspect-[2/1] lg:aspect-[21/9]">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      srcSet={srcSet}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      alt={slide.title || 'Homepage slide'}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center bg-theme-800 text-sm text-white/70"
                      aria-hidden
                    >
                      No image
                    </div>
                  )}

                  {hasCopy && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 pt-16 sm:px-8 sm:pb-12 md:px-10 md:pb-14">
                        <div className="max-w-2xl">
                          {slide.title ? (
                            <h2 className="text-balance text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                              {slide.title}
                            </h2>
                          ) : null}
                          {slide.subtitle ? (
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base md:mt-3 md:text-lg">
                              {slide.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {count > 1 && (
          <>
            <CarouselPrevious
              variant="ghost"
              className="left-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 border-0 bg-black/35 text-white shadow-none hover:bg-black/50 hover:text-white disabled:opacity-30 sm:left-3"
            />
            <CarouselNext
              variant="ghost"
              className="right-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 border-0 bg-black/35 text-white shadow-none hover:bg-black/50 hover:text-white disabled:opacity-30 sm:right-3"
            />

            <div
              className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 sm:bottom-4 sm:right-4"
              role="tablist"
              aria-label="Slide indicators"
            >
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={index === current}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    index === current
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/45 hover:bg-white/70'
                  )}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
};

export default FullWidthCarousel;
