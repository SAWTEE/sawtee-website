import { cn } from '@/lib/utils';

export default function SvgBackground({ className, svgStyles }) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 hidden items-center justify-center overflow-hidden md:inset-y-0 md:flex',
        className
      )}
    >
      <svg
        viewBox="0 0 88 88"
        className={cn('w-full max-w-screen-xl text-theme-100', svgStyles)}
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
    </div>
  );
}
