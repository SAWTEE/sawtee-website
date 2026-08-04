import WebsiteHead from '@/components/Frontend/Head';
import MainLayout from '../../components/Layouts/MainLayout';
import PageLayout from '../../components/Layouts/PageLayout';
import Contact from './Pages/Contact';
import DefaultPage from './Pages/DefaultPage';
import MediaFellows from './Pages/MediaFellows';
import OurWork from './Pages/OurWork';
import ReformMonitor from './Pages/ReformMonitor';
import SectionTemplate from './Pages/SectionTemplate';

export default function Page({
  page,
  featured_image,
  srcSet,
  themes,
  sections,
}) {
  return (
    <>
      <WebsiteHead
        title={page.meta_title ? page.meta_title : page.name}
        description={page.meta_description}
        image={
          featured_image
            ? featured_image.original_url
            : '/assets/logo-sawtee.webp'
        }
      />

      <MainLayout>
        {page.slug !== 'reform-monitoring-platform' ? (
          <PageLayout
            featured_image={featured_image}
            srcSet={srcSet}
            title={page.name}
            showBackgroundPattern={false}
          >
            <PageContent page={page} sections={sections} themes={themes} />
          </PageLayout>
        ) : (
          <PageContent page={page} />
        )}
      </MainLayout>
    </>
  );
}

const PageContent = ({ page, sections, themes }) => {
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
      return <Contact content={content} pageData={pageData} />;

    case 'MediaFellows':
      return <MediaFellows />;

    case 'ReformMonitor':
      return <ReformMonitor content={content} />;

    default:
      return <DefaultPage sections={sections} content={content} />;
  }
};
