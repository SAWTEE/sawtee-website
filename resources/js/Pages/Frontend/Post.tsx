import WebsiteHead from '@/components/Frontend/Head';
import ReadingProgress from '@/components/Frontend/ReadingProgress';
import { mainWithPostLayout } from '@/lib/page-layouts';
import type { FrontendPostProps } from '@/types';

import WebinarPost from './Pages/WebinarPost';

function Post({
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
    <>
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
                className="font-medium text-[#006181] underline-offset-4 hover:text-[#006181]/80 dark:text-[#4da3c0]"
              >
                {`Download PDF: ${post.title}`}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          )}
        </>
      )}
    </>
  );
}

Post.layout = mainWithPostLayout(props => ({
  post: props.post,
  relatedPosts: props.relatedPosts,
  featured_image: props.featured_image,
  srcSet: props.srcSet,
}));

export default Post;
