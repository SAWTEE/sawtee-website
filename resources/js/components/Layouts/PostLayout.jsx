import SocialShare from '@/components/Frontend/SocialShare';
import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostHeader from '@/components/Frontend/post/post-header';
import PostMeta from '@/components/Frontend/post/post-meta';
import readingDuration from 'reading-duration';
import PostTags from '../Frontend/post/post-tags';
import SidebarWidget from '../Frontend/sidebarWidget';

const PostLayout = ({
  children,
  relatedPosts,
  isNewsletter,
  post,
  featured_image,
  srcSet,
}) => {
  const readingTime = post.content
    ? readingDuration(post.content, {
        emoji: 'stopwatch',
        wordsPerMinute: 225,
      })
    : null;

  const shareUrl = post.category.parent
    ? `https://ankursingh.com.np/${post.category.parent.slug}/${post.category.slug}/${post.slug}`
    : `https://ankursingh.com.np/${post.category.slug}/${post.slug}`;

  return (
    <div className="relative w-full px-10 py-10 lg:px-20">
      <div className="mx-auto mt-5 max-w-5xl">
        <PostHeader
          //   className={`px-8 md:px-12`}
          categories={post.category}
          heading={post.title}
        />
        {featured_image && (
          <FeaturedMedia
            className={'rounded-xl'}
            src={featured_image}
            srcSet={srcSet}
          />
        )}
      </div>

      {/* <PostProgressBar value={scroll} /> */}

      <div className="w-full">
        {/* Look at the settings to see if we should include the featured image */}
        {isNewsletter && (
          <div>
            {children}
            <SocialShare url={shareUrl} />
          </div>
        )}

        {!isNewsletter && (
          <div className="post-body grid gap-6 pt-10 leading-8 lg:grid-cols-12">
            <div className="post-content max-w-[60ch] text-lg lg:col-span-8 lg:ml-14">
              <PostMeta
                className="py-2"
                author={post.author}
                date={post.published_at}
                readingTime={readingTime}
              />
              <div className="post-content prose-base">{children}</div>
              {post.tags.length > 0 && <PostTags tags={post.tags} />}

              <SocialShare
                url={shareUrl}
                title={post.title}
                excerpt={post.excerpt}
              />
            </div>
            <aside className="sticky top-32 h-full w-full lg:col-span-4">
              <SidebarWidget title="Related Posts" array={relatedPosts} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostLayout;
