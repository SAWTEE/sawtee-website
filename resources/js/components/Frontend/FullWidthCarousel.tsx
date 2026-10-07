import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useMemo, useState } from 'react';

import CarouselIndicators from '@/components/Frontend/CarouselIndicators';
import ResponsiveImage from '@/components/Frontend/responsive-image';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { dismissStaticLcpFallback } from '@/lib/dismiss-lcp-fallback';
import { firstSrcSetUrl } from '@/lib/media-image';
import { cn } from '@/lib/utils';
import type { Slide } from '@/types';

type FullWidthCarouselProps = {
  slides?: Slide[];
  responsiveImages?: string[];
  className?: string;
  /** Stretch to the sibling column height on large screens (home aside). */
  matchSiblingHeight?: boolean;
};

const FullWidthCarousel = ({
  slides,
  responsiveImages,
  className = '',
  matchSiblingHeight = false,
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

  const firstSlideSrc = firstSrcSetUrl(
    slides?.[0]?.media?.[0]?.srcset || responsiveImages?.[0],
    slides?.[0]?.media?.[0]?.original_url
  );

  useEffect(() => {
    if (!slides?.length || !firstSlideSrc) {
      dismissStaticLcpFallback();
    }
  }, [firstSlideSrc, slides?.length]);

  if (!slides?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-theme-900 relative w-full overflow-hidden rounded-md ring-1 ring-black/10 dark:ring-white/10',
        matchSiblingHeight && 'lg:h-full',
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
        className={cn('w-full', matchSiblingHeight && 'lg:h-full')}
      >
        <CarouselContent
          className={cn('ml-0', matchSiblingHeight && 'lg:h-full')}
        >
          {slides.map((slide, index) => {
            const image = slide.media?.[0];
            const srcSet =
              image?.srcset || responsiveImages?.[index] || undefined;
            const imageSrc = firstSrcSetUrl(srcSet, image?.original_url);
            const hasCopy = Boolean(slide.title || slide.subtitle);

            return (
              <CarouselItem
                key={slide.id}
                className={cn(
                  'relative basis-full pl-0',
                  matchSiblingHeight && 'lg:h-full'
                )}
                aria-hidden={index !== current}
              >
                <div
                  className={cn(
                    'bg-theme-900 relative w-full overflow-hidden',
                    matchSiblingHeight
                      ? 'aspect-video sm:aspect-2/1 lg:aspect-auto lg:h-full'
                      : 'aspect-video sm:aspect-2/1 lg:aspect-2/1'
                  )}
                >
                  {imageSrc ? (
                    <ResponsiveImage
                      src={imageSrc}
                      srcSet={srcSet}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      placeholder={image?.placeholder}
                      alt={slide.title || 'Homepage slide'}
                      width={1280}
                      height={720}
                      className={cn(
                        'h-full w-full object-cover',
                        matchSiblingHeight && 'lg:absolute lg:inset-0'
                      )}
                      priority={index === 0}
                      onLoad={
                        index === 0 ? dismissStaticLcpFallback : undefined
                      }
                      onError={
                        index === 0 ? dismissStaticLcpFallback : undefined
                      }
                    />
                  ) : (
                    <div
                      className={cn(
                        'bg-theme-800 flex h-full w-full items-center justify-center text-sm text-white/70',
                        matchSiblingHeight && 'lg:absolute lg:inset-0'
                      )}
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
                      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pt-16 pb-10 sm:px-8 sm:pb-12 md:px-10 md:pb-14">
                        <div className="max-w-2xl">
                          {slide.title ? (
                            <p className="text-xl font-semibold tracking-tight text-balance text-white sm:text-2xl md:text-3xl lg:text-4xl">
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
              className="top-1/2 left-2 z-20 h-9 w-9 -translate-y-1/2 border-0 bg-black/35 text-white shadow-none hover:bg-black/50 hover:text-white disabled:opacity-30 sm:left-3"
            />
            <CarouselNext
              variant="ghost"
              className="top-1/2 right-2 z-20 h-9 w-9 -translate-y-1/2 border-0 bg-black/35 text-white shadow-none hover:bg-black/50 hover:text-white disabled:opacity-30 sm:right-3"
            />

            <div className="absolute right-2 bottom-2 z-20 sm:right-3 sm:bottom-3">
              <CarouselIndicators
                count={count}
                current={current}
                onSelect={index => api?.scrollTo(index)}
                variant="onMedia"
              />
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
};

export default FullWidthCarousel;
