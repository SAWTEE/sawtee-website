import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

import { DateFormat } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { HomeFeature, Post, SharedProps } from '@/types';

type LDCArchiveProps = {
  posts?: Post[] | null;
};

function postHref(post: Post): string {
  if (post.link) {
    return post.link;
  }

  const categorySlug = post.category?.slug ?? 'LDCs-Interests';
  return `/category/${categorySlug}/${post.slug}`;
}

/** Match prior archive behaviour: sawtee.org + relative paths use Inertia Link. */
function isInertiaHref(href: string): boolean {
  return href.startsWith('/') || href.includes('sawtee.org');
}

function PostLink({
  post,
  className,
  children,
}: {
  post: Post;
  className?: string;
  children: ReactNode;
}) {
  const href = postHref(post);

  if (isInertiaHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function groupByGenre(posts: Post[]): [string, Post[]][] {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const key = post.genre?.trim() || 'Resources';
    const list = groups.get(key) ?? [];
    list.push(post);
    groups.set(key, list);
  }

  return Array.from(groups.entries()).sort((a, b) => {
    if (a[0] === 'Resources') return 1;
    if (b[0] === 'Resources') return -1;
    return a[0].localeCompare(b[0]);
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const LDCArchive = ({ posts = [] }: LDCArchiveProps) => {
  const features = usePage<SharedProps>().props.features ?? [];
  const ldcFeature: HomeFeature | undefined = features.find(f =>
    (f.link ?? '').includes('LDCs-Interests')
  );
  const items = posts ?? [];

  if (!items.length) {
    return (
      <p className="text-muted-foreground px-4 font-serif text-lg tracking-tight md:px-8">
        No resources found
      </p>
    );
  }

  const [lead, ...rest] = items;
  const genreGroups = groupByGenre(rest);
  const shelfGenres = genreGroups.map(([genre]) => genre);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <section
        className="relative mb-12 md:mb-16"
        aria-labelledby="ldc-collection-intro"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="tracking-label text-theme-600 dark:text-theme-450 text-xs font-medium uppercase">
              Curated collection
            </p>
            <h2
              id="ldc-collection-intro"
              className="text-primary dark:text-foreground mt-3 font-serif text-2xl leading-tight font-semibold tracking-tight md:text-3xl"
            >
              Trade, finance &amp; irreversible graduation
            </h2>
            {shelfGenres.length > 0 ? (
              <ul
                className="mt-6 flex flex-wrap gap-2"
                aria-label="Resource types"
              >
                {shelfGenres.map(genre => (
                  <li key={genre}>
                    <a
                      href={`#ldc-genre-${slugify(genre)}`}
                      className="border-theme-600/20 bg-theme-600/6 text-theme-600 hover:bg-theme-600/12 focus-visible:ring-theme-600/35 dark:border-theme-600/40 dark:bg-theme-600/15 dark:text-theme-450 inline-flex items-center border px-2.5 py-1 text-xs font-medium tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {genre}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="relative lg:col-span-8">
            <div
              className="bg-brand-glow-soft pointer-events-none absolute -inset-x-2 -inset-y-3"
              aria-hidden
            />
            <p className="text-primary/90 dark:text-foreground relative max-w-2xl font-serif text-lg leading-relaxed tracking-tight md:text-xl">
              {ldcFeature?.description?.trim() ??
                'Articles, reports, and webinars on the constraints LDCs face, their evolving priorities, and the reforms needed to leverage trade and finance for sustainable development.'}
            </p>
            <p className="text-muted-foreground relative mt-4 text-sm md:text-base">
              {items.length} resource{items.length === 1 ? '' : 's'} in this
              collection
            </p>
          </div>
        </div>

        <div
          className="from-theme-600/35 via-theme-600/12 dark:from-theme-600/50 dark:via-theme-600/20 mt-10 h-px w-full bg-linear-to-r to-transparent"
          aria-hidden
        />
      </section>

      <section className="mb-14 md:mb-16" aria-label="Featured resource">
        <LeadResource post={lead} />
      </section>

      {genreGroups.map(([genre, genrePosts]) => (
        <section
          key={genre}
          id={`ldc-genre-${slugify(genre)}`}
          className="mb-14 scroll-mt-24 last:mb-4 md:mb-16"
          aria-labelledby={`ldc-heading-${slugify(genre)}`}
        >
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <div>
              <h3
                id={`ldc-heading-${slugify(genre)}`}
                className="text-primary dark:text-foreground font-serif text-xl font-semibold tracking-tight md:text-2xl"
              >
                {genre}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {genrePosts.length} item{genrePosts.length === 1 ? '' : 's'}
              </p>
            </div>
            <span
              className="bg-theme-600/15 dark:bg-theme-600/25 mb-1 hidden h-px max-w-xs flex-1 sm:block"
              aria-hidden
            />
          </div>

          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {genrePosts.map((post, index) => {
              const wide = index === 0 && genrePosts.length > 2;

              return (
                <li
                  key={post.id}
                  className={wide ? 'sm:col-span-2' : 'sm:col-span-1'}
                >
                  <ResourceCard post={post} featured={wide} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

function LeadResource({ post }: { post: Post }) {
  const external = Boolean(post.link && !isInertiaHref(post.link));

  return (
    <article className="group border-theme-600/12 bg-theme-600/4 dark:border-theme-600/25 dark:bg-theme-600/10 relative overflow-hidden rounded-lg border">
      <div
        className="bg-theme-600 dark:bg-theme-450 absolute inset-y-0 left-0 w-1"
        aria-hidden
      />
      <div className="flex flex-col gap-5 p-6 pl-7 md:flex-row md:items-end md:justify-between md:gap-8 md:p-8 md:pl-9">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="tracking-eyebrow text-theme-600 dark:text-theme-450 text-xs font-semibold uppercase">
              Latest
            </span>
            {post.genre ? (
              <>
                <span className="text-muted-foreground/40" aria-hidden>
                  ·
                </span>
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {post.genre}
                </span>
              </>
            ) : null}
            {post.published_at ? (
              <>
                <span className="text-muted-foreground/40" aria-hidden>
                  ·
                </span>
                <time className="text-muted-foreground text-xs font-medium md:text-sm">
                  {DateFormat(post.published_at)}
                </time>
              </>
            ) : null}
          </div>

          <PostLink post={post} className="focus-visible:outline-none">
            <h3 className="text-primary group-hover:text-theme-600 lg:text-display dark:text-foreground dark:group-hover:text-theme-450 font-serif text-xl leading-snug font-semibold tracking-tight transition-colors md:text-2xl">
              {post.title}
            </h3>
          </PostLink>
        </div>

        <PostLink
          post={post}
          className="text-theme-600 focus-visible:ring-theme-600/35 dark:text-theme-450 inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
        >
          {external ? (
            <>
              View resource
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </>
          ) : (
            <>
              Open
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </>
          )}
          <span className="sr-only">: {post.title}</span>
        </PostLink>
      </div>
    </article>
  );
}

function ResourceCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  const external = Boolean(post.link && !isInertiaHref(post.link));

  return (
    <article
      className={cn(
        'group bg-bgDarker/60 relative flex h-full flex-col border border-transparent transition-colors',
        'hover:border-theme-600/18 hover:bg-theme-600/3',
        'dark:hover:border-theme-600/30 dark:hover:bg-theme-600/10 dark:bg-black/30',
        featured ? 'p-6 md:p-7' : 'p-5 md:p-6'
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        {post.genre ? (
          <span className="tracking-kicker text-theme-600 after:bg-theme-600/45 dark:text-theme-450 dark:after:bg-theme-450/50 relative text-xs font-semibold uppercase after:absolute after:top-full after:left-0 after:mt-1 after:h-px after:w-6">
            {post.genre}
          </span>
        ) : (
          <span />
        )}
        {post.published_at ? (
          <time className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
            {DateFormat(post.published_at)}
          </time>
        ) : null}
      </div>

      <PostLink
        post={post}
        className="mt-1 flex flex-1 flex-col focus-visible:outline-none"
      >
        <h4
          className={cn(
            'text-primary font-serif leading-snug font-semibold tracking-tight underline-offset-4 transition-colors',
            'group-hover:text-theme-600 group-hover:underline',
            'group-focus-visible:text-theme-600 group-focus-visible:underline',
            'dark:text-foreground dark:group-hover:text-theme-450 dark:group-focus-visible:text-theme-450',
            featured ? 'text-lg md:text-xl' : 'text-base md:text-lg'
          )}
        >
          {post.title}
        </h4>

        <span className="text-muted-foreground mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium tracking-wide uppercase opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          {external ? 'External' : 'Open'}
          {external ? (
            <ExternalLink className="h-3 w-3" aria-hidden />
          ) : (
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          )}
        </span>
      </PostLink>
    </article>
  );
}

export default LDCArchive;
