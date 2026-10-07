const READY_CLASS = 'inertia-lcp-ready';
const FALLBACK_ID = 'inertia-lcp-fallback';
const SAFETY_TIMEOUT_MS = 2500;

let armedTimeout: number | undefined;

function markReady(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (armedTimeout !== undefined) {
    window.clearTimeout(armedTimeout);
    armedTimeout = undefined;
  }

  document.body.classList.add(READY_CLASS);
}

/**
 * Keep the Blade LCP image painted until the React hero reports it is on
 * screen, or until a short safety timeout. Hiding it at Inertia boot made
 * Chrome wait for a later (often lazy) image and pushed LCP past 3s.
 */
export function armStaticLcpFallback(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (!document.getElementById(FALLBACK_ID)) {
    markReady();
    return;
  }

  if (armedTimeout !== undefined) {
    window.clearTimeout(armedTimeout);
  }

  armedTimeout = window.setTimeout(markReady, SAFETY_TIMEOUT_MS);
}

export function dismissStaticLcpFallback(): void {
  markReady();
}
