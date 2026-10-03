import ResponsiveImage from '@/components/Frontend/responsive-image';
import { cn } from '@/lib/utils';

type FeaturedMediaProps = {
  src?: string | null;
  srcSet?: string | null;
  /** Base64 blurred SVG shown until the full image arrives. */
  placeholder?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  className?: string;
  /** When true, treat as LCP candidate (eager + high fetch priority). */
  priority?: boolean;
};

/** Hero image for page, post and article chrome. */
const FeaturedMedia = ({
  src,
  srcSet,
  placeholder,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: FeaturedMediaProps) => {
  return (
    <ResponsiveImage
      className={cn(
        'bg-bgDarker relative aspect-video h-full w-full object-cover',
        className
      )}
      src={src}
      srcSet={srcSet}
      sizes="(min-width: 1200px) 50vw, 100vw"
      placeholder={placeholder}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
    />
  );
};

export default FeaturedMedia;
