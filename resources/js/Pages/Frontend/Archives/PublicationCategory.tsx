import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import type { FrontendPublicationCategoryProps } from '@/types';
import { mainWithPageLayout } from '@/lib/page-layouts';

function PublicationCategory({
  category,
  publications,
  infocus = null,
  sawteeInMedia = null,
  featured_image = null,
  showSubscriptionBox = true,
  srcSet = null,
  seo,
}: FrontendPublicationCategoryProps) {
  const image =
    typeof featured_image === 'string' && featured_image !== ''
      ? featured_image
      : '/assets/logo-sawtee.webp';

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
      <Section className={'mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20'}>
        <div className="grid place-content-center gap-10 md:grid-cols-4 xl:grid-cols-6">
          <section className="archive-list md:col-span-2 xl:col-span-4">
            <div>
              <div className="grid grid-cols-4 gap-6 gap-y-20">
                {publications?.data?.map(publication => {
                  return (
                    <div key={publication.id}>
                      <article className="article mx-auto max-w-[140px] overflow-hidden rounded-md">
                        {category.slug === 'trade-insight' ? (
                          <a
                            title={publication.title}
                            href={
                              publication.volume_slug
                                ? `/category/publications/${category?.slug}/${publication.volume_slug}`
                                : `/publications/${publication.file?.name}`
                            }
                            className="group relative"
                            referrerPolicy="no-referrer"
                          >
                            <div className="absolute top-0 left-0 h-full w-full bg-black/10 bg-blend-overlay group-hover:bg-transparent" />
                            <img
                              className="aspect-3/4 h-full w-full rounded-md object-cover"
                              src={
                                `${publication.media?.[0]?.original_url ?? ''}` ||
                                '/assets/SM-placeholder-150x150.png'
                              }
                              alt={publication.title}
                              title={publication.title}
                              loading="lazy"
                            />
                          </a>
                        ) : (
                          <a
                            title={publication.title}
                            href={
                              publication.file
                                ? `/publications/${publication.file?.name}`
                                : '#'
                            }
                            className="group relative"
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noopener noreferrer"
                          >
                            <div className="absolute top-0 left-0 h-full w-full bg-black/10 bg-blend-overlay group-hover:bg-transparent" />
                            <img
                              className="aspect-3/4 h-full w-full rounded-md object-cover"
                              src={
                                `${publication.media?.[0]?.original_url ?? ''}` ||
                                '/assets/SM-placeholder-150x150.png'
                              }
                              alt={publication.title}
                              title={publication.title}
                              loading="lazy"
                            />
                          </a>
                        )}
                      </article>
                      {publication.title && (
                        <a
                          className="underline"
                          target="_blank"
                          referrerPolicy="no-referrer"
                          href={`/publications/${publication.file?.name}`}
                          rel="noopener noreferrer"
                        >
                          <p className="mt-4 text-center text-sm font-semibold">
                            {publication.title}
                          </p>
                          {publication.subtitle && (
                            <p className="mt-1 text-center text-xs">
                              {publication.subtitle}
                            </p>
                          )}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
              <Pagination
                className="mt-12"
                links={publications.links}
                currentPage={publications.current_page}
                totalPages={publications.last_page}
                nextPage={publications.next_page_url}
                prevPage={publications.prev_page_url}
              />
            </div>
          </section>

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
    </>
  );
}

PublicationCategory.layout = mainWithPageLayout(props => ({
  title: props.category.name,
  featured_image:
    typeof props.featured_image === 'string' ? props.featured_image : null,
  srcSet: props.srcSet,
}));

export default PublicationCategory;
