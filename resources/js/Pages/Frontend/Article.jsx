import WebsiteHead from '@/components/Frontend/Head';
import MainLayout from '@/components/Layouts/MainLayout';
import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostMeta from '@/components/Frontend/post/post-meta';
import readingDuration from 'reading-duration';
import { formatDate } from '@/lib/helpers';

import { Link } from '@inertiajs/react';
import {Button} from '@/components/ui/Button';
import Glassbox from '@/components/Frontend/Glassbox';
import SimpleList from '@/components/Frontend/SimpleList';

export default function Article({
  article,
  volume,
  featured_image,
  srcSet,
  relatedArticles,
}) {
  const readingTime = article.content
    ? readingDuration(article.content, {
        emoji: false,
        wordsPerMinute: 225,
      })
    : null;
  const { title,subtitle, content } = article;
  return (
    <MainLayout>
      <WebsiteHead
        title={`${volume.volume}`}
        description={article.meta_description}
        image={featured_image ? featured_image : '/assets/logo-sawtee.webp'}
      />

      <div className="relative w-full px-10 py-10 lg:px-20">
        <div className="mx-auto mt-5 max-w-5xl">
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
          <h1 className="captialize my-3 text-2xl font-bold text-slate-800 dark:text-slate-300 md:text-3xl lg:my-5 xl:text-5xl">
            {title}
          </h1>
              {subtitle && <Text>{subtitle}</Text>}

          {featured_image && (
            <FeaturedMedia
              className={'rounded-xl'}
              src={featured_image}
              srcSet={srcSet}
            />
          )}
        </div>

        <div className="w-full">
          <div className="post-body mx-auto grid max-w-7xl gap-6 pt-10 leading-8 lg:grid-cols-12">
            <div className="post-content max-w-[60ch] text-lg lg:col-span-8 lg:ml-14">
              <PostMeta
                className="py-2"
                author={article.author}
                date={article.published_at}
                readingTime={readingTime}
                tags={article.tags}
              />
              <div className="post-content prose-base text-lg text-secondary-foreground">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
              <div className="sharethis-sticky-share-buttons"></div>
            </div>
            <aside className="sticky top-32 h-full w-full lg:col-span-4">
              <Glassbox className="sidebar_widget relative max-h-max overflow-y-auto border-none shadow-none">
                <SimpleList
                  className={'border-none px-8'}
                  heading={'Related Articles'}
                >
                  {relatedArticles?.map(post => {
                    return (
                      <li className="group mb-4" key={post.id}>
                        <Link
                          className="text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80"
                          href={`/trade-insight/${volume.volume}/${post.slug}`}
                        >
                          <p className="lg:text-md text-sm leading-5">
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
