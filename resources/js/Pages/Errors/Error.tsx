import { Link, router } from '@inertiajs/react';
import type { ReactNode } from 'react';

import WebsiteHead from '@/components/Frontend/Head';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/GuestLayout';
import MainLayout from '@/layouts/MainLayout';

type ErrorStatus = 403 | 404 | 419 | 500 | 503;

type ErrorPageProps = {
  status?: ErrorStatus | number;
  message?: string;
  admin?: boolean;
};

const ERROR_COPY: Record<
  ErrorStatus,
  { title: string; description: string; action: string }
> = {
  403: {
    title: 'Access denied',
    description:
      'You do not have permission to view this page. If you believe this is a mistake, contact SAWTEE.',
    action: 'Go to homepage',
  },
  404: {
    title: 'Page not found',
    description:
      'The page you requested could not be found. It may have moved, or the link may be outdated.',
    action: 'Go to homepage',
  },
  419: {
    title: 'Session expired',
    description:
      'Your session timed out for security. Please reload the page and try again.',
    action: 'Reload page',
  },
  500: {
    title: 'Something went wrong',
    description:
      'An unexpected error occurred on our servers. Please try again in a moment.',
    action: 'Go to homepage',
  },
  503: {
    title: 'Service unavailable',
    description:
      'SAWTEE is temporarily unavailable for maintenance. Please check back soon.',
    action: 'Go to homepage',
  },
};

function resolveCopy(status: number, message?: string) {
  const fallback = {
    title: 'Unexpected error',
    description:
      message ??
      'Something went wrong while loading this page. Please try again.',
    action: 'Go to homepage',
  };

  const copy = ERROR_COPY[status as ErrorStatus] ?? fallback;

  return {
    ...copy,
    description: message?.trim() ? message : copy.description,
  };
}

function ErrorShell({
  admin,
  children,
}: {
  admin?: boolean;
  children: ReactNode;
}) {
  if (admin) {
    return <GuestLayout>{children}</GuestLayout>;
  }

  return <MainLayout className="px-0!">{children}</MainLayout>;
}

export default function ErrorPage({
  status = 500,
  message,
  admin = false,
}: ErrorPageProps) {
  const code = Number(status) || 500;
  const { title, description, action } = resolveCopy(code, message);
  const homeHref = admin ? '/admin/dashboard' : '/';
  const isReload = code === 419;

  const body = (
    <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-16 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[url(/assets/pattern-tile-green.svg)] opacity-40 dark:bg-[url(/assets/pattern-tile-light-fade.svg)] dark:opacity-30"
        style={{
          backgroundSize: '1018px',
          backgroundPosition: 'top center',
        }}
        aria-hidden
      />

      <div className="mx-auto w-full max-w-xl text-center">
        <p className="text-theme-600 dark:text-theme-300 text-sm font-semibold tracking-[0.2em] uppercase">
          SAWTEE
        </p>
        <p
          className="text-theme-700 dark:text-theme-300 mt-4 font-mono text-7xl font-semibold tracking-tight tabular-nums sm:text-8xl"
          aria-hidden
        >
          {code}
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-slate-800 sm:text-3xl dark:text-slate-100">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-pretty text-slate-600 dark:text-slate-300">
          {description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {isReload ? (
            <Button
              type="button"
              className="bg-theme-600 hover:bg-theme-700 dark:bg-theme-500 dark:hover:bg-theme-400 text-white"
              onClick={() => router.reload()}
            >
              {action}
            </Button>
          ) : (
            <Button
              asChild
              className="bg-theme-600 hover:bg-theme-700 dark:bg-theme-500 dark:hover:bg-theme-400 text-white"
            >
              <Link href={homeHref}>{action}</Link>
            </Button>
          )}

          {!admin && (
            <Button asChild variant="outline">
              <Link href="/search">Search the site</Link>
            </Button>
          )}

          {admin && code === 403 && (
            <Button asChild variant="outline">
              <Link href="/admin/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ErrorShell admin={admin}>
      <WebsiteHead title={`${code}: ${title}`} description={description} />
      {admin ? (
        <div className="space-y-4 text-center">
          <p className="text-theme-700 dark:text-theme-300 font-mono text-5xl font-semibold tabular-nums">
            {code}
          </p>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {isReload ? (
              <Button type="button" onClick={() => router.reload()}>
                {action}
              </Button>
            ) : (
              <Button asChild>
                <Link href={homeHref}>{action}</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        body
      )}
    </ErrorShell>
  );
}
