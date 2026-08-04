import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export const FeaturedPublications = ({
  publications = undefined,
  blogPosts = undefined,
}: any) => {
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
          <PublicationList
            heading="Blogs and articles"
            items={blogPosts}
            kind="post"
          />
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
  items: any[] | undefined;
  kind: ListKind;
}) {
  if (!items?.length) {
    return null;
  }

  const sorted = [...items].sort(
    (a: any, b: any) => a.created_at - b.created_at
  );

  return (
    <div>
      <h3 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-theme-700 dark:text-theme-300 md:text-xs">
        {heading}
      </h3>
      <ul className="divide-y divide-borderColor/60 dark:divide-white/10">
        {sorted.map((item: any) => {
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

function resolveMedia(item: any, kind: ListKind): string | null {
  if (!item.media?.length) {
    return `https://placehold.co/120x150/eee/000/webp?text=No+image`;
  }

  const collection =
    kind === 'publication'
      ? 'publication_featured_image'
      : 'post-featured-image';

  return (
    item.media.find((media: any) => media.collection_name === collection)
      ?.original_url ?? `https://placehold.co/120x150/eee/000/webp?text=No+image`
  );
}

function resolveHref(item: any, kind: ListKind): string {
  if (kind === 'publication') {
    return item.volume_slug
      ? `/category/publications/${item.category.slug}/${item.volume_slug}`
      : `/publications/${item.file?.name}`;
  }

  return `/category/${item.category.slug}/${item.slug}`;
}
