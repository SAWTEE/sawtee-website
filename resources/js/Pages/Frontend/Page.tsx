import type { ReactNode } from 'react';

import WebsiteHead from '@/components/Frontend/Head';
import { mainWithPageLayout } from '@/lib/page-layouts';
import type {
  FrontendPageProps,
  Page as CmsPage,
  PageSection,
  SeoMeta,
  Theme,
} from '@/types';

import Contact from './Pages/Contact';
import DefaultPage from './Pages/DefaultPage';
import MediaFellows from './Pages/MediaFellows';
import OurWork from './Pages/OurWork';
import ReformMonitor from './Pages/ReformMonitor';
import SectionTemplate from './Pages/SectionTemplate';

function featuredImageUrl(
  featured_image: FrontendPageProps['featured_image']
): string {
  if (!featured_image) {
    return '/assets/logo-sawtee.webp';
  }
  if (typeof featured_image === 'string') {
    return featured_image || '/assets/logo-sawtee.webp';
  }
  return featured_image.original_url || '/assets/logo-sawtee.webp';
}

function Page({
  page,
  featured_image,
  srcSet,
  themes,
  sections,
  seo,
}: FrontendPageProps) {
  const head: SeoMeta = seo ?? {
    title: page.meta_title || page.name,
    description: page.meta_description || '',
    image: featuredImageUrl(featured_image),
  };

  return (
    <>
      <WebsiteHead
        title={head.title}
        description={head.description}
        image={head.image}
        url={head.url}
        type={head.type}
        jsonLd={head.jsonLd}
      />

      {page.slug === 'reform-monitoring-platform' ? (
        <PageContent page={page} />
      ) : (
        <PageContent page={page} sections={sections} themes={themes} />
      )}
    </>
  );
}

Page.layout = (props: FrontendPageProps) => {
  // Reform monitor is full-bleed inside MainLayout (default) — no PageLayout hero.
  if (props.page?.slug === 'reform-monitoring-platform') {
    return {};
  }

  return mainWithPageLayout(p => ({
    title: p.page.name,
    featured_image:
      typeof p.featured_image === 'string'
        ? p.featured_image
        : p.featured_image?.original_url,
    srcSet: p.srcSet,
  }))(props);
};

export default Page;

type PageContentProps = {
  page: CmsPage;
  sections?: PageSection[];
  themes?: Theme[] | null;
};

const PageContent = ({
  page,
  sections,
  themes,
}: PageContentProps): ReactNode => {
  const { content, pageData } = page;
  switch (page.page_template) {
    case 'OurWork':
      return <OurWork themes={themes} sections={sections} content={content} />;

    case 'SectionTemplate':
      return (
        <SectionTemplate
          sections={sections}
          content={content}
          pageData={pageData}
          size={'xl'}
        />
      );

    case 'Contact':
      return <Contact content={content ?? undefined} pageData={pageData} />;

    case 'MediaFellows':
      return <MediaFellows />;

    case 'ReformMonitor':
      return <ReformMonitor content={content ?? undefined} />;

    default:
      return <DefaultPage sections={sections} content={content} />;
  }
};
