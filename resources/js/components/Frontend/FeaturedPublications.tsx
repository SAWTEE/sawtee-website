import type { MediaItem, Post, Publication } from '@/types';
import { Link } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/pagination';

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

export const FeaturedPublications = ({
  publications,
  blogPosts,
}: FeaturedPublicationsProps) => {
  return (
    <div className="rounded-md border border-borderColor/80 bg-white px-4 py-5 shadow-sm dark:bg-bgDarker sm:px-5 sm:py-6">
      <PublicationList
        heading="Featured publications"
        items={publications}
        kind="publication"
      />

      {blogPosts && blogPosts.length > 0 ? (
        <>
          <div
            className="my-5 border-t border-borderColor/70 dark:border-white/10"
            aria-hidden
          />
          <BlogPostsSlider posts={blogPosts} />
        </>
      ) : null}
    </div>
  );
};

type ListKind = 'publication' | 'post';

function PublicationList({
  heading,
  items,
  kind,
}: {
  heading: string;
  items: FeaturedPublication[] | undefined;
  kind: ListKind;
}) {
  if (!items?.length) {
    return null;
  }

  const sorted = [...items].sort((a, b) => {
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

  return (
    <div>
      <SectionHeading>{heading}</SectionHeading>
      <ul className="divide-y divide-borderColor/60 dark:divide-white/10">
        {sorted.map(item => {
          const media = resolveMedia(item, kind);
          const href = resolveHref(item, kind);

          return (
            <li key={item.id} className="group py-3 first:pt-0 last:pb-0">
              <ItemLink kind={kind} href={href}>
                <ListCopy title={item.title} subtitle={item.subtitle} />
                {media ? <ListThumb src={media} alt={item.title} /> : null}
              </ItemLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type SwiperElement = HTMLElement & {
  initialize?: () => void;
  swiper?: {
    destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  };
};

function BlogPostsSlider({ posts }: { posts: Post[] }) {
  const swiperRef = useRef(null);
  const canSlide = posts.length > 1;
  const postIds = posts.map(post => post.id).join(',');

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
        containerMessage: 'Blogs and articles carousel',
        paginationBulletMessage: 'Go to article {{index}}',
      },
    });

    el.initialize?.();

    return () => {
      el.swiper?.destroy(true, true);
    };
  }, [canSlide, postIds]);

  return (
    <section aria-roledescription="carousel" aria-label="Blogs and articles">
      <SectionHeading>Blogs and articles</SectionHeading>
      <swiper-container
        init="false"
        ref={swiperRef}
        class="featured-blog-swiper w-full"
        style={
          {
            '--swiper-pagination-color': 'hsl(var(--theme-color))',
            '--swiper-pagination-bullet-inactive-color':
              'hsl(var(--muted-foreground))',
            '--swiper-pagination-bullet-inactive-opacity': '0.4',
            '--swiper-pagination-bullet-horizontal-gap': '3px',
            '--swiper-pagination-bullet-size': '6px',
            '--swiper-pagination-bottom': '0px',
            paddingBottom: canSlide ? '1.5rem' : undefined,
          } as CSSProperties
        }
      >
        {posts.map(post => {
          const media = resolveMedia(post, 'post');
          const href = resolveHref(post, 'post');

          return (
            <swiper-slide key={post.id} class="group !h-auto py-0.5">
              <ItemLink kind="post" href={href}>
                <ListCopy title={post.title} subtitle={post.subtitle} />
                {media ? <ListThumb src={media} alt={post.title} /> : null}
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
    <h3 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-theme-700 dark:text-theme-300 md:text-xs">
      {children}
    </h3>
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
      className="mx-auto h-[90px] w-1/3 max-w-16 shrink-0 overflow-hidden rounded-md border border-borderColor/70 bg-muted/30"
    >
      <img
        className="h-full w-full object-cover"
        src={src}
        alt=""
        loading="lazy"
      />
    </div>
  );
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
      ?.original_url ?? `https://placehold.co/120x150/eee/000/webp?text=No+image`
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
