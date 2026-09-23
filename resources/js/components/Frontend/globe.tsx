'use client';

import type { COBEOptions } from 'cobe';
import { useMemo } from 'react';

import { Globe } from '@/components/ui/globe';
import { useSiteCopy } from '@/lib/site-copy';

const SOUTH_ASIA_PHI = 1.75;

type SawteeGlobeProps = {
  darkMode?: boolean;
};

/**
 * Magic UI / cobe globe for the Know Us mega menu, focused on South Asia
 * with markers for SAWTEE member institution cities.
 */
const SawteeGlobe = ({ darkMode = false }: SawteeGlobeProps) => {
  const copy = useSiteCopy();
  const markerKey = JSON.stringify(copy.globe_markers);
  const config = useMemo<COBEOptions>(() => {
    const markers = (JSON.parse(markerKey) ?? []) as NonNullable<
      COBEOptions['markers']
    >;

    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: SOUTH_ASIA_PHI,
      theta: 0.28,
      dark: darkMode ? 1 : 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: darkMode ? 1.6 : 1.2,
      baseColor: darkMode ? [0.35, 0.35, 0.35] : [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: darkMode ? [0.15, 0.15, 0.15] : [1, 1, 1],
      markers,
    };
  }, [darkMode, markerKey]);

  return (
    <div className="pointer-events-none absolute inset-0 top-4 -left-28 z-0 aspect-square w-[150%] sm:-top-2 sm:-left-32 md:-left-44 md:w-[150%] lg:-top-10 lg:-left-10 lg:w-[150%] xl:-left-32 xl:w-[150%]">
      <Globe className="top-0 max-w-none" config={config} />
    </div>
  );
};

export default SawteeGlobe;
