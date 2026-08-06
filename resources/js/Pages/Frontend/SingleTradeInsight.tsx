import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import { TableOfContents } from '@/components/Frontend/TableOfContents';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import PageLayout from '@/layouts/PageLayout';
import type { FrontendTradeInsightProps } from '@/types';

export default function SingleTradeInsight({
  tradeInsightVolume,
  media = null,
  seo,
}: FrontendTradeInsightProps) {
  const volumeLabel = tradeInsightVolume.volume ?? tradeInsightVolume.title;
  const subtitle = tradeInsightVolume.subtitle;
  const hasCover = Boolean(media);
  const pdfHref = tradeInsightVolume.file?.name
    ? `/publications/${tradeInsightVolume.file.name}`
    : null;

  return (
    <MainLayout>
      <WebsiteHead
        title={seo?.title ?? volumeLabel ?? ''}
        description={
          seo?.description ?? tradeInsightVolume.meta_description ?? undefined
        }
        image={seo?.image ?? media ?? '/assets/logo-sawtee.webp'}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
      <PageLayout title={volumeLabel} featured_image={null}>
        <Section className="mx-auto max-w-full px-5 py-12 md:px-10 md:py-16 lg:px-20 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-12">
              {hasCover && (
                <div className="mx-auto w-full max-w-[220px] shrink-0 md:mx-0 md:max-w-[240px]">
                  <img
                    className="aspect-3/4 w-full rounded-lg border border-[#006181]/10 object-cover shadow-sm dark:border-white/10"
                    src={media ?? undefined}
                    alt={volumeLabel ?? ''}
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-4 md:pt-1">
                <p className="text-xs font-medium tracking-wide text-[#006181] uppercase dark:text-[#4da3c0]">
                  Trade Insight
                </p>
                <h2 className="text-primary font-serif text-2xl font-semibold tracking-tight capitalize md:text-3xl xl:text-4xl dark:text-zinc-100">
                  {subtitle ? subtitle : volumeLabel}
                </h2>
                {subtitle && volumeLabel && subtitle !== volumeLabel && (
                  <p className="text-muted-foreground text-sm md:text-base">
                    {volumeLabel}
                  </p>
                )}

                {tradeInsightVolume.description && (
                  <div
                    className="prose-base text-secondary-foreground/90 max-w-prose text-[1.05rem] leading-relaxed md:text-lg md:leading-8 dark:text-zinc-300"
                    dangerouslySetInnerHTML={{
                      __html: tradeInsightVolume.description,
                    }}
                  />
                )}

                {pdfHref && (
                  <div className="mt-2 border-t border-[#006181]/12 pt-5 dark:border-[#006181]/20">
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="border-[#006181]/25 text-[#006181] hover:bg-[#006181]/8 hover:text-[#006181] dark:border-[#006181]/40 dark:text-[#4da3c0] dark:hover:bg-[#006181]/15"
                    >
                      <a
                        href={pdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`Download PDF: ${volumeLabel}`}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <section
              className="mt-14 border-t border-[#006181]/15 pt-10 md:mt-16 md:pt-12 dark:border-[#006181]/25"
              aria-labelledby="trade-insight-contents"
            >
              <h3
                id="trade-insight-contents"
                className="text-primary font-serif text-2xl font-semibold tracking-tight md:text-3xl dark:text-zinc-100"
              >
                Contents
                <span
                  className="from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500 mt-2 block h-1 w-14 bg-linear-to-l md:h-1.5 md:w-16"
                  aria-hidden
                />
              </h3>
              <div className="mt-2 max-w-3xl">
                <TableOfContents
                  articles={tradeInsightVolume.articles}
                  volumeSlug={tradeInsightVolume.volume_slug}
                />
              </div>
            </section>
          </div>
        </Section>
      </PageLayout>
    </MainLayout>
  );
}
