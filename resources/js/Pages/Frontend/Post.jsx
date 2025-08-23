import WebsiteHead from '@/components/Frontend/Head';
import MainLayout from '@/components/Layouts/MainLayout';
import PostLayout from '@/components/Layouts/PostLayout';
import WebinarPost from './Pages/WebinarPost';

export default function Post({
  post,
  featured_image,
  srcSet,
  file,
  relatedPosts,
}) {
  const { category, title, content } = post;
  console.log('Post category:', category);
  // const isProgramme = category.parent && category.parent.slug === 'programme';
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
      ></WebsiteHead>

      <PostLayout
        post={post}
        featured_image={featured_image}
        srcSet={srcSet}
        // isProgramPost={isProgramme}
        relatedPosts={relatedPosts}
      >
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
