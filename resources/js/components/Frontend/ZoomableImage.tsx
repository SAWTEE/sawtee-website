import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type ZoomableImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
};

export default function ZoomableImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: ZoomableImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0"
          aria-label={`Zoom image: ${alt}`}
        >
          <img
            className={cn(className)}
            src={src}
            alt={alt}
            loading={loading}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-[90vw] border-0 bg-transparent p-0 shadow-none sm:rounded-none">
        <VisuallyHidden>
          <DialogTitle>{alt}</DialogTitle>
        </VisuallyHidden>
        <img
          className="max-h-[90vh] w-full object-contain"
          src={src}
          alt={alt}
        />
      </DialogContent>
    </Dialog>
  );
}
