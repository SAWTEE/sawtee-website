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

export default function Category({
  category,
  posts,
  infocus,
  sawteeInMedia,
  events,
  featured_image,
  srcSet,
  showSubscriptionBox = true,
}) {
  const isInFocus = category.slug.includes('infocus');
  const isMedia = category.slug.includes('sawtee-in-media');
  const isResearch = category.slug.includes('research');
  const isEvents = category.slug.includes('featured-events');

  // Helper function to render the appropriate archive component
  const renderArchiveComponent = () => {
    switch (true) {
      case category.slug.includes('covid'):
        return <CovidArchive posts={posts.data} />;
      case category.slug.includes('ldc'):
        return <LDCArchive posts={posts.data} />;
      case category.slug.includes('research'):
        return <ResearchArchive posts={posts} />;
      case category.slug.includes('newsletters'):
        return <NewsletterArchive posts={posts.data} />;
      case category.slug.includes('featured-events'):
        return <EventsArchive posts={posts.data} />;
      default:
        return <DefaultArchive posts={posts.data} category={category} />;
    }
  };

  // Helper function to render sidebar widgets
  const renderSidebarWidgets = () => {
    return (
      <div className="flex flex-col gap-12">
        {showSubscriptionBox && (
          <Glassbox className={'w-full p-0'}>
            <SubscriptionCard />
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
    );
  };

  return (
    <MainLayout>
      <WebsiteHead
        title={category.meta_title ? category.meta_title : category.name}
        description={category.meta_description ?? ''}
        image={
          featured_image
            ? featured_image.original_url
            : '/assets/logo-sawtee.webp'
        }
      ></WebsiteHead>
      <PageLayout
        featured_image={featured_image}
        srcSet={srcSet}
        title={category.name}
      >
        <div className="grid grid-cols-1 gap-12 px-0 py-8 md:grid-cols-2 md:px-4 md:py-20 lg:grid-cols-6">
          <section className="archive-list col-span-1 lg:col-span-4">
            <div>
              {renderArchiveComponent()}
              <div className="w-full p-8">
                {!isResearch && (
                  <Pagination
                    links={posts.links}
                    currentPage={posts.current_page}
                    totalPages={posts.last_page}
                    nextPage={posts.next_page_url}
                    prevPage={posts.prev_page_url}
                    className={'mt-8'}
                  />
                )}
              </div>
            </div>
          </section>
          <aside className="sidebar col-span-1 lg:col-span-2">
            {renderSidebarWidgets()}
          </aside>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
