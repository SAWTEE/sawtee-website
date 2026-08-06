'use client';

import type { COBEOptions } from 'cobe';
import { useMemo } from 'react';

import { Globe } from '@/components/ui/globe';

/**
 * City markers for SAWTEE member institutions (About page /
 * `public/tmp/member_institutes.json`).
 * Coordinates are city centers listed with each institute.
 */
export const MEMBER_INSTITUTION_MARKERS: NonNullable<COBEOptions['markers']> = [
  // Bangladesh — BELA, Unnayan Shamannay (Dhaka)
  { location: [23.8103, 90.4125], size: 0.06 },
  // India — CAG (Chennai)
  { location: [13.0827, 80.2707], size: 0.05 },
  // India — CUTS (Jaipur)
  { location: [26.9124, 75.7873], size: 0.05 },
  // India — DRAG (New Delhi)
  { location: [28.6139, 77.209], size: 0.05 },
  // Nepal — LEADERS, Pro Public (Kathmandu)
  { location: [27.7172, 85.324], size: 0.06 },
  // Pakistan — JDHR, SDPI (Islamabad)
  { location: [33.6844, 73.0479], size: 0.06 },
  // Sri Lanka — IPS, LST (Colombo)
  { location: [6.9271, 79.8612], size: 0.06 },
];

/** Initial phi so South Asia faces the camera before autorotation. */
const SOUTH_ASIA_PHI = 1.75;

type SawteeGlobeProps = {
  darkMode?: boolean;
};

/**
 * Magic UI / cobe globe for the Know Us mega menu, focused on South Asia
 * with markers for SAWTEE member institution cities.
 */
const SawteeGlobe = ({ darkMode = false }: SawteeGlobeProps) => {
  const config = useMemo<COBEOptions>(
    () => ({
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
      markers: MEMBER_INSTITUTION_MARKERS,
    }),
    [darkMode]
  );

  return (
    <div className="pointer-events-none absolute inset-0 top-4 -left-28 z-0 aspect-square w-[150%] sm:-top-2 sm:-left-32 md:-left-44 md:w-[150%] lg:-top-10 lg:-left-10 lg:w-[150%] xl:-left-32 xl:w-[150%]">
      <Globe className="top-0 max-w-none" config={config} />
    </div>
  );
};

export default SawteeGlobe;
