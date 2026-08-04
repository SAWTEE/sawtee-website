// import required modules
import { ArrowLeftIcon, ArrowRightIcon, PlayCircleIcon } from 'lucide-react';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../css/video-carousel.css';
import { Button } from '../ui/button';

const VideoCarousel = ({
  posts,
  spacing,
  pagination,
  scrollbar,
  showCategoryTag = false,
  direction,
  children,
  ...rest
}) => {
  const swiperElRef = useRef(null);

  return (
    <div className="max-w-8xl mx-auto grid w-full gap-10 lg:grid-cols-5">
      <div className="h-full self-center lg:col-span-3">
        <swiper-container
          ref={swiperElRef}
          slides-per-view={1}
          pagination={pagination}
          keyboard={true}
          loop={true}
          space-between={spacing}
          thumbs-swiper=".thumbs-swiper"
          class={'video-carousel'}
          {...rest}
        >
          <div slot="container-start">
            <Button
              className={
                'absolute left-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full'
              }
              id="prev-button"
              aria-label="previous"
              size="icon"
              variant="ghost"
              onClick={() => swiperElRef.current.swiper.slidePrev()}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              className="absolute right-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full"
              id="next-button"
              size="icon"
              variant="ghost"
              aria-label="next"
              onClick={() => swiperElRef.current.swiper.slideNext()}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
          {posts.map(article => {
            const media =
              article.media.length > 0
                ? article.media?.filter(
                    m => m.collection_name === 'post-featured-image'
                  )[0]
                : null;
            return (
              <swiper-slide key={article.id} class="swiper-slide video-slide">
                <div className="group relative h-full w-full overflow-hidden rounded-lg border">
                  <PlayCircleIcon
                    aria-label={'Play Button'}
                    className="duration-250 absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-50 transition-all ease-in-out group-hover:opacity-100"
                  />
                  <a
                    className="z-20"
                    target="_blank"
                    rel="noreferrer"
                    href={article.link}
                  >
                    <img
                      className="h-full w-full object-cover"
                      alt={article.title}
                      src={
                        media
                          ? media.original_url
                          : '/assets/SM-placeholder-1024x512.png'
                      }
                    />
                  </a>
                </div>
              </swiper-slide>
            );
          })}
        </swiper-container>
      </div>
      <div className="self-center lg:col-span-2">
        <swiper-container
          class="thumbs-swiper"
          space-between="10"
          slides-per-view="5"
          direction="vertical"
          free-mode="true"
          watch-slides-progress="true"
        >
          {posts.map(article => {
            const media = article.media.filter(
              m => m.collection_name === 'post-featured-image'
            )[0];
            return (
              <swiper-slide key={article.id} class="thumb-slide">
                <div className="group flex w-full cursor-pointer items-center gap-4">
                  <div className="relative max-w-24 overflow-hidden border">
                    <PlayCircleIcon
                      aria-label={'Play Button'}
                      className="duration-250 absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-50 transition-all ease-in-out group-hover:opacity-100"
                    />
                    <img
                      className="aspect-[5/3] h-full w-full rounded-md object-cover"
                      alt={article.title}
                      src={
                        media
                          ? media.original_url
                          : '/assets/SM-placeholder-300x150.png'
                      }
                    />
                  </div>

                  <p className="text-md text-secondary-foreground">
                    {article.title}
                  </p>
                </div>
              </swiper-slide>
            );
          })}
        </swiper-container>
      </div>
    </div>
  );
};

export default VideoCarousel;
