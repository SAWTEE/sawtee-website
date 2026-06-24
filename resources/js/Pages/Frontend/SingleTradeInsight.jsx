import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import { TableOfContents } from '@/components/Frontend/TableOfContents';
import MainLayout from '@/components/Layouts/MainLayout';
import PageLayout from '@/components/Layouts/PageLayout';
import { Button } from '@/components/ui/button';

export default function SingleTradeInsight({
  tradeInsightVolume,
  media,
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
            <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center lg:gap-4">
              <img
                className="aspect-auto w-full max-w-[300px] rounded-sm object-cover md:w-[30%] md:rounded-t-lg"
                src={media}
                alt={tradeInsightVolume.volume}
              />

              <div className="md:w-[70 %] flex w-full flex-col gap-4 rounded-md md:p-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white md:text-3xl">
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
                    href={`/publications/${tradeInsightVolume.file?.name}`}
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
              <div className="max-w-[60ch] lg:col-span-8">
                <div className="pt-10">
                  <h3 className="my-3 text-2xl font-bold capitalize text-slate-800 dark:text-slate-300 md:text-3xl lg:my-5 xl:text-4xl">
                    Contents
                  </h3>
                  <TableOfContents
                    articles={tradeInsightVolume.articles}
                    volumeSlug={tradeInsightVolume.volume_slug}
                  />
                </div>
              </div>
            </div>
            <aside className="sidebar flex flex-col items-center gap-12 md:col-span-2"></aside>
          </div>
        </Section>
      </PageLayout>
    </MainLayout>
  );
}
