import { useEffect, useState } from 'react';

import { useTheme } from '@/components/shared/theme-provider';
import { useSiteCopy } from '@/lib/site-copy';

function useDeferUntilPageLoaded(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const activate = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        setReady(true);
      }
    };

    if (document.readyState === 'complete') {
      activate();
      return;
    }

    window.addEventListener('load', activate, { once: true });

    return () => window.removeEventListener('load', activate);
  }, []);

  return ready;
}

export default function NewsletterCallout({
  heading,
  intro,
}: {
  heading?: string | null;
  intro?: string | null;
}) {
  const copy = useSiteCopy();

  return (
    <div className="bg-theme-50 dark:bg-theme-900 rounded-lg px-6 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16 xl:flex xl:items-center">
      <div className="xl:w-0 xl:flex-1">
        <h2 className="text-theme-800 dark:text-theme-100 text-2xl leading-8 font-extrabold tracking-tight sm:text-3xl sm:leading-9">
          {heading || copy.newsletter.heading}
        </h2>
        <p className="text-theme-800 dark:text-theme-200 mt-3 max-w-3xl text-lg leading-6">
          {intro || copy.newsletter.intro}
        </p>
      </div>
      <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
        <div className="mt-3 sm:mt-0 sm:ml-3 sm:shrink-0">
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}

export const SubscribeForm = ({
  embedSrc,
}: {
  embedSrc?: string;
} = {}) => {
  const copy = useSiteCopy();
  const { resolvedTheme, theme } = useTheme();
  const embedReady = useDeferUntilPageLoaded();
  const isDark =
    resolvedTheme === 'dark' || (resolvedTheme == null && theme === 'dark');
  const src = embedSrc || copy.newsletter.substack_embed;

  return (
    <div
      className={
        isDark
          ? 'border-theme-700 bg-theme-900 overflow-hidden rounded border'
          : 'border-theme-200 overflow-hidden rounded border bg-white'
      }
    >
      {embedReady ? (
        <iframe
          key={isDark ? 'dark' : 'light'}
          src={src}
          width="100%"
          height="220"
          title={copy.newsletter.embed_title}
          loading="lazy"
          // Substack's native embed has no theme API; invert the locked light
          // iframe in dark mode and remount when the site theme changes.
          className={isDark ? 'substack-embed-dark' : 'substack-embed'}
          frameBorder="0"
          scrolling="no"
        />
      ) : (
        <div
          className="bg-theme-100 dark:bg-theme-800 h-[220px] w-full animate-pulse"
          role="status"
          aria-label="Loading newsletter signup form"
        />
      )}
    </div>
  );
};
