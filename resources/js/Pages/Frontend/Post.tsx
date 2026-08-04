import WebsiteHead from '@/components/Frontend/Head';
import MainLayout from '@/components/Layouts/MainLayout';
import PostLayout from '@/components/Layouts/PostLayout';
import type { FrontendPostProps } from '@/types';
import WebinarPost from './Pages/WebinarPost';

export default function Post({
  post,
  featured_image,
  srcSet,
  file,
  relatedPosts,
  seo,
}: FrontendPostProps) {
  const { category, title, content } = post;
  const isWebinarSeries = category?.slug === 'webinar-series';
  const isDefault = !isWebinarSeries;
  const shareUrl = post.category?.parent
    ? `https://info.sawtee.org/${post.category.parent.slug}/${post.category.slug}/${post.slug}`
    : `https://info.sawtee.org/${post.category?.slug}/${post.slug}`;

  return (
    <MainLayout>
      <WebsiteHead
        title={seo?.title ?? `${category?.name ?? ''} | ${title}`}
        description={seo?.description ?? post.meta_description ?? ''}
        image={
          seo?.image ??
          (featured_image ? featured_image : '/assets/logo-sawtee.webp')
        }
        url={seo?.url ?? shareUrl}
        type={seo?.type ?? 'article'}
        jsonLd={seo?.jsonLd}
      />
      <div id="progress" className="progress" />

      <PostLayout
        post={post}
        featured_image={featured_image}
        srcSet={srcSet}
        relatedPosts={relatedPosts}
      >
        {isWebinarSeries && <WebinarPost post={post} />}
        {isDefault && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: content ?? '',
              }}
            />
            {file && (
              <a target="_blank" href={file} rel="noreferrer">
                PDF
              </a>
            )}
          </>
        )}
      </PostLayout>
    </MainLayout>
  );
}
