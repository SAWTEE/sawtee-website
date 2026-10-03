/**
 * Network Information API. Chromium-only and still experimental, so every
 * field is optional and an absent API is treated as a fast connection.
 */
type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/** 3g is included: it is still too thin to spend on images up front. */
const SLOW_EFFECTIVE_TYPES = ['slow-2g', '2g', '3g'];

/**
 * Whether the visitor is on a connection where full-resolution images should
 * wait until the rest of the page has finished loading.
 */
export function isSlowConnection(): boolean {
  if (typeof navigator !== 'undefined') {
    const { connection } = navigator as Navigator & {
      connection?: NetworkInformation;
    };

    if (connection?.saveData === true) {
      return true;
    }

    if (
      connection?.effectiveType &&
      SLOW_EFFECTIVE_TYPES.includes(connection.effectiveType)
    ) {
      return true;
    }
  }

  // Covers browsers without the Network Information API and lets anyone opt in
  // through an OS-level data saver setting.
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-data: reduce)').matches === true
  );
}
