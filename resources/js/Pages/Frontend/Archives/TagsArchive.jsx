import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import MainLayout from '@/components/Layouts/MainLayout';
import PageLayout from '@/components/Layouts/PageLayout';
import DefaultArchive from '@/Pages/Frontend/Archives/DefaultArchive';

export default function TagsArchive({
  posts,
  tag,
  infocus,
  sawteeInMedia,
  events,
  showSubscriptionBox = true,
}) {
  return (
    <MainLayout>
      <WebsiteHead
        title={tag.meta_title ? tag.meta_title : tag.name}
        description={tag.meta_description}
        image={'/assets/logo-sawtee.webp'}
      ></WebsiteHead>
      <PageLayout featured_image={null} srcSet={null} title={tag.name}>
        <div className="mx-auto grid gap-12 px-8 py-8 md:grid-cols-2 md:px-10 md:py-20 lg:grid-cols-6">
          <section className="archive-list col-span-1 flex flex-col items-center gap-12 lg:col-span-4">
            <div>
              <DefaultArchive posts={posts.data} />

              <div className="w-full p-8">
                <Pagination
                  links={posts.links}
                  currentPage={posts.current_page}
                  totalPages={posts.last_page}
                  nextPage={posts.next_page_url}
                  prevPage={posts.prev_page_url}
                  className={'mt-8'}
                />
              </div>
            </div>
          </section>
          <aside className="sidebar col-span-1 lg:col-span-2">
            <div className="flex flex-col gap-12">
              {showSubscriptionBox && (
                <Glassbox className={'w-full p-4'}>
                  <SubscriptionCard />
                </Glassbox>
              )}

              {sawteeInMedia && (
                <SidebarWidget
                  array={sawteeInMedia}
                  title={'Sawtee in Media'}
                  link={'/category/sawtee-in-media'}
                />
              )}
              {events && (
                <SidebarWidget
                  array={events}
                  title={'Featured Events'}
                  link={'/category/featured-events'}
                />
              )}

              {infocus && (
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
