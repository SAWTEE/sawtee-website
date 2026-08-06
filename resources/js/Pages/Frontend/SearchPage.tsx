import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/layouts/MainLayout';
import { cn, htmlToText } from '@/lib/utils';
import type { FrontendSearchProps, SearchResultPost } from '@/types';
import { Link, router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { FormEvent, useEffect, useId, useState } from 'react';

function categoryLabel(post: SearchResultPost): string | null {
  if (typeof post.category === 'string') {
    return post.category || null;
  }
  return post.category?.name ?? null;
}

function categorySlug(post: SearchResultPost): string | undefined {
  if (typeof post.category === 'string') {
    return post.category_slug;
  }
  return post.category?.slug ?? post.category_slug;
}

function resultHref(post: SearchResultPost): string {
  const slug = categorySlug(post);
  const parentSlug =
    typeof post.category === 'object' && post.category
      ? post.category.parent?.slug
      : undefined;

  if (parentSlug && slug) {
    return `/category/${parentSlug}/${slug}/${post.slug}`;
  }
  if (slug) {
    return `/category/${slug}/${post.slug}`;
  }
  return `#`;
}

function SearchResultRow({ post }: { post: SearchResultPost }) {
  const label = categoryLabel(post);
  const slug = categorySlug(post);
  const excerpt = htmlToText(post.excerpt);
  const href = resultHref(post);

  return (
    <article className="group border-b border-[#006181]/12 py-7 last:border-b-0 md:py-8 dark:border-[#006181]/20">
      <div className="flex flex-col gap-3">
        {(label || post.author) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs tracking-wide uppercase">
            {label &&
              (slug ? (
                <Link
                  href={`/category/${slug}`}
                  className="font-medium text-[#006181] transition-colors hover:text-[#004d66] dark:text-[#4da3c0] dark:hover:text-[#7ec4d8]"
                >
                  {label}
                </Link>
              ) : (
                <span className="font-medium text-[#006181] dark:text-[#4da3c0]">
                  {label}
                </span>
              ))}
            {label && post.author ? (
              <span
                className="bg-[#006181]/25 h-1 w-1 rounded-full dark:bg-[#006181]/45"
                aria-hidden
              />
            ) : null}
            {post.author ? (
              <span className="text-muted-foreground normal-case tracking-normal">
                {post.author}
              </span>
            ) : null}
          </div>
        )}

        <h2 className="text-primary font-serif text-xl leading-snug font-semibold tracking-tight md:text-2xl dark:text-zinc-100">
          <Link
            href={href}
            className="underline-offset-4 transition-colors hover:text-[#006181] hover:underline focus-visible:text-[#006181] focus-visible:underline focus-visible:outline-none dark:hover:text-[#4da3c0] dark:focus-visible:text-[#4da3c0]"
          >
            {post.title}
          </Link>
        </h2>

        {excerpt ? (
          <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-[0.95rem]">
            {excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function SearchPage({ posts, query, seo }: FrontendSearchProps) {
  const [searchQuery, setSearchQuery] = useState(query ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const inputId = useId();
  const results = posts?.data ?? null;
  const hasQuery = Boolean((query ?? '').trim());
  const total = posts?.total ?? 0;
  const hasResults = Boolean(results && results.length > 0);

  useEffect(() => {
    setSearchQuery(query ?? '');
    setIsSearching(false);
  }, [query, posts]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSearching(true);
    router.visit(`/search`, {
      data: { query: searchQuery, page: 1 },
      onFinish: () => setIsSearching(false),
    });
  }

  const heading = hasQuery
    ? total > 0
      ? `${total} ${total === 1 ? 'result' : 'results'}`
      : 'No results'
    : 'Search';

  const subheading = hasQuery
    ? total > 0
      ? `Showing matches for “${query}”`
      : `Nothing matched “${query}”. Try a broader term or different spelling.`
    : 'Search SAWTEE research, publications, news, and resources.';

  return (
    <>
      <WebsiteHead
        title={seo?.title ?? 'Search Page'}
        description={seo?.description}
        image={seo?.image}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />

      <MainLayout>
        <div className="pb-16 md:pb-24">
          <header className="relative overflow-hidden border-b border-[#006181]/12 dark:border-[#006181]/25">
            <div
              className="absolute inset-0 -z-[1] bg-[url(/assets/pattern-tile-green.svg)] opacity-40 dark:bg-[url(/assets/pattern-tile-light-fade.svg)] dark:opacity-30"
              style={{
                backgroundSize: '900px',
                backgroundPosition: 'top center',
              }}
              aria-hidden
            />
            <div className="from-background via-background/90 absolute inset-0 -z-[1] bg-linear-to-b to-transparent dark:from-black/80 dark:via-black/70" />

            <div className="relative mx-auto max-w-3xl px-4 pt-14 pb-10 md:px-6 md:pt-20 md:pb-14">
              <p className="mb-3 text-xs font-medium tracking-[0.18em] text-[#006181] uppercase dark:text-[#4da3c0]">
                Search
              </p>
              <h1 className="text-primary font-serif text-3xl font-semibold tracking-tight md:text-4xl xl:text-5xl dark:text-zinc-100">
                {heading}
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
                {subheading}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
                role="search"
              >
                <label htmlFor={inputId} className="sr-only">
                  Search query
                </label>
                <div className="relative min-w-0 flex-1">
                  <SearchIcon
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#006181] dark:text-[#4da3c0]"
                    aria-hidden
                  />
                  <Input
                    id={inputId}
                    type="search"
                    autoComplete="off"
                    placeholder="Search the site…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={cn(
                      '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
                      'h-12 w-full appearance-none rounded-md border border-[#006181]/20 bg-background/80 py-3 pr-4 pl-10 text-base shadow-none backdrop-blur-sm',
                      'placeholder:text-muted-foreground/80',
                      'focus-visible:border-[#006181]/45 focus-visible:ring-[#006181]/30',
                      'dark:border-[#006181]/35 dark:bg-black/40 dark:focus-visible:border-[#006181]/55'
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="h-12 shrink-0 rounded-md bg-[#006181] px-6 text-sm font-medium text-white hover:bg-[#004d66] disabled:opacity-70 dark:bg-[#006181] dark:hover:bg-[#0a7a9c]"
                >
                  {isSearching ? 'Searching…' : 'Search'}
                </Button>
              </form>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 pt-4 md:px-6 md:pt-6">
            {isSearching && (
              <div
                className="flex items-center gap-3 py-10"
                role="status"
                aria-live="polite"
              >
                <span className="sr-only">Loading search results</span>
                <span className="inline-flex gap-1.5" aria-hidden>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#006181]/70 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#006181]/70 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#006181]/70" />
                </span>
                <span className="text-muted-foreground text-sm">
                  Searching…
                </span>
              </div>
            )}

            {!isSearching && !hasQuery && (
              <div className="border-borderColor/60 mt-6 rounded-lg border border-dashed px-5 py-10 text-center md:px-8 dark:border-white/15">
                <p className="text-primary font-serif text-lg tracking-tight md:text-xl dark:text-zinc-100">
                  Start with a keyword
                </p>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
                  Enter a term above to browse research, dialogue, and policy
                  content from across the site.
                </p>
              </div>
            )}

            {!isSearching && hasQuery && !hasResults && (
              <div className="border-borderColor/60 mt-6 rounded-lg border border-dashed px-5 py-10 text-center md:px-8 dark:border-white/15">
                <p className="text-primary font-serif text-lg tracking-tight md:text-xl dark:text-zinc-100">
                  No matches found
                </p>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
                  Try fewer words, a related theme, or check the spelling — then
                  search again.
                </p>
              </div>
            )}

            {!isSearching && hasResults && (
              <section aria-label="Search results" className="mt-2 md:mt-4">
                {results!.map(post => (
                  <SearchResultRow key={post.id} post={post} />
                ))}
              </section>
            )}

            {!isSearching && hasResults && posts && posts.last_page > 1 && (
              <Pagination
                links={posts.links}
                currentPage={posts.current_page}
                totalPages={posts.last_page}
                nextPage={posts.next_page_url}
                prevPage={posts.prev_page_url}
                className="mt-10"
                nextButtonLabel="Next"
                prevButtonLabel="Previous"
              />
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
