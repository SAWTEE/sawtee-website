import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import '../../../css/video-carousel.css';
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
  spacing?: number | string;
  pagination?: boolean;
  className?: string;
};

function featuredMedia(post: VideoPost): VideoMedia | null {
  return (
    post.media?.find(m => m.collection_name === 'post-featured-image') ?? null
  );
}

function mainImageUrl(media: VideoMedia | null): string {
  // Prefer the large conversion / rewritten URL, never force a tiny preview here.
  return media?.original_url || '/assets/SM-placeholder-1024x512.png';
}

function thumbImageUrl(media: VideoMedia | null): string {
  return (
    media?.preview_url ||
    media?.original_url ||
    '/assets/SM-placeholder-300x150.png'
  );
}

const VideoCarousel = ({
  posts = [],
  spacing = 0,
  pagination = false,
  className = '',
}: VideoCarouselProps) => {
  const swiperElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    register();
  }, []);

  if (!posts?.length) {
    return null;
  }

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
        <swiper-container
          ref={swiperElRef as any}
          slides-per-view={1}
          pagination={pagination}
          keyboard={true}
          loop={posts.length > 1}
          space-between={spacing}
          thumbs-swiper=".thumbs-swiper"
          class="video-carousel"
        >
          <div slot="container-start">
            {posts.length > 1 ? (
              <>
                <Button
                  type="button"
                  className="absolute left-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm hover:bg-black/75 hover:text-white"
                  aria-label="Previous video"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    (swiperElRef.current as any)?.swiper?.slidePrev?.()
                  }
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  className="absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-sm hover:bg-black/75 hover:text-white"
                  aria-label="Next video"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    (swiperElRef.current as any)?.swiper?.slideNext?.()
                  }
                >
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </>
            ) : null}
          </div>

          {posts.map(article => {
            const media = featuredMedia(article);

            return (
              <swiper-slide key={article.id} class="video-slide">
                <a
                  className="group relative block aspect-video overflow-hidden rounded-md border border-borderColor/80 bg-theme-900 shadow-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-theme-500"
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
                    className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg ring-4 ring-white/25 transition duration-200 group-hover:scale-105 group-hover:bg-red-500"
                    aria-hidden
                  >
                    <Play className="ml-0.5 h-6 w-6 fill-current" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <span className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow md:text-base">
                      {article.title}
                    </span>
                  </span>
                </a>
              </swiper-slide>
            );
          })}
        </swiper-container>
      </div>

      <div className="min-w-0 self-center lg:col-span-5">
        <swiper-container
          class="thumbs-swiper"
          space-between="8"
          slides-per-view="auto"
          direction="vertical"
          free-mode="true"
          watch-slides-progress="true"
          style={{ maxHeight: '22rem' }}
        >
          {posts.map((article, index) => {
            const media = featuredMedia(article);

            return (
              <swiper-slide key={article.id} class="thumb-slide !h-auto">
                <button
                  type="button"
                  className="thumb-button group flex w-full items-center gap-3 rounded-md border border-transparent p-2 text-left transition-colors hover:border-borderColor/80 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-500"
                  aria-label={`Show video: ${article.title}`}
                  onClick={() =>
                    (swiperElRef.current as any)?.swiper?.slideToLoop?.(index)
                  }
                >
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md border border-borderColor/70 bg-muted">
                    <img
                      className="h-full w-full object-cover"
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

                  <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground md:text-[0.9375rem]">
                    {article.title}
                  </p>
                </button>
              </swiper-slide>
            );
          })}
        </swiper-container>
      </div>
    </div>
  );
};

export default VideoCarousel;
