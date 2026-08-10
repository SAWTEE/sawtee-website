import { Link, router } from '@inertiajs/react';
import { SearchIcon, XIcon } from 'lucide-react';
import {
  FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  sanitizeSearchCategory,
  sanitizeSearchQuery,
  sanitizeSearchTheme,
  sanitizeSearchYear,
  SEARCH_QUERY_MAX_LENGTH,
} from '@/lib/search-params';
import { cn, htmlToText } from '@/lib/utils';
import type {
  FrontendSearchProps,
  SearchFilterOptions,
  SearchFilters,
  SearchResultPost,
} from '@/types';

const EMPTY_FILTERS: SearchFilters = {
  category: null,
  year: null,
  theme: null,
};

const EMPTY_OPTIONS: SearchFilterOptions = {
  categories: [],
  years: [],
  themes: [],
};

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

function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(filters.category || filters.year || filters.theme);
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
                className="h-1 w-1 rounded-full bg-[#006181]/25 dark:bg-[#006181]/45"
                aria-hidden
              />
            ) : null}
            {post.author ? (
              <span className="text-muted-foreground tracking-normal normal-case">
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

type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
};

function FilterSelect({
  id,
  label,
  value,
  onChange,
  disabled,
  children,
}: FilterSelectProps) {
  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={id}
        className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'border-borderColor/70 bg-background/80 h-10 w-full appearance-none rounded-md border px-3 pr-9 text-sm shadow-none backdrop-blur-sm',
          'focus-visible:border-[#006181]/45 focus-visible:ring-2 focus-visible:ring-[#006181]/25 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'dark:border-[#006181]/35 dark:bg-black/40 dark:focus-visible:border-[#006181]/55',
          'bg-[length:12px_12px] bg-[right_0.75rem_center] bg-no-repeat',
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%23006181%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')]"
        )}
      >
        {children}
      </select>
    </div>
  );
}

export default function SearchPage({
  posts,
  query,
  filters: filtersProp,
  filterOptions: optionsProp,
  seo,
}: FrontendSearchProps) {
  const filters = filtersProp ?? EMPTY_FILTERS;
  const filterOptions = optionsProp ?? EMPTY_OPTIONS;
  const [searchQuery, setSearchQuery] = useState(query ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const inputId = useId();
  const categoryFilterId = useId();
  const yearFilterId = useId();
  const themeFilterId = useId();
  const results = posts?.data ?? null;
  const hasQuery = Boolean((query ?? '').trim());
  const filtersActive = hasActiveFilters(filters);
  const total = posts?.total ?? 0;
  const hasResults = Boolean(results && results.length > 0);
  const showFilters =
    hasQuery ||
    filtersActive ||
    filterOptions.categories.length > 0 ||
    filterOptions.years.length > 0 ||
    filterOptions.themes.length > 0;

  useEffect(() => {
    setSearchQuery(query ?? '');
    setIsSearching(false);
  }, [query, posts, filters]);

  const activeFilterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.category) {
      const match = filterOptions.categories.find(
        c => c.slug === filters.category
      );
      parts.push(match?.name ?? filters.category);
    }
    if (filters.year) {
      parts.push(String(filters.year));
    }
    if (filters.theme) {
      const match = filterOptions.themes.find(t => t.id === filters.theme);
      if (match) {
        parts.push(match.title);
      }
    }
    return parts;
  }, [filters, filterOptions]);

  function visitSearch(next: {
    query?: string;
    category?: string | null;
    year?: number | null;
    theme?: number | null;
  }) {
    setIsSearching(true);
    const data: Record<string, string | number> = { page: 1 };
    const nextQuery = sanitizeSearchQuery(next.query ?? searchQuery);
    if (nextQuery) {
      data.query = nextQuery;
    }

    const category = sanitizeSearchCategory(
      next.category !== undefined ? next.category : filters.category
    );
    const year = sanitizeSearchYear(
      next.year !== undefined ? next.year : filters.year
    );
    const theme = sanitizeSearchTheme(
      next.theme !== undefined ? next.theme : filters.theme
    );

    if (category) {
      data.category = category;
    }
    if (year) {
      data.year = year;
    }
    if (theme) {
      data.theme = theme;
    }

    router.visit('/search', {
      data,
      preserveState: true,
      preserveScroll: true,
      viewTransition: true,
      onFinish: () => setIsSearching(false),
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    visitSearch({ query: searchQuery });
  }

  function clearFilters() {
    visitSearch({
      query: searchQuery,
      category: null,
      year: null,
      theme: null,
    });
  }

  const heading = hasQuery
    ? total > 0
      ? `${total} ${total === 1 ? 'result' : 'results'}`
      : 'No results'
    : filtersActive
      ? total > 0
        ? `${total} ${total === 1 ? 'result' : 'results'}`
        : 'No results'
      : 'Search';

  const subheading = hasQuery
    ? total > 0
      ? `Showing matches for “${query}”${
          activeFilterSummary.length
            ? ` · filtered by ${activeFilterSummary.join(', ')}`
            : ''
        }`
      : filtersActive
        ? `Nothing matched “${query}” with the selected filters. Clear filters or try a broader term.`
        : `Nothing matched “${query}”. Try a broader term or different spelling.`
    : filtersActive
      ? total > 0
        ? `Showing results filtered by ${activeFilterSummary.join(', ')}`
        : 'No results for the selected filters. Try clearing them or searching with a keyword.'
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

      <div className="pb-16 md:pb-24">
        <header className="relative overflow-hidden border-b border-[#006181]/12 dark:border-[#006181]/25">
          <div
            className="absolute inset-0 -z-[1] bg-pattern-tile opacity-40 dark:bg-pattern-tile-fade dark:opacity-30"
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
                  maxLength={SEARCH_QUERY_MAX_LENGTH}
                  placeholder="Search the site…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={cn(
                    '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
                    'bg-background/80 h-12 w-full appearance-none rounded-md border border-[#006181]/20 py-3 pr-4 pl-10 text-base shadow-none backdrop-blur-sm',
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

            {showFilters && (
              <div className="mt-6 border-t border-[#006181]/12 pt-6 dark:border-[#006181]/25">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                    Refine results
                  </p>
                  {filtersActive ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      disabled={isSearching}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#006181] transition-colors hover:text-[#004d66] disabled:opacity-60 dark:text-[#4da3c0] dark:hover:text-[#7ec4d8]"
                    >
                      <XIcon className="h-3.5 w-3.5" aria-hidden />
                      Clear filters
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  {filterOptions.categories.length > 0 && (
                    <FilterSelect
                      id={categoryFilterId}
                      label="Category"
                      value={filters.category ?? ''}
                      disabled={isSearching}
                      onChange={value =>
                        visitSearch({ category: value || null })
                      }
                    >
                      <option value="">All categories</option>
                      {filterOptions.categories.map(category => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </FilterSelect>
                  )}

                  {filterOptions.years.length > 0 && (
                    <FilterSelect
                      id={yearFilterId}
                      label="Year"
                      value={filters.year ? String(filters.year) : ''}
                      disabled={isSearching}
                      onChange={value =>
                        visitSearch({
                          year: value ? Number(value) : null,
                        })
                      }
                    >
                      <option value="">All years</option>
                      {filterOptions.years.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </FilterSelect>
                  )}

                  {filterOptions.themes.length > 0 && (
                    <FilterSelect
                      id={themeFilterId}
                      label="Theme"
                      value={filters.theme ? String(filters.theme) : ''}
                      disabled={isSearching}
                      onChange={value =>
                        visitSearch({
                          theme: value ? Number(value) : null,
                        })
                      }
                    >
                      <option value="">All themes</option>
                      {filterOptions.themes.map(theme => (
                        <option key={theme.id} value={theme.id}>
                          {theme.title}
                        </option>
                      ))}
                    </FilterSelect>
                  )}
                </div>
              </div>
            )}
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
              <span className="text-muted-foreground text-sm">Searching…</span>
            </div>
          )}

          {!isSearching && !hasQuery && !filtersActive && (
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

          {!isSearching && (hasQuery || filtersActive) && !hasResults && (
            <div className="border-borderColor/60 mt-6 rounded-lg border border-dashed px-5 py-10 text-center md:px-8 dark:border-white/15">
              <p className="text-primary font-serif text-lg tracking-tight md:text-xl dark:text-zinc-100">
                No matches found
              </p>
              <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
                {filtersActive
                  ? 'Try clearing filters, using fewer words, or a related theme — then search again.'
                  : 'Try fewer words, a related theme, or check the spelling — then search again.'}
              </p>
              {filtersActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-sm font-medium text-[#006181] underline-offset-4 hover:underline dark:text-[#4da3c0]"
                >
                  Clear filters
                </button>
              ) : null}
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
    </>
  );
}
