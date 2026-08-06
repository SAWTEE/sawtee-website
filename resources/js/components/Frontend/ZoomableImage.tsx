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
      <DialogContent
        className={cn(
          'flex w-fit max-h-[90vh] max-w-[90vw] items-center justify-center',
          'gap-0 overflow-auto border-0 bg-transparent p-2 shadow-none',
          'sm:max-w-[90vw] sm:rounded-none',
          '[&>button]:top-2 [&>button]:right-2 [&>button]:rounded-full',
          '[&>button]:bg-black/55 [&>button]:p-1.5 [&>button]:text-white',
          '[&>button]:opacity-100 [&>button]:hover:opacity-90',
          '[&>button]:focus:ring-white/40'
        )}
      >
        <VisuallyHidden>
          <DialogTitle>{alt}</DialogTitle>
        </VisuallyHidden>
        <img
          className="h-auto max-h-[calc(90vh-1rem)] w-auto max-w-[calc(90vw-1rem)] object-contain"
          src={src}
          alt={alt}
        />
      </DialogContent>
    </Dialog>
  );
}
