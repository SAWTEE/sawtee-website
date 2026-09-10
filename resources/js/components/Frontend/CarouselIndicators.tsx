import { cn } from '@/lib/utils';

type CarouselIndicatorsProps = {
  count: number;
  current: number;
  onSelect: (_index: number) => void;
  /**
   * `onMedia` — white pills for dark imagery (main hero slider).
   * `onSurface` — theme-colored pills for light/dark cards.
   */
  variant?: 'onMedia' | 'onSurface';
  className?: string;
  label?: string;
};

export default function CarouselIndicators({
  count,
  current,
  onSelect,
  variant = 'onSurface',
  className,
  label = 'Slide indicators',
}: CarouselIndicatorsProps) {
  if (count <= 1) {
    return null;
  }

  return (
    <div
      className={cn('flex items-center', className)}
      role="group"
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === current;

        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1} of ${count}`}
            aria-current={isActive ? 'true' : undefined}
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => onSelect(index)}
          >
            <span
              aria-hidden
              data-active={isActive ? 'true' : 'false'}
              className={cn(
                'rounded-full transition-all duration-300',
                isActive ? 'h-1.5 w-6' : 'h-1.5 w-1.5',
                variant === 'onMedia'
                  ? isActive
                    ? 'bg-white'
                    : 'bg-white/45 hover:bg-white/70'
                  : isActive
                    ? 'bg-[hsl(var(--theme-color))]'
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
