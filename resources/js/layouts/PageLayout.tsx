import type { ReactNode } from 'react';

import FeaturedMedia from '@/components/Frontend/post/featured-media';
import PostHeader from '@/components/Frontend/post/post-header';
import { cn } from '@/lib/utils';

type PageLayoutProps = {
  title?: string | null;
  featured_image?: string | null;
  srcSet?: string | null;
  children?: ReactNode;
  showBackgroundPattern?: boolean;
};

export default function PageLayout({
  title,
  featured_image,
  srcSet,
  children,
}: PageLayoutProps) {
  const hasFeaturedImage = Boolean(featured_image && featured_image !== '');
  return (
    <>
      <div className="relative z-0 h-80 max-h-80 w-full bg-white/20 dark:bg-black/75">
        {hasFeaturedImage ? (
          <FeaturedMedia
            src={featured_image as string}
            srcSet={srcSet ?? undefined}
            alt={title ?? ''}
            className={'max-h-80'}
            priority
          />
        ) : (
          <div
            className="bg-pattern-tile dark:bg-pattern-tile-fade absolute inset-0 -z-[1] h-full w-full"
            style={{
              backgroundSize: '1018px',
              backgroundPosition: 'top center',
              backgroundBlendMode: 'multiply',
            }}
          />
        )}
        <PostHeader
          className={cn('absolute bottom-4 left-12 z-10 px-2 text-left')}
          textStyle={
            hasFeaturedImage
              ? 'text-gray-100'
              : 'text-gray-800 dark:text-gray-200'
          }
          heading={title}
        />
      </div>
      {children}
    </>
  );
}
