import { type ReactNode, useEffect, useRef, useState } from 'react';

type MountWhenVisibleProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** Expand the viewport so content can start loading just before it appears. */
  rootMargin?: string;
};

/**
 * Keep below-the-fold trees out of the first paint. Children mount once the
 * sentinel intersects, then stay mounted.
 */
export default function MountWhenVisible({
  children,
  fallback = null,
  rootMargin = '240px',
}: MountWhenVisibleProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const node = sentinelRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return <div ref={sentinelRef}>{isVisible ? children : fallback}</div>;
}
