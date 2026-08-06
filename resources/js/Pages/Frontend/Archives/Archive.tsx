import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Pagination from '@/components/Frontend/Pagination';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import MainLayout from '@/layouts/MainLayout';
import PageLayout from '@/layouts/PageLayout';
import DefaultArchive from '@/Pages/Frontend/Archives/DefaultArchive';
import type { FrontendArchiveProps } from '@/types';

type Props = FrontendArchiveProps & { showSubscriptionBox?: boolean };

export default function Archive({
  posts,
  sawteeInMedia,
  meta_title,
  meta_description,
  layout_title,
  seo,
  showSubscriptionBox = true,
}: Props) {
  const paginated = posts && !Array.isArray(posts) ? posts : null;
  const postRows = paginated?.data ?? (Array.isArray(posts) ? posts : []);

  return (
    <MainLayout>
      <WebsiteHead
        title={seo?.title ?? meta_title}
        description={seo?.description ?? meta_description}
        image={seo?.image ?? '/assets/logo-sawtee.webp'}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
      <PageLayout featured_image={null} srcSet={null} title={layout_title}>
        <div className="mx-auto grid gap-12 px-8 py-8 md:grid-cols-2 md:px-10 md:py-20 lg:grid-cols-6">
          <section className="archive-list col-span-1 flex flex-col items-center gap-12 lg:col-span-4">
            <div>
              <DefaultArchive posts={postRows} />

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
            </div>
          </aside>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
