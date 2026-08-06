import { useTheme } from '@/components/shared/theme-provider';

export default function NewsletterCallout() {
  return (
    <div className="bg-theme-50 dark:bg-theme-900 rounded-lg px-6 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16 xl:flex xl:items-center">
      <div className="xl:w-0 xl:flex-1">
        <h2 className="text-theme-800 dark:text-theme-100 text-2xl leading-8 font-extrabold tracking-tight sm:text-3xl sm:leading-9">
          Receive the latest publication releases, events and monthly
          newsletter.
        </h2>
        <p className="text-theme-800 dark:text-theme-200 mt-3 max-w-3xl text-lg leading-6">
          Do you want to get notified? Sign up for our newsletter and
          you&apos;ll be among the first to find out about new publication
          releases, events and monthly newsletter.
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

const SUBSTACK_EMBED_SRC = 'https://sawteenp.substack.com/embed';

export const SubscribeForm = () => {
  const { resolvedTheme, theme } = useTheme();
  const isDark =
    resolvedTheme === 'dark' || (resolvedTheme == null && theme === 'dark');

  return (
    <div
      className={
        isDark
          ? 'border-theme-700 bg-theme-900 overflow-hidden rounded border'
          : 'border-theme-200 overflow-hidden rounded border bg-white'
      }
    >
      <iframe
        key={isDark ? 'dark' : 'light'}
        src={SUBSTACK_EMBED_SRC}
        width="100%"
        height="220"
        title="Subscribe to the SAWTEE newsletter on Substack"
        // Substack's native embed has no theme API; invert the locked light
        // iframe in dark mode and remount when the site theme changes.
        style={{
          border: 'none',
          background: 'white',
          display: 'block',
          filter: isDark ? 'invert(1) hue-rotate(180deg)' : undefined,
        }}
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};
