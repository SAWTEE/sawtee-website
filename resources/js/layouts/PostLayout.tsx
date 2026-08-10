import { type ReactNode, useEffect, useMemo, useRef } from 'react';

import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostHeader from '@/components/Frontend/post/post-header';
import PostMeta from '@/components/Frontend/post/post-meta';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SocialShare from '@/components/Frontend/SocialShare';
import type { Post } from '@/types';

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

export default function PostLayout({
  children,
  relatedPosts,
  post,
  featured_image,
  srcSet,
}: PostLayoutProps) {
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

      anchors.forEach((anchor: HTMLAnchorElement) => {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [children]);

  const hasRelated = (relatedPosts?.length ?? 0) > 0;

  return (
    <article className="relative w-full px-5 py-12 md:px-10 md:py-16 lg:py-20">
      <header className="mx-auto w-full max-w-3xl">
        <PostHeader categories={post.category} heading={post.title} />
        <PostMeta
          className="mt-5 border-b border-[#006181]/12 pb-5 dark:border-[#006181]/20"
          author={post.author}
          date={post.published_at}
          readingTime={readingTime}
          tags={post.tags}
        />
      </header>

      {featured_image && (
        <div className="mx-auto mt-8 max-w-4xl md:mt-10">
          <FeaturedMedia
            className="overflow-hidden rounded-lg border border-[#006181]/10 shadow-sm dark:border-white/10"
            src={featured_image}
            srcSet={srcSet}
            alt={post.title}
            priority
          />
        </div>
      )}

      <div className="post-body mx-auto mt-10 max-w-7xl md:mt-12">
        <div
          className={
            hasRelated
              ? 'grid gap-10 lg:grid-cols-12 lg:gap-12'
              : 'mx-auto max-w-3xl'
          }
        >
          <div
            className={
              hasRelated
                ? 'post-content max-w-[65ch] lg:col-span-8 lg:max-w-none'
                : 'post-content'
            }
          >
            <div
              ref={contentRef}
              className="post-content prose-base text-secondary-foreground text-[1.05rem] leading-[1.75] md:text-lg md:leading-8"
            >
              {children}
            </div>
            <SocialShare
              className="mt-8"
              title={post.title}
              summary={post.excerpt ?? ''}
            />
          </div>

          {hasRelated && (
            <aside className="w-full self-start lg:sticky lg:top-28 lg:col-span-4 lg:pt-1">
              <SidebarWidget
                title="Related Posts"
                array={relatedPosts}
                link={`/category/${post.category?.slug}`}
              />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
