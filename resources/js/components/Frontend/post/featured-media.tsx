import { cn } from '@/lib/utils';

type FeaturedMediaProps = {
  src?: string | null;
  srcSet?: string | null;
  alt?: string | null;
  className?: string;
  /** When true, treat as LCP candidate (eager + high fetch priority). */
  priority?: boolean;
};

const FeaturedMedia = ({
  src,
  srcSet,
  alt,
  className = '',
  priority = false,
}: FeaturedMediaProps) => {
  return (
    <picture>
      <img
        className={cn(
          'bg-bgDarker relative aspect-video h-full w-full object-cover',
          className
        )}
        src={src ?? undefined}
        srcSet={srcSet ?? undefined}
        sizes="(min-width: 1200px) 50vw,100vw"
        alt={alt?.trim() || ''}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
};

export default FeaturedMedia;
