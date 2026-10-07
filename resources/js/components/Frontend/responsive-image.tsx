import { type CSSProperties, type SyntheticEvent, useState } from 'react';

import useFullImageReady from '@/hooks/use-full-image-ready';
import { cn } from '@/lib/utils';

/** Safe for full-bleed and half-width layouts alike; override per call site. */
const DEFAULT_SIZES = '(min-width: 1024px) 50vw, 100vw';

export type ResponsiveImageProps = {
  src?: string | null;
  /** Width-descriptor srcset built by `App\Support\ResponsiveImageSet`. */
  srcSet?: string | null;
  /** Layout widths the image will occupy, so the browser picks the right variant. */
  sizes?: string;
  /** Base64 blurred SVG painted behind the image until the full one decodes. */
  placeholder?: string | null;
  alt?: string | null;
  /** Intrinsic size of the widest variant; reserves layout space up front. */
  width?: number | null;
  height?: number | null;
  className?: string;
  title?: string;
  /** When true, treat as LCP candidate: load eagerly and never defer. */
  priority?: boolean;
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
};

/**
 * Lazy, network-aware image.
 *
 * The tiny placeholder sits behind the image as a background, so there is
 * something on screen from the first paint and the full image simply paints
 * over it. On slow connections the full image is not even requested until the
 * rest of the page has finished loading.
 */
const ResponsiveImage = ({
  src,
  srcSet,
  sizes = DEFAULT_SIZES,
  placeholder,
  alt,
  width,
  height,
  className,
  title,
  priority = false,
  onLoad,
  onError,
}: ResponsiveImageProps) => {
  const fullImageReady = useFullImageReady(priority);
  const [fullImageLoaded, setFullImageLoaded] = useState(false);

  // Without a placeholder there is nothing to look at while deferring, so the
  // full image is requested right away and native lazy loading does the work.
  const showFullImage = fullImageReady || !placeholder;

  // Dropping the background once the image has painted lets the browser
  // release the decoded placeholder.
  const showPlaceholder = Boolean(placeholder) && !fullImageLoaded;

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (showFullImage && event.currentTarget.currentSrc !== placeholder) {
      setFullImageLoaded(true);
    }
    onLoad?.(event);
  };

  return (
    <img
      className={cn(showPlaceholder && 'image-placeholder', className)}
      style={
        showPlaceholder
          ? ({
              '--image-placeholder': `url("${placeholder}")`,
            } as CSSProperties)
          : undefined
      }
      src={(showFullImage ? src : placeholder) ?? undefined}
      srcSet={(showFullImage ? srcSet : null) ?? undefined}
      sizes={showFullImage && srcSet ? sizes : undefined}
      alt={alt?.trim() || ''}
      title={title}
      width={width ?? undefined}
      height={height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      onLoad={handleLoad}
      onError={onError}
    />
  );
};

export default ResponsiveImage;
