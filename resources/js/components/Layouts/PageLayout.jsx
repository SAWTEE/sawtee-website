import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostHeader from '@/components/Frontend/post/post-header';
import { cn } from '@/lib/utils';

const PageLayout = ({ title, featured_image, srcSet, children }) => {
  const hasFeaturedImage = featured_image && featured_image !== '';
  return (
    <>
      <div className="relative z-0 h-80 max-h-80 w-full bg-white/20 dark:bg-black/75">
        {hasFeaturedImage ? (
          <FeaturedMedia
            src={featured_image}
            srcSet={{...srcSet}}
            className={'max-h-80'}
          />
        ) : (
          <div
            className="absolute inset-0 -z-[1] h-full w-full bg-[url(/assets/pattern-tile-green.svg)] dark:bg-[url(/assets/pattern-tile-light-fade.svg)]"
            style={{
              backgroundSize: '1018px',
              backgroundPosition: 'top center',
              backgroundBlendMode: 'multiply',
            }}
          />
        )}
        <PostHeader
          className={cn(
            'absolute bottom-4 left-12 z-10 px-2 text-left',

          )}
          textStyle={hasFeaturedImage
              ? 'text-gray-100'
              : 'text-gray-800 dark:text-gray-200'}
          heading={title}
        />
      </div>
      {children}
    </>
  );
};

export default PageLayout;
