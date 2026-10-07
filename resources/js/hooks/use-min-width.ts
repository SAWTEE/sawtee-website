import { useEffect, useState } from 'react';

/**
 * Subscribe to a min-width media query. The first client render matches the
 * current viewport so desktop navigation can skip the mobile download path.
 * SSR (no `window`) starts as false; pair with `lg:hidden` so a desktop
 * document does not flash the mobile toggle before hydration.
 */
export default function useMinWidth(minWidthPx: number): boolean {
  const query = `(min-width: ${minWidthPx}px)`;

  const [matches, setMatches] = useState(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, [query]);

  return matches;
}
