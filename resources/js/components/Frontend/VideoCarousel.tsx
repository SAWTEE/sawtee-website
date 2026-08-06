import '../../../css/video-carousel.css';

import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

type VideoMedia = {
  collection_name?: string;
  original_url?: string;
  preview_url?: string;
};

type VideoPost = {
  id: number | string;
  title: string;
  link?: string | null;
  media?: VideoMedia[];
};

type VideoCarouselProps = {
  posts?: VideoPost[];
  className?: string;
};

function featuredMedia(post: VideoPost): VideoMedia | null {
  return (
    post.media?.find(m => m.collection_name === 'post-featured-image') ?? null
  );
}

function mainImageUrl(media: VideoMedia | null): string {
  return media?.original_url || '/assets/SM-placeholder-1024x512.png';
}

function thumbImageUrl(media: VideoMedia | null): string {
  return (
    media?.preview_url ||
    media?.original_url ||
    '/assets/SM-placeholder-300x150.png'
  );
}

const VideoCarousel = ({ posts = [], className = '' }: VideoCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    const thumbs = thumbsRef.current;
    if (!thumbs) {
      return;
    }

    const active = thumbs.querySelector<HTMLElement>(
      `[data-thumb-index="${current}"]`
    );
    if (!active) {
      return;
    }

    // Scroll only inside the thumbs list — never the document.
    // scrollIntoView was pulling the homepage down to "Recordings and resources"
    // when this lazy section mounted and selected the first thumb.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    thumbs.scrollTo({
      top: active.offsetTop - thumbs.clientHeight / 2 + active.clientHeight / 2,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [current]);

  if (!posts?.length) {
    return null;
  }

  const canSlide = posts.length > 1;

  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-12 lg:gap-10',
        className
      )}
      role="region"
      aria-label="Video recordings and resources"
    >
      <div className="relative min-w-0 lg:col-span-7">
        <Carousel
          setApi={setApi}
          opts={{ loop: canSlide, align: 'start' }}
          className="video-carousel"
        >
          <CarouselContent className="ml-0">
            {posts.map(article => {
              const media = featuredMedia(article);

              return (
                <CarouselItem
                  key={article.id}
                  className="video-slide basis-full pl-0"
                >
                  <a
                    className="group border-borderColor/80 bg-theme-900 focus-visible:ring-theme-500 relative block aspect-video overflow-hidden rounded-md border shadow-sm ring-offset-2 outline-none focus-visible:ring-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={article.link || '#'}
                    aria-label={`Watch ${article.title} (opens in a new tab)`}
                  >
                    <img
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      alt=""
                      width={1200}
                      height={675}
                      loading="lazy"
                      decoding="async"
                      src={mainImageUrl(media)}
                    />
                    <span
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent"
                      aria-hidden
                    />
                    <span
                      className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg ring-4 ring-white/25 transition duration-200 group-hover:scale-105 group-hover:bg-red-500"
                      aria-hidden
                    >
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <span className="line-clamp-2 text-sm leading-snug font-semibold text-white drop-shadow md:text-base">
                        {article.title}
                      </span>
                    </span>
                  </a>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {canSlide ? (
            <>
              <Button
                type="button"
                className="absolute top-1/2 left-3 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm hover:bg-black/75 hover:text-white"
                aria-label="Previous video"
                size="icon"
                variant="ghost"
                onClick={() => api?.scrollPrev()}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                className="absolute top-1/2 right-3 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm hover:bg-black/75 hover:text-white"
                aria-label="Next video"
                size="icon"
                variant="ghost"
                onClick={() => api?.scrollNext()}
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </>
          ) : null}
        </Carousel>
      </div>

      <div className="min-w-0 self-center lg:col-span-5">
        <div
          ref={thumbsRef}
          className="thumbs-list"
          role="list"
          aria-label="Video thumbnails"
        >
          {posts.map((article, index) => {
            const media = featuredMedia(article);
            const isActive = index === current;

            return (
              <div
                key={article.id}
                role="listitem"
                data-thumb-index={index}
                className="thumb-item"
              >
                <button
                  type="button"
                  className={cn(
                    'thumb-button group focus-visible:ring-theme-500 flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    isActive
                      ? 'border-theme-500/55 bg-theme-500/8'
                      : 'hover:border-borderColor/80 hover:bg-muted/40 border-transparent'
                  )}
                  aria-label={`Show video: ${article.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => api?.scrollTo(index)}
                >
                  <div className="border-borderColor/70 bg-muted relative h-14 w-24 shrink-0 overflow-hidden rounded-md border">
                    <img
                      className={cn(
                        'h-full w-full object-cover',
                        !isActive && 'opacity-[0.88]'
                      )}
                      alt=""
                      width={96}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      src={thumbImageUrl(media)}
                    />
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-black/25"
                      aria-hidden
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-sm ring-2 ring-white/30">
                        <Play className="ml-px h-3 w-3 fill-current" />
                      </span>
                    </span>
                  </div>

                  <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium md:text-[0.9375rem]">
                    {article.title}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
