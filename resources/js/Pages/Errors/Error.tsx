import { Link, router } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

import WebsiteHead from '@/components/Frontend/Head';
import SvgBackground from '@/components/Frontend/SvgBackground';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/GuestLayout';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';

type ErrorStatus = 403 | 404 | 419 | 500 | 503;

type ErrorPageProps = {
  status?: ErrorStatus | number;
  message?: string;
  admin?: boolean;
};

type ErrorCopy = {
  title: string;
  description: string;
  action: string;
  hint?: string;
};

const ERROR_COPY: Record<ErrorStatus, ErrorCopy> = {
  403: {
    title: 'Access denied',
    description:
      'You do not have permission to view this page. If you believe this is a mistake, contact SAWTEE.',
    action: 'Go to homepage',
    hint: 'You may need to sign in, or this content may be restricted.',
  },
  404: {
    title: 'Page not found',
    description:
      'The page you requested could not be found. It may have moved, or the link may be outdated.',
    action: 'Go to homepage',
    hint: 'Try searching, or browse publications and research from the links below.',
  },
  419: {
    title: 'Session expired',
    description:
      'Your session timed out for security. Please reload the page and try again.',
    action: 'Reload page',
    hint: 'This usually happens after a long idle period.',
  },
  500: {
    title: 'Something went wrong',
    description:
      'An unexpected error occurred on our servers. Please try again in a moment.',
    action: 'Go to homepage',
    hint: 'If the problem continues, please contact us.',
  },
  503: {
    title: 'Service unavailable',
    description:
      'SAWTEE is temporarily unavailable for maintenance. Please check back soon.',
    action: 'Go to homepage',
    hint: 'We are working to restore access as quickly as possible.',
  },
};

const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/category/publications', label: 'Publications' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

function resolveCopy(
  status: number,
  message: string | undefined,
  admin: boolean
): ErrorCopy {
  const fallback: ErrorCopy = {
    title: 'Unexpected error',
    description:
      message ??
      'Something went wrong while loading this page. Please try again.',
    action: admin ? 'Back to dashboard' : 'Go to homepage',
  };

  const copy = ERROR_COPY[status as ErrorStatus] ?? fallback;
  const action =
    admin && copy.action === 'Go to homepage'
      ? 'Back to dashboard'
      : copy.action;

  return {
    ...copy,
    action,
    description: message?.trim() ? message : copy.description,
  };
}

function goBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back();
    return;
  }

  router.visit('/');
}

export default function ErrorPage({
  status = 500,
  message,
  admin = false,
}: ErrorPageProps) {
  const code = Number(status) || 500;
  const { title, description, action, hint } = resolveCopy(
    code,
    message,
    admin
  );
  const homeHref = admin ? '/admin/dashboard' : '/';
  const isReload = code === 419;
  const reduceMotion = useReducedMotion();

  const enter = (delay = 0) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <>
      <WebsiteHead title={`${code}: ${title}`} description={description} />
      {admin ? (
        <AdminErrorContent
          code={code}
          title={title}
          description={description}
          hint={hint}
          action={action}
          homeHref={homeHref}
          isReload={isReload}
        />
      ) : (
        <PublicErrorContent
          code={code}
          title={title}
          description={description}
          hint={hint}
          action={action}
          homeHref={homeHref}
          isReload={isReload}
          enter={enter}
        />
      )}
    </>
  );
}

type ContentProps = {
  code: number;
  title: string;
  description: string;
  hint?: string;
  action: string;
  homeHref: string;
  isReload: boolean;
};

function AdminErrorContent({
  code,
  title,
  description,
  hint,
  action,
  homeHref,
  isReload,
}: ContentProps) {
  return (
    <div className="space-y-5 text-center">
      <p className="text-xs font-medium tracking-[0.18em] text-[#006181] uppercase dark:text-[#4da3c0]">
        SAWTEE CMS
      </p>
      <p className="font-serif text-5xl font-semibold tracking-tight text-[#006181] tabular-nums dark:text-[#4da3c0]">
        {code}
      </p>
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {hint ? (
        <p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2 pt-1">
        {isReload ? (
          <Button type="button" onClick={() => router.reload()}>
            {action}
          </Button>
        ) : (
          <Button asChild>
            <Link href={homeHref}>{action}</Link>
          </Button>
        )}
        {isReload ? (
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/">View public site</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function PublicErrorContent({
  code,
  title,
  description,
  hint,
  action,
  homeHref,
  isReload,
  enter,
}: ContentProps & {
  enter: (
    delay?: number
  ) =>
    | {
        initial: { opacity: number; y: number };
        animate: { opacity: number; y: number };
        transition: {
          duration: number;
          ease: number[];
          delay: number;
        };
      }
    | undefined;
}) {
  return (
    <div className="relative flex min-h-[min(85vh,52rem)] w-full flex-col justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[url(/assets/pattern-tile-green.svg)] opacity-35 dark:bg-[url(/assets/pattern-tile-light-fade.svg)] dark:opacity-25"
        style={{
          backgroundSize: '960px',
          backgroundPosition: 'top center',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(0,97,129,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(0,97,129,0.16),transparent_55%)]"
        aria-hidden
      />
      <div
        className="from-background via-background/85 pointer-events-none absolute inset-0 -z-10 bg-linear-to-b to-transparent dark:from-black/85 dark:via-black/70"
        aria-hidden
      />
      <SvgBackground
        className="pointer-events-none -z-10 opacity-50 dark:opacity-25"
        svgStyles="text-theme-100 dark:text-theme-900 translate-x-[18%] scale-110"
        showParticles={false}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:px-8 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div className="lg:col-span-7">
          <motion.div {...enter(0)}>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-[#006181]/40 focus-visible:outline-none"
              aria-label="SAWTEE home"
            >
              <img
                src="/assets/logo-sawtee.svg"
                alt=""
                width={128}
                height={32}
                className="h-8 w-auto object-contain sm:h-9"
              />
              <span className="sr-only">SAWTEE</span>
            </Link>
          </motion.div>

          <motion.p
            className="mt-8 text-xs font-medium tracking-[0.18em] text-[#006181] uppercase dark:text-[#4da3c0]"
            {...enter(0.05)}
          >
            South Asia Watch on Trade, Economics and Environment
          </motion.p>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
            <motion.div
              className="relative shrink-0 border-l-[3px] border-[#006181] pl-4 sm:pl-5"
              {...enter(0.1)}
            >
              <p
                className="font-serif text-7xl leading-none font-semibold tracking-tight text-[#006181] tabular-nums sm:text-8xl dark:text-[#4da3c0]"
                aria-hidden
              >
                {code}
              </p>
            </motion.div>

            <motion.div className="min-w-0 pt-1" {...enter(0.16)}>
              <h1 className="text-primary font-serif text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl dark:text-zinc-100">
                {title}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed text-pretty">
                {description}
              </p>
              {hint ? (
                <p className="text-muted-foreground/90 mt-2 max-w-md text-sm leading-relaxed">
                  {hint}
                </p>
              ) : null}
            </motion.div>
          </div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            {...enter(0.22)}
          >
            {isReload ? (
              <Button
                type="button"
                className="h-11 rounded-md bg-[#006181] px-5 text-sm font-medium text-white hover:bg-[#004d66] dark:bg-[#006181] dark:hover:bg-[#0a7a9c]"
                onClick={() => router.reload()}
              >
                {action}
              </Button>
            ) : (
              <Button
                asChild
                className="h-11 rounded-md bg-[#006181] px-5 text-sm font-medium text-white hover:bg-[#004d66] dark:bg-[#006181] dark:hover:bg-[#0a7a9c]"
              >
                <Link href={homeHref}>{action}</Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-md border-[#006181]/25 bg-background/70 hover:bg-[#006181]/6 dark:border-[#006181]/40 dark:bg-black/30 dark:hover:bg-[#006181]/15"
            >
              <Link href="/search">Search the site</Link>
            </Button>

            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-[#006181] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#006181]/35 focus-visible:outline-none dark:text-[#4da3c0]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Go back
            </button>
          </motion.div>

          <motion.nav
            className="mt-12 border-t border-[#006181]/15 pt-6 dark:border-[#006181]/25"
            aria-label="Helpful links"
            {...enter(0.28)}
          >
            <p className="text-muted-foreground mb-3 text-[0.65rem] font-semibold tracking-[0.16em] uppercase">
              Continue exploring
            </p>
            <ul className="flex flex-wrap gap-x-1 gap-y-2">
              {PUBLIC_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'group inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium',
                      'text-primary/90 underline-offset-4 transition-colors',
                      'hover:text-[#006181] hover:underline',
                      'focus-visible:ring-2 focus-visible:ring-[#006181]/35 focus-visible:outline-none',
                      'dark:text-zinc-200 dark:hover:text-[#4da3c0]'
                    )}
                  >
                    {link.label}
                    <ChevronRight
                      className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        <div
          className="pointer-events-none relative hidden min-h-64 lg:col-span-5 lg:block"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(0_97_129/0.08),transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgb(0_97_129/0.14),transparent_65%)]" />
          <div className="absolute top-1/2 left-1/2 w-[min(100%,22rem)] -translate-x-1/2 -translate-y-1/2">
            <div className="border-l-[3px] border-[#006181]/40 pl-6">
              <p className="font-serif text-2xl leading-snug font-semibold tracking-tight text-[#006181]/80 dark:text-[#4da3c0]/90">
                Research, dialogue, and policy engagement across South Asia.
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                SAWTEE is an independent think tank network working on trade,
                economics, and environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ErrorPage.layout = (props: ErrorPageProps) => {
  if (props.admin) {
    return GuestLayout;
  }

  return [MainLayout, { className: 'px-0!' }];
};
