import { Link } from '@inertiajs/react';
import type { HTMLAttributes } from 'react';

import ExploreButton from '@/components/Frontend/ExploreButton';
import Glassbox from '@/components/Frontend/Glassbox';
import { formatDate } from '@/lib/helpers';
import { htmlToText } from '@/lib/utils';
import type { Post } from '@/types';

type DefaultArchiveProps = HTMLAttributes<HTMLDivElement> & {
  posts?: Post[] | null;
  showFallbackImage?: boolean;
};

const DefaultArchive = ({
  posts = null,
  showFallbackImage = false,
  ...rest
}: DefaultArchiveProps) => {
  if (!posts || posts.length <= 0) return 'No posts found';

  return (
    <div
      className="grid grid-cols-1 items-stretch gap-10 p-8 xl:grid-cols-2"
      {...rest}
    >
      {posts.map(post => (
        <ArchivePost
          key={post.id}
          post={post}
          showFallbackImage={showFallbackImage}
        />
      ))}
    </div>
  );
};

export default DefaultArchive;

type ArchivePostProps = {
  post: Post;
  showFallbackImage?: boolean;
};

const hasMeaningfulExcerpt = (excerpt: string | null | undefined) => {
  const text = htmlToText(excerpt)?.replace(/\s+/g, ' ').trim() ?? '';
  // Avoid rendering punctuation-only leftovers (e.g. a lone ".") as an excerpt.
  return text.length > 0 && !/^[.\u2026]+$/.test(text);
};

const ArchivePost = ({ post, showFallbackImage = false }: ArchivePostProps) => {
  const featured_image = (post.media ?? []).filter(
    media => media.collection_name === 'post-featured-image'
  )[0];
  const categorySlug = post.category?.slug ?? '';
  const showExcerpt = hasMeaningfulExcerpt(post.excerpt);

  const postHref = post.link
    ? post.link
    : post.category?.parent
      ? `/category/${post.category.parent.slug}/${post.category.slug}/${post.slug}`
      : `/category/${categorySlug}/${post.slug}`;

  return (
    <Glassbox className="flex h-full flex-col overflow-hidden rounded shadow-md">
      <div className="group relative mb-2 overflow-hidden">
        {showFallbackImage && featured_image && (
          <Link href={`/category/${categorySlug}/${post.slug}`}>
            <img
              className="aspect-video w-full object-cover transition-all duration-500 ease-in group-hover:scale-105"
              loading="lazy"
              src={featured_image?.original_url}
              alt={post.title}
            />
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-900 opacity-25 transition duration-300 hover:bg-transparent" />
          </Link>
        )}
        <Link href={`/category/${categorySlug}/${post.slug}`}>
          <div className="bg-theme-600/80 hover:bg-theme-100/80 hover:text-theme-700 absolute top-0 right-0 mt-3 mr-3 cursor-pointer rounded-md px-2 py-1 font-sans text-xs font-medium text-white transition duration-500 ease-in-out">
            {post.category?.name}
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-2">
        <a href={postHref} className="primary-link">
          <h3 className="text-secondary-foreground/90 hover:text-secondary-foreground/80 inline-block text-lg leading-5 font-medium tracking-wide transition duration-500 ease-in-out hover:underline hover:underline-offset-2">
            {post.title}
          </h3>
        </a>
        <div className="mt-5 min-h-16 flex-1">
          {showExcerpt ? (
            <p
              className="text-secondary-foreground/70 line-clamp-3 text-sm"
              dangerouslySetInnerHTML={{ __html: post.excerpt ?? '' }}
            />
          ) : null}
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <time className="text-secondary-foreground/80 shrink-0 py-1 text-xs whitespace-nowrap">
            {formatDate(post.published_at)}
          </time>

          <ExploreButton
            className="min-w-0 sm:justify-end"
            link={postHref}
            text="Read more"
            aria-label={`Read more: ${post.title}`}
            title={`Read more: ${post.title}`}
          />
        </div>
      </div>
    </Glassbox>
  );
};
