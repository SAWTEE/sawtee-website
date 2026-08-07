import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostMeta from '@/components/Frontend/post/post-meta';
import SimpleList from '@/components/Frontend/SimpleList';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/helpers';
import type { FrontendArticleProps } from '@/types';

type ReadingTimeOptions = {
  wordsPerMinute?: number;
  emoji?: boolean;
};

const calculateReadingTime = (
  content: string | null | undefined,
  options: ReadingTimeOptions = {}
): string | null => {
  if (!content) return null;

  const { wordsPerMinute = 225, emoji = false } = options;

  const cleanText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return null;

  const words = cleanText.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (emoji) {
    return `📖 ${minutes} min read`;
  }

  return `${minutes} min read`;
};

export default function Article({
  article,
  volume,
  featured_image = null,
  srcSet = null,
  relatedArticles = [],
  seo,
}: FrontendArticleProps) {
  const readingTime = useMemo(() => {
    if (!article?.content) return null;

    return calculateReadingTime(article.content, {
      emoji: false,
      wordsPerMinute: 225,
    });
  }, [article?.content]);

  if (!article || !volume) {
    return null;
  }

  const { title, subtitle, content } = article;
  const volumeLabel = volume.volume ?? volume.title;
  const volumePath = volume.slug ?? volume.volume_slug ?? '';
  const hasRelated = relatedArticles.length > 0;

  return (
    <>
      <WebsiteHead
        title={seo?.title ?? volumeLabel ?? ''}
        description={seo?.description ?? article.meta_description ?? undefined}
        image={
          seo?.image ??
          (featured_image ? featured_image : '/assets/logo-sawtee.webp')
        }
        url={seo?.url}
        type={seo?.type ?? 'article'}
        jsonLd={seo?.jsonLd}
      />

      <article className="relative w-full px-5 py-12 md:px-10 md:py-16 lg:py-20">
        <header className="mx-auto w-full max-w-3xl text-left md:text-center">
          <div className="post-categories mb-3 flex flex-wrap justify-center gap-2">
            <Link href={`/trade-insight/${volumePath}`}>
              <Button
                variant="outline"
                className="category h-auto rounded-md border-[#006181]/25 px-3 py-1 text-xs font-medium tracking-wide text-[#006181] uppercase hover:bg-[#006181]/8 hover:text-[#006181] dark:border-[#006181]/40 dark:text-[#4da3c0] dark:hover:bg-[#006181]/15"
              >
                {volumeLabel}
              </Button>
            </Link>
          </div>
          <h1 className="text-primary font-serif text-2xl font-semibold tracking-tight capitalize md:text-3xl xl:text-4xl dark:text-zinc-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-3 max-w-prose text-base leading-relaxed md:text-lg">
              {subtitle}
            </p>
          )}
          <PostMeta
            className="mt-5 border-b border-[#006181]/12 pb-5 dark:border-[#006181]/20"
            author={article.author}
            date={article.published_at}
            readingTime={readingTime}
            tags={article.tags}
          />
        </header>

        {featured_image && (
          <div className="mx-auto mt-8 max-w-4xl md:mt-10">
            <FeaturedMedia
              className="overflow-hidden rounded-lg border border-[#006181]/10 shadow-sm dark:border-white/10"
              src={featured_image}
              srcSet={srcSet ?? undefined}
              alt={title}
              priority
            />
          </div>
        )}

        <div className="post-body mx-auto mt-10 max-w-7xl md:mt-12">
          <div
            className={
              hasRelated
                ? 'grid gap-10 lg:grid-cols-12 lg:gap-12'
                : 'mx-auto max-w-3xl'
            }
          >
            <div
              className={
                hasRelated
                  ? 'post-content max-w-[65ch] lg:col-span-8 lg:max-w-none'
                  : 'post-content'
              }
            >
              <div className="post-content prose-base text-secondary-foreground text-[1.05rem] leading-[1.75] md:text-lg md:leading-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content ?? '',
                  }}
                />
              </div>
              <div className="sharethis-sticky-share-buttons"></div>
            </div>

            {hasRelated && (
              <aside className="w-full self-start lg:sticky lg:top-28 lg:col-span-4 lg:pt-1">
                <Glassbox className="sidebar_widget relative max-h-max overflow-y-auto border border-[#006181]/12 py-5 shadow-none dark:border-[#006181]/20">
                  <SimpleList
                    className="border-none px-5 md:px-6"
                    heading="Related Articles"
                  >
                    {relatedArticles.map(post => {
                      return (
                        <li className="group mb-5 last:mb-3" key={post.id}>
                          <Link
                            className="text-secondary-foreground no-underline group-hover:text-[#006181] dark:group-hover:text-[#4da3c0]"
                            href={`/trade-insight/${volume.volume}/${post.slug}`}
                          >
                            <p className="font-serif text-sm leading-snug font-medium tracking-tight md:text-[0.95rem]">
                              {post.title}
                            </p>
                          </Link>
                          <p className="text-muted-foreground mt-1.5 text-xs">
                            {formatDate(post.published_at)}
                          </p>
                        </li>
                      );
                    })}
                  </SimpleList>
                </Glassbox>
              </aside>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
