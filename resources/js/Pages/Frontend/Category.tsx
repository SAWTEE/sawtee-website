import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import MainLayout from '../../components/Layouts/MainLayout';
import PageLayout from '../../components/Layouts/PageLayout';
import CovidArchive from './Archives/CovidArchive';
import DefaultArchive from './Archives/DefaultArchive';
import LDCArchive from './Archives/LDCArchive';
import EventsArchive from './Archives/EventsArchive';
import NewsletterArchive from './Archives/NewsletterArchive';
import ResearchArchive from './Archives/ResearchArchive';
import type { FrontendCategoryProps } from '@/types';
import type { ComponentType, ReactNode } from 'react';

const CovidArchiveView = CovidArchive as ComponentType<{ posts?: unknown }>;
const LDCArchiveView = LDCArchive as ComponentType<{ posts?: unknown }>;
const ResearchArchiveView = ResearchArchive as ComponentType<{ posts?: unknown }>;
const NewsletterArchiveView = NewsletterArchive as ComponentType<{ posts?: unknown }>;
const EventsArchiveView = EventsArchive as ComponentType<{ posts?: unknown }>;
const DefaultArchiveView = DefaultArchive as ComponentType<{ posts?: unknown; category?: unknown }>;
const SubscriptionCardView = SubscriptionCard as ComponentType<any>;

type Props = FrontendCategoryProps & { showSubscriptionBox?: boolean };

export default function Category({
  category,
  posts,
  infocus,
  sawteeInMedia,
  events,
  featured_image,
  srcSet,
  seo,
  showSubscriptionBox = true,
}: Props) {
  const isInFocus = category.slug.includes('infocus') || category.slug.includes('in-focus');
  const isMedia = category.slug.includes('sawtee-in-media');
  const isEvents = category.slug.includes('featured-events');
  const paginated =
    posts && typeof posts === 'object' && posts !== null && 'data' in (posts as object)
      ? (posts as { data: unknown; links: any; current_page: number; last_page: number; next_page_url?: string | null; prev_page_url?: string | null })
      : null;

  const renderArchiveComponent = (): ReactNode => {
    switch (true) {
      case category.slug.includes('covid'):
        return <CovidArchiveView posts={paginated?.data} />;
      case category.slug.includes('ldc'):
        return <LDCArchiveView posts={paginated?.data} />;
      case category.slug.includes('research'):
        return <ResearchArchiveView posts={posts} />;
      case category.slug.includes('newsletters'):
        return <NewsletterArchiveView posts={paginated?.data} />;
      case category.slug.includes('featured-events'):
        return <EventsArchiveView posts={paginated?.data} />;
      default:
        return <DefaultArchiveView posts={paginated?.data} category={category} />;
    }
  };

  const image =
    typeof featured_image === 'string'
      ? featured_image
      : (featured_image as { original_url?: string } | null | undefined)?.original_url;

  return (
    <MainLayout>
      <WebsiteHead
        title={seo?.title ?? (category.meta_title ? category.meta_title : category.name)}
        description={seo?.description ?? category.meta_description ?? ''}
        image={seo?.image ?? (image ? image : '/assets/logo-sawtee.webp')}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
      <PageLayout
        featured_image={image}
        srcSet={srcSet}
        title={category.name}
      >
        <div className="grid grid-cols-1 gap-12 px-0 py-8 md:grid-cols-2 md:px-4 md:py-20 lg:grid-cols-6">
          <section className="archive-list col-span-1 lg:col-span-4">
            <div className="flex w-full flex-col">
              {renderArchiveComponent()}
              {paginated && (
                <div className="w-full p-8">
                  <Pagination
                    links={paginated.links}
                    currentPage={paginated.current_page}
                    totalPages={paginated.last_page}
                    nextPage={paginated.next_page_url}
                    prevPage={paginated.prev_page_url}
                    className={'mt-8'}
                  />
                </div>
              )}
            </div>
          </section>
          <aside className="sidebar col-span-1 lg:col-span-2">
            <div className="flex flex-col gap-12">
              {showSubscriptionBox && (
                <Glassbox className={'w-full p-0'}>
                  <SubscriptionCardView />
                </Glassbox>
              )}
              {!isMedia && sawteeInMedia && (
                <SidebarWidget
                  array={sawteeInMedia}
                  title={'Sawtee in Media'}
                  link={'/category/sawtee-in-media'}
                />
              )}
              {!isEvents && events && (
                <SidebarWidget
                  array={events}
                  title={'Featured Events'}
                  link={'/category/featured-events'}
                />
              )}
              {!isInFocus && infocus && (
                <SidebarWidget
                  array={infocus}
                  link={'/category/in-focus'}
                  title={'In Focus'}
                />
              )}
            </div>
          </aside>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
