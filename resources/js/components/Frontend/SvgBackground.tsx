import Particles from '@/components/Frontend/Particles';
import { cn } from '@/lib/utils';

type SvgBackgroundProps = {
  className?: string;
  svgStyles?: string;
  /** When false, only the concentric SVG rings render (no canvas particles). */
  showParticles?: boolean;
};

export default function SvgBackground({
  className = '',
  svgStyles,
  showParticles = true,
}: SvgBackgroundProps) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 hidden items-center justify-center overflow-hidden md:inset-y-0 md:flex',
        className
      )}
    >
      <svg
        viewBox="0 0 88 88"
        className={cn('text-theme-100 w-full max-w-screen-xl', svgStyles)}
      >
        <circle fill="currentColor" cx="44" cy="44" r="15.5" />
        <circle fillOpacity="0.2" fill="currentColor" cx="44" cy="44" r="44" />
        <circle
          fillOpacity="0.2"
          fill="currentColor"
          cx="44"
          cy="44"
          r="37.5"
        />
        <circle
          fillOpacity="0.3"
          fill="currentColor"
          cx="44"
          cy="44"
          r="29.5"
        />
        <circle
          fillOpacity="0.3"
          fill="currentColor"
          cx="44"
          cy="44"
          r="22.5"
        />
      </svg>
      {showParticles ? (
        <Particles className="pointer-events-none absolute inset-0" />
      ) : null}
    </div>
  );
}
