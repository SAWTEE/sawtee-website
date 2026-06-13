import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import { TableOfContents } from '@/components/Frontend/TableOfContents';
import MainLayout from '@/components/Layouts/MainLayout';
import PageLayout from '@/components/Layouts/PageLayout';
import { Button } from '@/components/ui/button';

export default function SingleTradeInsight({
  tradeInsightVolume,
  media,
  infocus,
  sawteeInMedia,
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
          <div className="grid gap-10 place-content-center md:grid-cols-4 xl:grid-cols-6">
            <div className="md:col-span-2 xl:col-span-4">
              <div className="mt-5 lg:mt-10">
                <div class="flex flex-col justify-center gap-4 pt-4 md:flex-row md:items-center lg:items-stretch lg:gap-4">
                  <img
                    class="w-full max-w-[300px] rounded-sm object-cover md:w-[20%] md:rounded-t-lg"
                    src={media}
                    alt={tradeInsightVolume.volume}
                  />

                  <div class="flex w-full flex-col gap-4 rounded-md md:w-[80%] md:p-4">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white md:text-3xl">
                      {'Trade Insight' + ' ' + tradeInsightVolume.volume}
                    </h2>

                    <div
                      className="text-lg prose-base text-secondary-foreground md:text-lg lg:text-xl"
                      dangerouslySetInnerHTML={{
                        __html: tradeInsightVolume.content,
                      }}
                    />
                    <div className="flex gap-4 mt-4">
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
            <aside className="flex flex-col items-center gap-12 sidebar md:col-span-2">
              {showSubscriptionBox && (
                <Glassbox className={'w-full p-0'}>
                  <SubscriptionCard />
                </Glassbox>
              )}
              {sawteeInMedia && (
                <SidebarWidget
                  array={sawteeInMedia}
                  title={'SAWTEE in Media'}
                  link={'/category/sawtee-in-media'}
                />
              )}
              {infocus && (
                <SidebarWidget
                  array={infocus}
                  title={'Infocus'}
                  link={'/category/infocus'}
                />
              )}
            </aside>
          </div>
        </Section>
      </PageLayout>
    </MainLayout>
  );
}
