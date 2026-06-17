import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import { TableOfContents } from '@/components/Frontend/TableOfContents';
import MainLayout from '@/components/Layouts/MainLayout';
import PageLayout from '@/components/Layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import ExploreButton from '@/components/Frontend/ExploreButton';
import SimpleList from '@/components/Frontend/SimpleList';

export default function SingleTradeInsight({
  tradeInsightVolume,
  media,
  tradeInsights,
  showSubscriptionBox = true,
}) {
  return (
    <MainLayout>
      <WebsiteHead
        title={tradeInsightVolume.volume}
        description={tradeInsightVolume.meta_description}
        image={'/assets/logo-sawtee.webp'}
      />
      <PageLayout title={tradeInsightVolume.volume} featured_image={null}>
        <Section className={'mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20'}>
          <div className="">
            <div class="flex flex-col justify-center gap-4 md:flex-row md:items-center lg:gap-4">
              <img
                class="aspect-auto w-full max-w-[300px] rounded-sm object-cover md:w-[30%] md:rounded-t-lg"
                src={media}
                alt={tradeInsightVolume.volume}
              />

              <div class="md:w-[70 %] flex w-full flex-col gap-4 rounded-md md:p-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white md:text-3xl">
                  {tradeInsightVolume.subtitle
                    ? tradeInsightVolume.subtitle
                    : tradeInsightVolume.volume}
                </h2>

                <div
                  className="text-md md:text-md prose-base text-secondary-foreground lg:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: tradeInsightVolume.description,
                  }}
                />
                <div className="mt-4 flex gap-4">
                  <a
                    href={tradeInsightVolume.full_article_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="outline" size="lg">
                      Read PDF
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="grid place-content-center gap-10 md:grid-cols-4 xl:grid-cols-6">
            <div className="md:col-span-2 xl:col-span-4">
              <div className="max-w-[60ch] text-lg lg:col-span-8">
                <div className="pt-10">
                  <h3 className="my-3 text-xl font-bold capitalize text-slate-800 dark:text-slate-300 md:text-2xl lg:my-5 xl:text-3xl">
                    Contents
                  </h3>
                  <TableOfContents
                    articles={tradeInsightVolume.articles}
                    volumeSlug={tradeInsightVolume.slug}
                  />
                </div>
              </div>
            </div>
            <aside className="sidebar flex flex-col items-center gap-12 md:col-span-2">
              {showSubscriptionBox && (
                <Glassbox className={'w-full p-0'}>
                  <SubscriptionCard />
                </Glassbox>
              )}
              {tradeInsights && tradeInsights.length > 0 && (
                <Glassbox className="sidebar_widget relative max-h-max overflow-y-auto border-none shadow-none">
                  <SimpleList
                    className={'border-none px-8'}
                    heading={'Recent Trade Insights'}
                  >
                    {tradeInsights?.map(post => {
                      return (
                        <li className="group mb-4" key={post.id}>
                          <Link
                            className="text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80"
                            href={
                              post.volume_slug
                                ? `/category/${post.category?.slug}/${post.volume_slug}`
                                : `/publications/${post.file?.name}`
                            }
                          >
                            <p className="lg:text-md text-sm leading-5">
                              {post.title}
                            </p>
                          </Link>
                          {post.volume && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {formatDate(post.volume)}
                            </p>
                          )}
                        </li>
                      );
                    })}
                    <ExploreButton
                      text={`More Trade Insights`}
                      link={
                        '/category/publications/trade-insight' ??
                        `${array[0].category?.slug / array[0].slug}`
                      }
                      className="p-0"
                    />
                  </SimpleList>
                </Glassbox>
              )}
            </aside>
          </div>
        </Section>
      </PageLayout>
    </MainLayout>
  );
}
