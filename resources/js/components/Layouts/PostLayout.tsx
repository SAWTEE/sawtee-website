import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostHeader from '@/components/Frontend/post/post-header';
import PostMeta from '@/components/Frontend/post/post-meta';
import type { Post } from '@/types';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import SidebarWidget from '../Frontend/sidebarWidget';

const calculateReadingTime = (
  content: string,
  options: { wordsPerMinute?: number; emoji?: boolean } = {}
): string | null => {
  if (!content) return null;

  const { wordsPerMinute = 225, emoji = false } = options;

  const cleanText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return null;

  const words = cleanText.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (emoji) {
    return `📖 ${minutes} min read`;
  }

  return `${minutes} min read`;
};

type PostLayoutProps = {
  children?: ReactNode;
  relatedPosts?: Post[];
  post: Post;
  featured_image?: string | null;
  srcSet?: string | null;
};

const PostLayout = ({
  children,
  relatedPosts,
  post,
  featured_image,
  srcSet,
}: PostLayoutProps) => {
  const readingTime = useMemo(() => {
    if (!post.content) return null;

    return calculateReadingTime(post.content, {
      emoji: false,
      wordsPerMinute: 225,
    });
  }, [post.content]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const anchors = contentRef.current.querySelectorAll('a');

      anchors.forEach(anchor => {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [children]);

  return (
    <div className="relative w-full py-10">
      <div className="mx-auto mt-5 w-full max-w-5xl">
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
              className="post-content prose-base text-lg text-secondary-foreground"
            >
              {children}
            </div>
            <div className="sharethis-sticky-share-buttons"></div>
          </div>
          <aside className="sticky top-32 h-full w-full lg:col-span-4">
            <SidebarWidget
              title="Related Posts"
              array={relatedPosts}
              link={`/category/${post.category?.slug}`}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostLayout;
