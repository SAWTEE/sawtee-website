import { useEffect, useState } from 'react';

/**
 * Fixed top reading progress bar driven by document scroll.
 * Prefer JS over CSS scroll-driven animations for broader browser support.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const next =
        scrollable > 0
          ? Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100))
          : 0;
      setProgress(next);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      id="progress"
      className="progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
