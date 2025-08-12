import ExploreButton from '@/components/Frontend/ExploreButton';
import Glassbox from '@/components/Frontend/Glassbox';
import { formatDate } from '@/lib/helpers';

import { Link } from '@inertiajs/react';

const DefaultArchive = ({ posts, showFallbackImage = false, ...rest }) => {
  if (!posts || posts.length <= 0) return 'No posts found';
  console.log('DefaultArchive posts:', posts);

  return (
    <div className="grid grid-cols-1 gap-10 p-8 xl:grid-cols-2" {...rest}>
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

const ArchivePost = ({ post, showFallbackImage }) => {
  const file = post.media.filter(
    media => media.collection_name === 'post-files'
  )[0];
  const hasContent = post.content !== null || '';
  const featured_image = post.media.filter(
    media => media.collection_name === 'post-featured-image'
  )[0];
  return (
    <Glassbox className="flex flex-col justify-start overflow-hidden rounded shadow-md">
      <div className="group relative mb-2 overflow-hidden">
        {showFallbackImage && featured_image && (
          <Link href={`/category/${post.category.slug}/${post.slug}`}>
            <img
              className="aspect-video w-full object-cover transition-all duration-500 ease-in group-hover:scale-105"
              loading="lazy"
              src={featured_image?.original_url}
              alt={post.title}
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-gray-900 opacity-25 transition duration-300 hover:bg-transparent" />
          </Link>
        )}
        <Link href={`/category/${post.category.slug}/${post.slug}`}>
          <div className="absolute right-0 top-0 mr-3 mt-3 cursor-pointer rounded-md bg-theme-600/80 px-2 py-1 font-serif text-xs font-medium text-white transition duration-500 ease-in-out hover:bg-theme-100/80 hover:text-theme-700">
            {post.category.name}
          </div>
        </Link>
      </div>
      <div className="space-y-4 px-6">
        {hasContent ? (
          <Link href={post.category.parent
                  ? `/category/${post.category.parent.slug}/${post.category.slug}/${post.slug}`
                  : `/category/${post.category.slug}/${post.slug}`}>
            <h3 className="inline-block text-lg font-medium leading-5 tracking-wide text-secondary-foreground/90 transition duration-500 ease-in-out hover:text-secondary-foreground/80 hover:underline hover:underline-offset-2">
              {post.title}
            </h3>
          </Link>
        ) : (
          <a
            href={
              hasContent || !file
                ? post.category.parent
                  ? `/category/${post.category.parent.slug}/${post.category.slug}/${post.slug}`
                  : `/category/${post.category.slug}/${post.slug}`
                : file?.original_url
            }
          >
            <h3 className="inline-block text-lg font-medium leading-5 tracking-wide text-secondary-foreground/90 transition duration-500 ease-in-out hover:text-secondary-foreground/80 hover:underline hover:underline-offset-2">
              {post.title}
            </h3>
          </a>
        )}
        <p
          className="line-clamp-3 text-sm text-secondary-foreground/70"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="flex flex-row items-center justify-between">
          <span className="font-regular mr-1 flex flex-row items-center py-1 text-xs text-secondary-foreground/80">
            {formatDate(post.published_at)}
          </span>

          <ExploreButton
            link={post.category?.parent ? `/category/${post.category.parent.slug}/${post.category.slug}/${post.slug}` : `/category/${post.category.slug}/${post.slug}`}
            text="Read more"
          />
        </div>
      </div>
    </Glassbox>
  );
};
