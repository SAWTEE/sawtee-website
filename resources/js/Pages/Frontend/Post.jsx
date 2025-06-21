import WebsiteHead from '@/components/Frontend/Head';
import MainLayout from '@/components/Layouts/MainLayout';
import PostLayout from '@/components/Layouts/PostLayout';
import NewsletterPost from './Pages/NewsletterPost';
import WebinarPost from './Pages/WebinarPost';

export default function Post({
  post,
  featured_image,
  srcSet,
  file,
  relatedPosts,
}) {
  const { category, title, content } = post;
  const isProgramme = category.parent && category.parent.slug === 'programme';
  // const isNewsletter = category.slug === 'newsletters';
  const isWebinarSeries = category.slug === 'webinar-series';
  const isDefault = !isWebinarSeries;
  const shareUrl = post.category.parent
    ? `https://info.sawtee.org/${post.category.parent.slug}/${post.category.slug}/${post.slug}`
    : `https://info.sawtee.org/${post.category.slug}/${post.slug}`;
  return (
    <MainLayout>
      <WebsiteHead
        title={`${category.name} | ${title}`}
        description={post.meta_description}
        image={featured_image ? featured_image : '/assets/logo-sawtee.webp'}
        url={shareUrl}
      >
        {/* <script
          type="text/javascript"
          defer
          src="https://platform-api.sharethis.com/js/sharethis.js#property=66c5af84260e03001afdc219&product=inilne-share-buttons&source=platform"
          async="async"
        /> */}
      </WebsiteHead>

      <PostLayout
        post={post}
        featured_image={featured_image}
        srcSet={srcSet}
        isProgramPost={isProgramme}
        // isNewsletter={isNewsletter}
        relatedPosts={relatedPosts}
      >
        {/* {isNewsletter && <NewsletterPost post={post} />} */}
        {isWebinarSeries && <WebinarPost post={post} />}
        {isDefault && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
            {file && (
              <a target="_blank" href={file}>
                PDF
              </a>
            )}
          </>
        )}
      </PostLayout>
    </MainLayout>
  );
}
