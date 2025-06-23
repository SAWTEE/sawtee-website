import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostHeader from '@/components/Frontend/post/post-header';
import PostMeta from '@/components/Frontend/post/post-meta';
import readingDuration from 'reading-duration';
import SidebarWidget from '../Frontend/sidebarWidget';
import { useEffect, useRef } from 'react';

const PostLayout = ({
  children,
  relatedPosts,
  post,
  featured_image,
  srcSet,
}) => {
  const readingTime = post.content
    ? readingDuration(post.content, {
        emoji: false,
        wordsPerMinute: 225,
      })
    : null;

    const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Find all anchor elements within the div
      const anchors = contentRef.current.querySelectorAll('a');

      // Add target="_blank" to each anchor
      anchors.forEach(anchor => {
        anchor.setAttribute('target', '_blank');
        // Optional: add rel="noopener noreferrer" for security
        anchor.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [children]); // Re-run when children change

  return (
    <div className="relative w-full px-10 py-10 lg:px-20">
      <div className="mx-auto mt-5 max-w-5xl">
        <PostHeader categories={post.category} heading={post.title} />
        {featured_image && (
          <FeaturedMedia
            className={'rounded-xl'}
            src={featured_image}
            srcSet={srcSet}
          />
        )}
      </div>

      <div className="w-full">
        <div className="post-body mx-auto grid max-w-7xl gap-6 pt-10 leading-8 lg:grid-cols-12">
          <div className="post-content max-w-[60ch] text-lg lg:col-span-8 lg:ml-14">
            <PostMeta
              className="py-2"
              author={post.author}
              date={post.published_at}
              readingTime={readingTime}
              tags={post.tags}
            />
            <div
            ref={contentRef}
             className="post-content prose-base text-lg text-secondary-foreground">
              {children}
            </div>
            <div className="sharethis-sticky-share-buttons"></div>
          </div>
          <aside className="sticky top-32 h-full w-full lg:col-span-4">
            <SidebarWidget
              title="Related Posts"
              array={relatedPosts}
              link={`/category/${post.category.slug}`}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostLayout;
