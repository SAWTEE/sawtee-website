import { cn } from '@/lib/utils';

/**
 * Loading placeholders for the home page's deferred and lazily imported
 * sections. Each one mirrors the real section's box, spacing, and minimum
 * height so content arriving does not shift the page.
 */

const Bar = ({ className = '' }: { className?: string }) => (
  <div className={cn('bg-primary/10 animate-pulse rounded', className)} />
);

const Panel = ({
  className = '',
  children,
  label,
}: {
  className?: string;
  children: React.ReactNode;
  label: string;
}) => (
  <div
    role="status"
    aria-label={label}
    className={cn(
      'border-borderColor/80 dark:bg-bgDarker rounded-md border bg-white px-5 py-6 shadow-sm sm:px-6 sm:py-7',
      className
    )}
  >
    {children}
  </div>
);

/** Small uppercase eyebrow heading used by the outreach and featured panels. */
const EyebrowBar = () => <Bar className="mb-5 h-3 w-32" />;

/** One row of the featured publications / blogs slider: copy plus a thumbnail. */
const FeaturedRow = () => (
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0 flex-1 space-y-2">
      <Bar className="h-4 w-full" />
      <Bar className="h-4 w-4/5" />
      <Bar className="h-3 w-3/5" />
    </div>
    <div className="border-borderColor/70 bg-primary/10 mx-auto h-28 w-1/3 max-w-20 shrink-0 animate-pulse rounded-md border" />
  </div>
);

/** Aside beside the main carousel (`featuredPublications` + `featuredBlogPosts`). */
export const FeaturedPublicationsSkeleton = () => (
  <Panel
    label="Loading featured publications"
    className="min-h-112 px-4 py-6 sm:min-h-128 sm:px-5 sm:py-7"
  >
    <EyebrowBar />
    <FeaturedRow />
    <div className="mt-4 flex justify-center gap-2">
      <Bar className="h-1.5 w-6" />
      <Bar className="h-1.5 w-1.5 rounded-full" />
      <Bar className="h-1.5 w-1.5 rounded-full" />
    </div>

    <div
      className="border-borderColor/70 my-6 border-t dark:border-white/10"
      aria-hidden
    />

    <EyebrowBar />
    <FeaturedRow />
  </Panel>
);

/** Publication cover carousel (1 / 2 / 3 / 4 covers per row as it widens). */
export const PublicationCoversSkeleton = () => (
  <div
    role="status"
    aria-label="Loading latest publications"
    className="flex gap-4 overflow-hidden"
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className={cn(
          'shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4',
          index > 0 && 'hidden sm:block',
          index > 1 && 'sm:hidden md:block',
          index > 2 && 'md:hidden lg:block'
        )}
      >
        <Bar className="mx-auto aspect-3/4 w-45 rounded-md" />
      </div>
    ))}
  </div>
);

/** Webinar / recordings video carousel. */
export const VideoCarouselSkeleton = () => (
  <div
    role="status"
    aria-label="Loading recordings"
    className="bg-primary/10 aspect-video w-full animate-pulse rounded-md"
  />
);

/** A list-style outreach column (SAWTEE in media, newsletters). */
const OutreachColumnSkeleton = ({ label }: { label: string }) => (
  <Panel label={label} className="flex w-full flex-col">
    <Bar className="mb-2 h-3 w-20" />
    <Bar className="h-5 w-48" />
    <Bar className="mt-3 h-3 w-full" />
    <Bar className="mt-2 h-3 w-3/4" />
    <div className="border-borderColor/70 mt-5 space-y-4 border-t pt-4 dark:border-white/10">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Bar className="h-4 w-11/12" />
          <Bar className="h-3 w-24" />
        </div>
      ))}
    </div>
  </Panel>
);

const SectionShell = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={cn(
      'bg-bodyBackground dark:bg-background mx-auto w-full px-6 py-12 md:px-20 md:py-16 lg:py-20',
      className
    )}
  >
    <div className="mx-auto max-w-5xl">{children}</div>
  </section>
);

/** Centered section title placeholder matching `<Title />`. */
const TitleSkeleton = () => <Bar className="mx-auto mb-8 h-7 w-64" />;

/**
 * Stand-in for everything behind the below-the-fold deferred prop group
 * (in focus, policy outreach, latest publications, media, newsletters).
 */
export const BelowTheFoldSkeleton = () => (
  <>
    <SectionShell>
      <TitleSkeleton />
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Bar className="h-5 w-4/5" />
            <Bar className="h-3 w-full" />
          </div>
        ))}
      </div>
    </SectionShell>

    <SectionShell>
      <TitleSkeleton />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-5">
          <Bar className="aspect-video w-full rounded-md" />
          <Bar className="mt-3 h-3 w-24" />
          <Bar className="mt-2 h-6 w-11/12" />
          <Bar className="mt-2 h-3 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-5 md:col-span-7">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Bar className="h-40 w-full rounded-md" />
              <Bar className="mt-2 h-4 w-10/12" />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>

    <SectionShell>
      <TitleSkeleton />
      <PublicationCoversSkeleton />
    </SectionShell>

    <SectionShell>
      <TitleSkeleton />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <OutreachColumnSkeleton label="Loading SAWTEE in media" />
        <OutreachColumnSkeleton label="Loading newsletters" />
      </div>
    </SectionShell>
  </>
);
