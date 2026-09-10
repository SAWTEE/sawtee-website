import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import { mainWithPageLayout } from '@/lib/page-layouts';
import { cn } from '@/lib/utils';
import type { FrontendPublicationCategoryProps, Publication } from '@/types';

function PublicationCategory({
  category,
  publications,
  infocus = null,
  sawteeInMedia = null,
  featured_image = null,
  showSubscriptionBox = true,
  srcSet: _srcSet = null,
  seo,
}: FrontendPublicationCategoryProps) {
  const image =
    typeof featured_image === 'string' && featured_image !== ''
      ? featured_image
      : '/assets/logo-sawtee.webp';
  const isTradeInsight = category.slug === 'trade-insight';

  return (
    <>
      <WebsiteHead
        title={seo?.title ?? (category.meta_title || category.name)}
        description={seo?.description ?? category.meta_description ?? undefined}
        image={seo?.image ?? image}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
      <Section className="mx-auto max-w-full px-4 py-6 sm:px-6 md:py-10 lg:px-12 lg:py-16 xl:px-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <section className="archive-list min-w-0 lg:col-span-8">
            <div
              className="grid grid-cols-1 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              data-testid="publication-grid"
            >
              {publications?.data?.map(publication => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  categorySlug={category.slug}
                  isTradeInsight={isTradeInsight}
                />
              ))}
            </div>
            <Pagination
              className="mt-10 sm:mt-12"
              links={publications.links}
              currentPage={publications.current_page}
              totalPages={publications.last_page}
              nextPage={publications.next_page_url}
              prevPage={publications.prev_page_url}
            />
          </section>

          <aside className="sidebar sticky top-32 flex w-full min-w-0 flex-col items-center gap-8 self-start sm:gap-10 lg:top-32 lg:col-span-4 lg:gap-12">
            {sawteeInMedia && (
              <SidebarWidget
                array={sawteeInMedia}
                title="SAWTEE in Media"
                link="/category/sawtee-in-media"
              />
            )}
            {infocus && (
              <SidebarWidget
                array={infocus}
                title="Infocus"
                link="/category/in-focus"
              />
            )}
            {showSubscriptionBox && (
              <Glassbox className="w-full p-0">
                <SubscriptionCard />
              </Glassbox>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}

function PublicationCard({
  publication,
  categorySlug,
  isTradeInsight,
}: {
  publication: Publication;
  categorySlug: string;
  isTradeInsight: boolean;
}) {
  const cover =
    publication.media?.[0]?.original_url ||
    '/assets/SM-placeholder-150x150.webp';
  const fileHref = publication.file
    ? `/publications/${publication.file.name}`
    : '#';
  const coverHref = isTradeInsight
    ? publication.volume_slug
      ? `/category/publications/${categorySlug}/${publication.volume_slug}`
      : fileHref
    : fileHref;

  return (
    <div className="flex flex-col items-center text-center">
      <article className="w-full max-w-56 overflow-hidden rounded-md sm:max-w-60 md:max-w-64">
        <a
          title={publication.title}
          href={coverHref}
          className="group relative block"
          {...(isTradeInsight
            ? { referrerPolicy: 'no-referrer' as const }
            : {
                target: '_blank' as const,
                referrerPolicy: 'no-referrer' as const,
                rel: 'noopener noreferrer',
              })}
        >
          <div className="absolute inset-0 bg-black/10 bg-blend-overlay transition-colors group-hover:bg-transparent" />
          <img
            className="aspect-3/4 h-full w-full rounded-md object-cover"
            src={cover}
            alt={publication.title}
            title={publication.title}
            loading="lazy"
            width={256}
            height={341}
          />
        </a>
      </article>

      {publication.title ? (
        <a
          className={cn(
            'mt-4 block max-w-56 underline decoration-transparent underline-offset-2 transition-colors sm:max-w-60 md:max-w-64',
            'hover:text-[#006181] hover:decoration-[#006181]/50 dark:hover:text-[#4da3c0] dark:hover:decoration-[#4da3c0]/50'
          )}
          href={fileHref}
          target="_blank"
          referrerPolicy="no-referrer"
          rel="noopener noreferrer"
        >
          <p className="text-secondary-foreground text-sm leading-snug font-semibold sm:text-[0.9375rem]">
            {publication.title}
          </p>
          {publication.subtitle ? (
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {publication.subtitle}
            </p>
          ) : null}
        </a>
      ) : null}
    </div>
  );
}

PublicationCategory.layout = mainWithPageLayout(props => ({
  title: props.category.name,
  featured_image:
    typeof props.featured_image === 'string' ? props.featured_image : null,
  srcSet: props.srcSet,
}));

export default PublicationCategory;
