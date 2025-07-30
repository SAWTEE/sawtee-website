import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import MainLayout from '../../components/Layouts/MainLayout';
import PageLayout from '../../components/Layouts/PageLayout';
import CovidArchive from './Archives/CovidArchive';
import DefaultArchive from './Archives/DefaultArchive';
import EventsArchive from './Archives/EventsArchive';
import NewsletterArchive from './Archives/NewsletterArchive';
import ResearchArchive from './Archives/ResearchArchive';

export default function Category({
  category,
  posts,
  infocus,
  sawteeInMedia,
  events,
  showSubscriptionBox = true,
  featured_image,
  srcSet,
}) {
  const isEvent = category.slug.includes('featured-events');
  const isInFocus = category.slug.includes('infocus');
  const isMedia = category.slug.includes('sawtee-in-media');
  const isNewsletter = category.slug.includes('newsletters');
  const isCovid = category.slug.includes('covid');
  const isResearch = category.slug.includes('research');
  const isDefault = !isNewsletter && !isResearch && !isCovid && !isEvent;

  return (
    <MainLayout>
      <WebsiteHead
        title={category.meta_title ? category.meta_title : category.name}
        description={category.meta_description}
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
        <div className="mx-auto grid gap-12 px-8 py-8 md:grid-cols-2 md:px-10 md:py-20 lg:grid-cols-6">
          <section className="archive-list col-span-1 flex flex-col items-center gap-12 lg:col-span-4">
            <div>
              {isDefault && <DefaultArchive posts={posts.data} />}
              {isCovid && <CovidArchive posts={posts.data} />}

              {isResearch && <ResearchArchive posts={posts} />}
              {isNewsletter && <NewsletterArchive posts={posts.data} />}

              {isEvent && <EventsArchive posts={posts.data} />}

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
              {isInFocus && events && (
                <SidebarWidget
                  array={events}
                  title={'Featured Events'}
                  link={'/category/featured-events'}
                />
              )}
              {isMedia && events && (
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
