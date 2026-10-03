import { useEffect, useState } from 'react';

import { isSlowConnection } from '@/lib/connection';

/** requestIdleCallback is missing in Safari; fall back to a short timeout. */
const IDLE_FALLBACK_DELAY = 200;

/**
 * Whether it is time to request the full-resolution image.
 *
 * Fast connections get it on the first render and lean on native
 * `loading="lazy"` for offscreen work. Slow connections hold off until the page
 * has loaded everything else and the main thread is idle, so images never
 * compete with markup, styles, scripts and fonts for a thin pipe. Callers show
 * the tiny placeholder in the meantime.
 *
 * @param priority Skip deferral entirely — for LCP candidates such as heroes.
 */
export default function useFullImageReady(priority = false): boolean {
  // Decided during the first render so a slow connection never starts a
  // request we are about to replace. Inertia SSR is off, so `navigator` is
  // available and there is no server markup to hydrate against.
  const [ready, setReady] = useState(() => priority || !isSlowConnection());

  useEffect(() => {
    if (ready) {
      return;
    }

    let cancelled = false;
    let idleHandle: number | undefined;
    let usedIdleCallback = false;

    const release = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    const releaseWhenIdle = () => {
      if (window.requestIdleCallback) {
        usedIdleCallback = true;
        idleHandle = window.requestIdleCallback(release);
        return;
      }

      idleHandle = window.setTimeout(release, IDLE_FALLBACK_DELAY);
    };

    if (document.readyState === 'complete') {
      releaseWhenIdle();
    } else {
      window.addEventListener('load', releaseWhenIdle, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', releaseWhenIdle);

      if (idleHandle === undefined) {
        return;
      }

      if (usedIdleCallback) {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, [ready]);

  return ready;
}
