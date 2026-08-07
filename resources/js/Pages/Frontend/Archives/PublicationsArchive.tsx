import { Link } from '@inertiajs/react';
import { mainWithPageLayout } from '@/lib/page-layouts';

import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type {
  Category,
  FrontendPublicationsArchiveProps,
  Publication,
  PublicationsBySlug,
} from '@/types';

function PublicationsArchive({
  category,
  infocus = null,
  sawteeInMedia = null,
  publications = null,
  showSubscriptionBox = true,
  featured_image = null,
  srcSet = null,
  seo,
}: FrontendPublicationsArchiveProps) {
  const image =
    typeof featured_image === 'string' && featured_image !== ''
      ? featured_image
      : '/assets/logo-sawtee.webp';

  return (
    <>
      <WebsiteHead
        title={
          seo?.title ??
          (category.meta_title ? category.meta_title : category.name)
        }
        description={seo?.description ?? category.meta_description ?? undefined}
        image={seo?.image ?? image}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
      <Section className={'mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20'}>
        <div className="grid place-content-center gap-10 md:grid-cols-4 xl:grid-cols-6">
          <section className="archive-list md:col-span-2 xl:col-span-4">
            <ItemsList
              items={category.children ?? []}
              publications={publications}
            />
          </section>

          <aside className="sidebar flex flex-col items-center gap-12 md:col-span-2">
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
                link={'/category/in-focus'}
              />
            )}

            {showSubscriptionBox && (
              <Glassbox className={'w-full p-0'}>
                <SubscriptionCard />
              </Glassbox>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}

type ItemComponentProps = {
  item: Category;
  publications?: PublicationsBySlug | null;
  isTradeInsightCategory?: boolean;
  className?: string;
};

const publicationHref = (
  publication: Publication,
  item: Category,
  isTradeInsightCategory: boolean
) => {
  if (isTradeInsightCategory && publication.volume_slug) {
    return `/category/publications/${item.slug}/${publication.volume_slug}`;
  }

  return publication.file ? `/publications/${publication.file.name}` : '#';
};

const ItemComponent = ({
  item,
  publications = null,
  isTradeInsightCategory = false,
  className = '',
}: ItemComponentProps) => {
  const pubs = publications?.[item.slug] ?? [];
  const nestedChildren = item.children ?? [];

  return (
    <div className={cn('w-full', className)}>
      <h3 className="pb-8 text-2xl lg:text-3xl" id={item.name}>
        <Link
          className="underline"
          title={`Explore ${item.name}`}
          href={`/category/publications/${item.slug}`}
        >
          {item.name}
        </Link>
      </h3>
      {pubs.length > 0 && (
        <div className="grid grid-cols-4 gap-6">
          {pubs.map((publication: Publication) => (
            <div key={publication.id}>
              <article className="article mx-auto max-w-[140px] overflow-hidden rounded-md">
                <a
                  href={publicationHref(
                    publication,
                    item,
                    isTradeInsightCategory
                  )}
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
              </article>
              {publication.title && (
                <a
                  className="underline"
                  target="_blank"
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
          ))}
        </div>
      )}
      {nestedChildren.length > 0 && (
        <ItemsList
          items={nestedChildren}
          publications={publications}
          className="ml-4 pt-0"
        />
      )}
    </div>
  );
};

type ItemsListProps = {
  items: Category[];
  publications?: PublicationsBySlug | null;
  className?: string;
};

/** Depth-first render of a category subtree (children and grandchildren). */
const ItemsList = ({
  items,
  publications = null,
  className = '',
}: ItemsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isTradeInsightCategory = item.slug === 'trade-insight';
        return (
          <div key={item.id}>
            <ItemComponent
              className={className}
              item={item}
              publications={publications}
              isTradeInsightCategory={isTradeInsightCategory}
            />
            {i < items.length - 1 && (
              <Separator className="border-bgDarker my-12 h-0 border-t-4 bg-transparent" />
            )}
          </div>
        );
      })}
    </div>
  );
};

PublicationsArchive.layout = mainWithPageLayout(props => ({
  title: props.category.name,
  featured_image:
    typeof props.featured_image === 'string' ? props.featured_image : null,
  srcSet: props.srcSet,
}));

export default PublicationsArchive;
