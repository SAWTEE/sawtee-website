import WebsiteHead from '@/components/Frontend/Head';
import ReadingProgress from '@/components/Frontend/ReadingProgress';
import MainLayout from '@/layouts/MainLayout';
import PostLayout from '@/layouts/PostLayout';
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
      <ReadingProgress />

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
              <p className="mt-10 border-t border-[#006181]/12 pt-6 dark:border-[#006181]/20">
                <a
                  target="_blank"
                  href={file}
                  rel="noopener noreferrer"
                  className="text-[#006181] hover:text-[#006181]/80 font-medium underline-offset-4 dark:text-[#4da3c0]"
                >
                  {`Download PDF: ${post.title}`}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            )}
          </>
        )}
      </PostLayout>
    </MainLayout>
  );
}
