import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import MainLayout from '@/components/Layouts/MainLayout';
import PageLayout from '@/components/Layouts/PageLayout';

export default function TradeInsights({
  tradeInsightVolume,
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
        <div className="mx-auto mt-5 max-w-5xl">
          <h1 className="captialize my-3 text-2xl font-bold text-slate-800 dark:text-slate-300 md:text-3xl lg:my-5 xl:text-5xl">
            {tradeInsightVolume.title}
          </h1>
          <h3 className="captialize my-3 text-xl font-bold text-slate-800 dark:text-slate-300 md:text-3xl lg:my-5 xl:text-3xl">
            {tradeInsightVolume.subtitle}
          </h3>
        </div>
        <Section className={'mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20'}>
          <div className="grid place-content-center gap-10 md:grid-cols-4 xl:grid-cols-6">
            <div className="md:col-span-2 xl:col-span-4">
              <div className="post-content max-w-[60ch] text-lg lg:col-span-8 lg:ml-14">
                <div
                  className="prose-base text-lg text-secondary-foreground"
                  dangerouslySetInnerHTML={{
                    __html: tradeInsightVolume.content,
                  }}
                />
                <div className="sharethis-sticky-share-buttons"></div>
              </div>
            </div>
            <aside className="sidebar flex flex-col items-center gap-12 md:col-span-2">
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
