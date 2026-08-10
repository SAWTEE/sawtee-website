import type { ReactNode } from 'react';

import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import { SubscribeForm } from '@/components/Frontend/NewsletterCallout';
import Pagination from '@/components/Frontend/Pagination';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import SubstackFeedWidget from '@/components/Frontend/SubstackFeedWidget';
import { mainWithPageLayout } from '@/lib/page-layouts';
import type {
  FrontendCategoryProps,
  Paginated,
  Post,
  ResearchByYear,
} from '@/types';

import CovidArchive from './Archives/CovidArchive';
import DefaultArchive from './Archives/DefaultArchive';
import EventsArchive from './Archives/EventsArchive';
import LDCArchive from './Archives/LDCArchive';
import NewsletterArchive from './Archives/NewsletterArchive';
import ResearchArchive from './Archives/ResearchArchive';

type Props = FrontendCategoryProps & { showSubscriptionBox?: boolean };

function isPaginatedPosts(
  posts: FrontendCategoryProps['posts']
): posts is Paginated<Post> {
  return (
    !!posts &&
    typeof posts === 'object' &&
    !Array.isArray(posts) &&
    'data' in posts &&
    Array.isArray((posts as Paginated<Post>).data)
  );
}

function isResearchByYear(
  posts: FrontendCategoryProps['posts']
): posts is ResearchByYear {
  return (
    !!posts &&
    typeof posts === 'object' &&
    !Array.isArray(posts) &&
    !('data' in posts)
  );
}

function Category({
  category,
  posts,
  infocus,
  sawteeInMedia,
  events,
  substackFeed,
  featured_image,
  // srcSet,
  seo,
  showSubscriptionBox = true,
}: Props) {
  const isInFocus =
    category.slug.includes('infocus') || category.slug.includes('in-focus');
  const isMedia = category.slug.includes('sawtee-in-media');
  const isEvents = category.slug.includes('featured-events');
  const isNewsletters = category.slug.includes('newsletters');
  const paginated = isPaginatedPosts(posts) ? posts : null;

  const renderArchiveComponent = (): ReactNode => {
    switch (true) {
      case category.slug.includes('covid'):
        return <CovidArchive posts={paginated?.data} />;
      case category.slug.includes('ldc'):
        return <LDCArchive posts={paginated?.data} />;
      case category.slug.includes('research'):
        return (
          <ResearchArchive posts={isResearchByYear(posts) ? posts : null} />
        );
      case isNewsletters:
        return <NewsletterArchive posts={paginated?.data} />;
      case category.slug.includes('featured-events'):
        return <EventsArchive posts={paginated?.data} />;
      default:
        return <DefaultArchive posts={paginated?.data} />;
    }
  };

  const image =
    typeof featured_image === 'string' ? featured_image : featured_image;

  return (
    <>
      <WebsiteHead
        title={
          seo?.title ??
          (category.meta_title ? category.meta_title : category.name)
        }
        description={seo?.description ?? category.meta_description ?? ''}
        image={seo?.image ?? (image ? image : '/assets/logo-sawtee.webp')}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
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
            {isNewsletters ? (
              <SubstackFeedWidget posts={substackFeed} />
            ) : (
              showSubscriptionBox && (
                <Glassbox className={'w-full p-0'}>
                  <SubscriptionCard />
                </Glassbox>
              )
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

        {isNewsletters && (
          <div className="col-span-full">
            <div className="rounded-xl border border-[#006181]/12 bg-[linear-gradient(135deg,rgba(0,97,129,0.07),transparent_50%)] px-5 py-6 md:px-8 md:py-8 dark:border-[#006181]/25 dark:bg-[linear-gradient(135deg,rgba(0,97,129,0.16),transparent_50%)]">
              <div className="mb-5 max-w-3xl">
                <p className="text-primary mb-2 text-xs font-semibold tracking-[0.16em] uppercase">
                  Subscribe
                </p>
                <h3 className="text-secondary-foreground font-serif text-xl font-semibold tracking-tight md:text-2xl">
                  Get the Monitor in your inbox
                </h3>
                <p className="text-secondary-foreground/75 mt-2 text-sm leading-relaxed">
                  Join SAWTEE on Substack for new issues, commentary, and
                  regional trade updates.
                </p>
              </div>
              <SubscribeForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Category.layout = mainWithPageLayout(props => ({
  title: props.category.name,
  featured_image:
    typeof props.featured_image === 'string'
      ? props.featured_image
      : props.featured_image,
  srcSet: props.srcSet,
}));

export default Category;
