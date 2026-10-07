import { lazy, Suspense, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type SvgBackgroundProps = {
  className?: string;
  svgStyles?: string;
  /** When false, only the concentric SVG rings render (no canvas particles). */
  showParticles?: boolean;
};

const Particles = lazy(() => import('@/components/Frontend/Particles'));

export default function SvgBackground({
  className = '',
  svgStyles,
  showParticles = true,
}: SvgBackgroundProps) {
  const [particlesEnabled, setParticlesEnabled] = useState(false);

  useEffect(() => {
    if (!showParticles) {
      return;
    }

    const desktop = window.matchMedia('(min-width: 768px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      setParticlesEnabled(desktop.matches && !reduceMotion.matches);
    };

    sync();
    desktop.addEventListener('change', sync);
    reduceMotion.addEventListener('change', sync);

    return () => {
      desktop.removeEventListener('change', sync);
      reduceMotion.removeEventListener('change', sync);
    };
  }, [showParticles]);

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
      {particlesEnabled ? (
        <Suspense fallback={null}>
          <Particles className="pointer-events-none absolute inset-0" />
        </Suspense>
      ) : null}
    </div>
  );
}
