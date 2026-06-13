import WebsiteHead from '@/components/Frontend/Head';
import MainLayout from '@/components/Layouts/MainLayout';
import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostMeta from '@/components/Frontend/post/post-meta';
import { formatDate } from '@/lib/helpers';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Glassbox from '@/components/Frontend/Glassbox';
import SimpleList from '@/components/Frontend/SimpleList';
import { useMemo } from 'react';

// Custom reading time calculator
const calculateReadingTime = (content, options = {}) => {
  if (!content) return null;

  const { wordsPerMinute = 225, emoji = false } = options;

  // Remove HTML tags and get clean text
  const cleanText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (!cleanText) return null;

  // Count words
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
  featured_image,
  srcSet,
  relatedArticles,
}) {
  // Use useMemo to calculate reading time efficiently
  const readingTime = useMemo(() => {
    if (!article.content) return null;

    return calculateReadingTime(article.content, {
      emoji: false,
      wordsPerMinute: 225,
    });
  }, [article.content]);

  const { title, subtitle, content } = article;
  return (
    <MainLayout>
      <WebsiteHead
        title={`${volume.volume}`}
        description={article.meta_description}
        image={featured_image ? featured_image : '/assets/logo-sawtee.webp'}
      />

      <div className="relative w-full px-10 py-10 lg:px-20">
        <div className="max-w-5xl mx-auto mt-5">
          <div
            className={'post-categories flex flex-wrap justify-center gap-4'}
          >
            <Link href={`/trade-insight/${volume.slug}`}>
              <Button
                className={
                  'category rounded-md px-3 py-1 text-sm font-semibold'
                }
              >
                {volume.volume}
              </Button>
            </Link>
          </div>
          <h1 className="my-3 text-2xl font-bold captialize text-slate-800 dark:text-slate-300 md:text-3xl lg:my-5 xl:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}

          {featured_image && (
            <FeaturedMedia
              className={'rounded-xl'}
              src={featured_image}
              srcSet={srcSet}
            />
          )}
        </div>

        <div className="w-full">
          <div className="grid gap-6 pt-10 mx-auto leading-8 post-body max-w-7xl lg:grid-cols-12">
            <div className="post-content max-w-[60ch] text-lg lg:col-span-8 lg:ml-14">
              <PostMeta
                className="py-2"
                author={article.author}
                date={article.published_at}
                readingTime={readingTime}
                tags={article.tags}
              />
              <div className="text-lg post-content prose-base text-secondary-foreground">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
              <div className="sharethis-sticky-share-buttons"></div>
            </div>
            <aside className="sticky w-full h-full top-32 lg:col-span-4">
              <Glassbox className="relative overflow-y-auto border-none shadow-none sidebar_widget max-h-max">
                <SimpleList
                  className={'border-none px-8'}
                  heading={'Related Articles'}
                >
                  {relatedArticles?.map(post => {
                    return (
                      <li className="mb-4 group" key={post.id}>
                        <Link
                          className="underline text-secondary-foreground underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80"
                          href={`/trade-insight/${volume.volume}/${post.slug}`}
                        >
                          <p className="text-sm leading-5 lg:text-md">
                            {post.title}
                          </p>
                        </Link>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatDate(post.published_at)}
                        </p>
                      </li>
                    );
                  })}
                  {/* <ExploreButton
          text={`More articles`}
          link={link ?? `${array[0].category.slug / array[0].slug}`}
          className="p-0"
        /> */}
                </SimpleList>
              </Glassbox>
            </aside>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
