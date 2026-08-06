import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { MediaItem, Post, Publication } from '@/types';
import { Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type FeaturedPublication = Publication & {
  subtitle?: string | null;
  volume_slug?: string | null;
  created_at?: string | number;
  media?: MediaItem[];
  file?: { id?: number; name?: string; url?: string; path?: string } | null;
};

type FeaturedPublicationsProps = {
  publications?: FeaturedPublication[];
  blogPosts?: Post[];
};

type ListKind = 'publication' | 'post';

export const FeaturedPublications = ({
  publications,
  blogPosts,
}: FeaturedPublicationsProps) => {
  const sortedPublications = sortByCreatedAt(publications ?? []);

  return (
    <div className="rounded-md border border-borderColor/80 bg-white px-4 py-6 shadow-sm dark:bg-bgDarker sm:px-5 sm:py-7">
      {sortedPublications.length > 0 ? (
        <FeaturedItemsSlider
          heading="Featured publications"
          ariaLabel="Featured publications carousel"
          kind="publication"
          items={sortedPublications}
        />
      ) : null}

      {blogPosts && blogPosts.length > 0 ? (
        <>
          {sortedPublications.length > 0 ? (
            <div
              className="my-6 border-t border-borderColor/70 dark:border-white/10"
              aria-hidden
            />
          ) : null}
          <FeaturedItemsSlider
            heading="Blogs and articles"
            ariaLabel="Blogs and articles carousel"
            kind="post"
            items={blogPosts}
          />
        </>
      ) : null}
    </div>
  );
};

function FeaturedItemsSlider({
  heading,
  ariaLabel,
  kind,
  items,
}: {
  heading: string;
  ariaLabel: string;
  kind: ListKind;
  items: Array<FeaturedPublication | Post>;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const canSlide = items.length > 1;

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

  return (
    <section aria-roledescription="carousel" aria-label={ariaLabel}>
      <SectionHeading>{heading}</SectionHeading>
      <Carousel
        setApi={setApi}
        opts={{ loop: canSlide, align: 'start' }}
        plugins={
          canSlide
            ? [
                Autoplay({
                  delay: 5500,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]
            : []
        }
        className={cn(
          'w-full',
          kind === 'publication'
            ? 'featured-publication-carousel'
            : 'featured-blog-carousel'
        )}
      >
        <CarouselContent className="ml-0">
          {items.map(item => {
            const media = resolveMedia(item, kind);
            const href = resolveHref(item, kind);

            return (
              <CarouselItem key={item.id} className="basis-full pl-0 py-0.5">
                <ItemLink kind={kind} href={href}>
                  <ListCopy title={item.title} subtitle={item.subtitle} />
                  {media ? <ListThumb src={media} alt={item.title} /> : null}
                </ItemLink>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {canSlide ? (
          <div
            className="mt-4 flex items-center justify-center gap-2"
            role="group"
            aria-label="Slide indicators"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current ? 'true' : undefined}
                className="flex h-8 w-8 items-center justify-center"
                onClick={() => api?.scrollTo(index)}
              >
                <span
                  aria-hidden
                  className={cn(
                    'rounded-full transition-all duration-300',
                    index === current
                      ? 'h-2.5 w-2.5 bg-[hsl(var(--theme-color))]'
                      : 'h-2.5 w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70'
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </Carousel>
    </section>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-theme-700 dark:text-theme-300 md:text-xs">
      {children}
    </h2>
  );
}

function ItemLink({
  kind,
  href,
  children,
}: {
  kind: ListKind;
  href: string;
  children: ReactNode;
}) {
  const className = 'group flex items-start justify-between gap-3';

  if (kind === 'post') {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function ListCopy({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string | null;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-sans text-sm font-semibold leading-snug text-secondary-foreground transition-colors group-hover:text-theme-700 group-hover:underline group-hover:underline-offset-2 dark:group-hover:text-theme-300 md:text-[0.9375rem]">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ListThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      title={alt}
      aria-hidden
      className="mx-auto h-28 w-1/3 max-w-20 shrink-0 overflow-hidden rounded-md border border-borderColor/70 bg-muted/30"
    >
      <img
        className="h-full w-full object-cover"
        src={src}
        alt=""
        width={80}
        height={112}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function sortByCreatedAt(items: FeaturedPublication[]): FeaturedPublication[] {
  return [...items].sort((a, b) => {
    const aTime =
      typeof a.created_at === 'number'
        ? a.created_at
        : Date.parse(String(a.created_at ?? 0));
    const bTime =
      typeof b.created_at === 'number'
        ? b.created_at
        : Date.parse(String(b.created_at ?? 0));
    return aTime - bTime;
  });
}

function resolveMedia(
  item: { media?: MediaItem[]; title?: string },
  kind: ListKind
): string | null {
  if (!item.media?.length) {
    return `https://placehold.co/120x150/eee/000/webp?text=No+image`;
  }

  const collection =
    kind === 'publication'
      ? 'publication_featured_image'
      : 'post-featured-image';

  return (
    item.media.find(media => media.collection_name === collection)
      ?.preview_url ??
    item.media.find(media => media.collection_name === collection)
      ?.original_url ??
    `https://placehold.co/120x150/eee/000/webp?text=No+image`
  );
}

function resolveHref(
  item: FeaturedPublication | Post,
  kind: ListKind
): string {
  if (kind === 'publication') {
    const publication = item as FeaturedPublication;
    return publication.volume_slug
      ? `/category/publications/${publication.category?.slug}/${publication.volume_slug}`
      : `/publications/${publication.file?.name}`;
  }

  const post = item as Post;
  return `/category/${post.category?.slug}/${post.slug}`;
}
