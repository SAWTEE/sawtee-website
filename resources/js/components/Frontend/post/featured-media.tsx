import { cn } from '@/lib/utils';

type FeaturedMediaProps = {
  src?: string | null;
  srcSet?: string | null;
  alt?: string | null;
  className?: string;
};

const FeaturedMedia = ({
  src,
  srcSet,
  alt,
  className = '',
}: FeaturedMediaProps) => {
  return (
    <picture>
      <img
        className={cn(
          'relative aspect-video h-full w-full bg-bgDarker object-cover',
          className
        )}
        src={src ?? undefined}
        srcSet={srcSet ?? undefined}
        sizes="(min-width: 1200px) 50vw,100vw"
        alt={alt || 'Hero Image'}
        loading="lazy"
      />
    </picture>
  );
};

export default FeaturedMedia;
