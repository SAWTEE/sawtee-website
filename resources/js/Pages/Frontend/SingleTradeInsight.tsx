import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import { TableOfContents } from '@/components/Frontend/TableOfContents';
import { Button } from '@/components/ui/button';
import { mainWithPageLayout } from '@/lib/page-layouts';
import type { FrontendTradeInsightProps } from '@/types';

function SingleTradeInsight({
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
    <>
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
      <Section className="mx-auto max-w-full px-5 py-12 md:px-10 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-12">
            {hasCover && (
              <div className="mx-auto w-full max-w-[220px] shrink-0 md:mx-0 md:max-w-[240px]">
                <img
                  className="border-theme-600/10 aspect-3/4 w-full rounded-lg border object-cover shadow-sm dark:border-white/10"
                  src={media ?? undefined}
                  alt={volumeLabel ?? ''}
                />
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-4 md:pt-1">
              <p className="text-theme-600 dark:text-theme-450 text-xs font-medium tracking-wide uppercase">
                Trade Insight
              </p>
              <h2 className="text-primary dark:text-foreground font-serif text-2xl font-semibold tracking-tight capitalize md:text-3xl xl:text-4xl">
                {subtitle ? subtitle : volumeLabel}
              </h2>
              {subtitle && volumeLabel && subtitle !== volumeLabel && (
                <p className="text-muted-foreground text-sm md:text-base">
                  {volumeLabel}
                </p>
              )}

              {tradeInsightVolume.description && (
                <div
                  className="prose-base text-secondary-foreground/90 text-lead dark:text-muted-foreground max-w-prose leading-relaxed md:text-lg md:leading-8"
                  dangerouslySetInnerHTML={{
                    __html: tradeInsightVolume.description,
                  }}
                />
              )}

              {pdfHref && (
                <div className="border-theme-600/12 dark:border-theme-600/20 mt-2 border-t pt-5">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-theme-600/25 text-theme-600 hover:bg-theme-600/8 hover:text-theme-600 dark:border-theme-600/40 dark:text-theme-450 dark:hover:bg-theme-600/15"
                  >
                    <a href={pdfHref} target="_blank" rel="noopener noreferrer">
                      {`Download PDF: ${volumeLabel}`}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <section
            className="border-theme-600/15 dark:border-theme-600/25 mt-14 border-t pt-10 md:mt-16 md:pt-12"
            aria-labelledby="trade-insight-contents"
          >
            <h3
              id="trade-insight-contents"
              className="text-primary dark:text-foreground font-serif text-2xl font-semibold tracking-tight md:text-3xl"
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
    </>
  );
}

SingleTradeInsight.layout = mainWithPageLayout(props => ({
  title: props.tradeInsightVolume.volume ?? props.tradeInsightVolume.title,
  featured_image: null,
}));

export default SingleTradeInsight;
