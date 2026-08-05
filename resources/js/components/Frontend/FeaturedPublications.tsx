import type { MediaItem, Post, Publication } from '@/types';
import { Link } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { register } from 'swiper/element/bundle';

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

type SwiperElement = HTMLElement & {
  initialize?: () => void;
  swiper?: {
    destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  };
};

export const FeaturedPublications = ({
  publications,
  blogPosts,
}: FeaturedPublicationsProps) => {
  const sortedPublications = useMemo(
    () => sortByCreatedAt(publications ?? []),
    [publications]
  );

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
  const swiperRef = useRef(null);
  const canSlide = items.length > 1;
  const itemIds = items.map(item => item.id).join(',');

  useEffect(() => {
    register();

    const el = swiperRef.current as SwiperElement | null;
    if (!el) {
      return;
    }

    Object.assign(el, {
      slidesPerView: 1,
      spaceBetween: 8,
      speed: 450,
      loop: canSlide,
      watchOverflow: true,
      autoplay: canSlide
        ? {
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : false,
      pagination: canSlide
        ? {
            clickable: true,
          }
        : false,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        enabled: true,
        containerMessage: ariaLabel,
        paginationBulletMessage: 'Go to slide {{index}}',
      },
    });

    el.initialize?.();

    return () => {
      el.swiper?.destroy(true, true);
    };
  }, [ariaLabel, canSlide, itemIds]);

  return (
    <section aria-roledescription="carousel" aria-label={ariaLabel}>
      <SectionHeading>{heading}</SectionHeading>
      <swiper-container
        init="false"
        ref={swiperRef}
        class={
          kind === 'publication'
            ? 'featured-publication-swiper w-full'
            : 'featured-blog-swiper w-full'
        }
        style={
          {
            '--swiper-pagination-color': 'hsl(var(--theme-color))',
            '--swiper-pagination-bullet-inactive-color':
              'hsl(var(--muted-foreground))',
            '--swiper-pagination-bullet-inactive-opacity': '0.4',
            '--swiper-pagination-bullet-horizontal-gap': '8px',
            '--swiper-pagination-bullet-size': '10px',
            '--swiper-pagination-bullet-width': '10px',
            '--swiper-pagination-bullet-height': '10px',
            '--swiper-pagination-bottom': '0px',
            paddingBottom: canSlide ? '1.75rem' : undefined,
          } as CSSProperties
        }
      >
        {items.map(item => {
          const media = resolveMedia(item, kind);
          const href = resolveHref(item, kind);

          return (
            <swiper-slide key={item.id} class="group h-auto! py-0.5">
              <ItemLink kind={kind} href={href}>
                <ListCopy title={item.title} subtitle={item.subtitle} />
                {media ? <ListThumb src={media} alt={item.title} /> : null}
              </ItemLink>
            </swiper-slide>
          );
        })}
      </swiper-container>
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
  const className = 'flex items-start justify-between gap-3';

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
