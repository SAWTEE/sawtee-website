import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { Slide } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useMemo, useState } from 'react';

type FullWidthCarouselProps = {
  slides?: Slide[];
  responsiveImages?: string[];
  className?: string;
};

const FullWidthCarousel = ({
  slides,
  responsiveImages,
  className = '',
}: FullWidthCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const plugins = useMemo(() => {
    if (prefersReducedMotion) {
      return [];
    }
    return [
      Autoplay({
        delay: 5500,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ];
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    setCount(api.scrollSnapList().length);
    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (!slides?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-md bg-theme-900 ring-1 ring-black/10 dark:ring-white/10',
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured homepage slides"
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => {
            const imageSrc = slide.media?.[0]?.original_url;
            const srcSet = responsiveImages?.[index] || undefined;
            const hasCopy = Boolean(slide.title || slide.subtitle);

            return (
              <CarouselItem
                key={slide.id}
                className="relative basis-full pl-0"
                aria-hidden={index !== current}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-theme-900 sm:aspect-2/1 lg:aspect-2/1">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      srcSet={srcSet}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      alt={slide.title || 'Homepage slide'}
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      decoding={index === 0 ? 'sync' : 'async'}
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
                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/10"
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 pt-16 sm:px-8 sm:pb-12 md:px-10 md:pb-14">
                        <div className="max-w-2xl">
                          {slide.title ? (
                            <p className="text-balance text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                              {slide.title}
                            </p>
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
              className="absolute bottom-2 right-2 z-20 flex items-center sm:bottom-3 sm:right-3"
              role="group"
              aria-label="Slide indicators"
            >
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1} of ${count}`}
                  aria-current={index === current ? 'true' : undefined}
                  className="flex h-8 w-8 items-center justify-center"
                  onClick={() => api?.scrollTo(index)}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'rounded-full transition-all duration-300',
                      index === current
                        ? 'h-1.5 w-6 bg-white'
                        : 'h-1.5 w-1.5 bg-white/45 hover:bg-white/70'
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
};

export default FullWidthCarousel;
