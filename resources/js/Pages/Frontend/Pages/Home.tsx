import { Deferred, Link } from '@inertiajs/react';
import { lazy, type ReactNode, Suspense } from 'react';

import ExploreButton from '@/components/Frontend/ExploreButton';
import FeaturedSection from '@/components/Frontend/feature';
import FullWidthCarousel from '@/components/Frontend/FullWidthCarousel';
import WebsiteHead from '@/components/Frontend/Head';
import NewsletterCallout from '@/components/Frontend/NewsletterCallout';
import SimpleList from '@/components/Frontend/SimpleList';
import SvgBackground from '@/components/Frontend/SvgBackground';
import Title from '@/components/Frontend/title';
import { formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type {
  HomePageProps,
  MediaItem,
  Post,
  Publication,
  Slide,
} from '@/types';

function featuredImageUrl(
  media: MediaItem[] | undefined,
  fallback: string
): string {
  return (
    media?.find(item => item.collection_name === 'post-featured-image')
      ?.original_url ?? fallback
  );
}

function postFileMedia(media: MediaItem[] | undefined): MediaItem | undefined {
  return media?.find(item => item.collection_name === 'post-files');
}

const FeaturedPublications = lazy(() =>
  import('@/components/Frontend/FeaturedPublications').then(m => ({
    default: m.FeaturedPublications,
  }))
);
const MultiPostsCarousel = lazy(
  () => import('@/components/Frontend/MultiPostsSlider')
);
const VideoCarousel = lazy(() => import('@/components/Frontend/VideoCarousel'));

const Home = ({
  infocus,
  slides,
  events,
  featuredPublications,
  featuredBlogPosts,
  publications,
  sawteeInMedia,
  newsletters,
  webinars,
  slidesResponsiveImages,
  homePageSections,
  features,
  seo,
}: HomePageProps) => {
  // const [open, setOpen] = useState(true);

  const FeaturedPublicationSectionIsVisible = Boolean(
    homePageSections?.find(h => h.name === 'Featured Publication')?.show
  );

  const lcpImage = slides?.[0]?.media?.[0]?.original_url;
  const lcpSrcSet = slidesResponsiveImages?.[0] || undefined;

  return (
    <>
      <WebsiteHead
        title={
          seo?.title ?? 'South Asia Watch on Trade, Economics and Environment'
        }
        description={
          seo?.description ??
          "Explore South Asia's dynamic journey since the 1980s, navigating global integration and economic challenges."
        }
        image={seo?.image ?? '/assets/logo-sawtee.webp'}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      >
        {lcpImage ? (
          <link
            rel="preload"
            as="image"
            href={lcpImage}
            {...(lcpSrcSet
              ? {
                  imageSrcSet: lcpSrcSet,
                  imageSizes: '(max-width: 1024px) 100vw, 66vw',
                }
              : {})}
          />
        ) : null}
      </WebsiteHead>

      <h1 className="sr-only">
        South Asia Watch on Trade, Economics and Environment (SAWTEE)
      </h1>

      {/* POPUP CODE */}
      {/* <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent className="w-[800px] max-w-[90vw] bg-transparent p-0 shadow-none">
          <Link href="https://sawtee.org/career">
            <img
              src="https://info.sawtee.org/images/Website-02.jpg"
              alt="Warning"
              className="h-auto w-full rounded-md object-contain"
            />
          </Link>
        </DialogContent>
      </Dialog> */}

      <Section className="carousel-section px-4 py-5 md:px-8 md:py-6 lg:px-12 lg:py-6">
        <div
          className={cn(
            'mx-auto grid grid-cols-1 items-center gap-6 lg:gap-8',
            FeaturedPublicationSectionIsVisible && 'lg:grid-cols-12'
          )}
          id="carousel-section"
        >
          <div
            className={cn(
              'min-w-0',
              FeaturedPublicationSectionIsVisible
                ? 'lg:col-span-8'
                : 'lg:col-span-12'
            )}
          >
            {slides &&
            homePageSections?.find(h => h.name === 'Carousel')?.show ? (
              <CarouselSection
                slides={slides}
                slidesResponsiveImages={slidesResponsiveImages}
              />
            ) : null}
          </div>
          {FeaturedPublicationSectionIsVisible && (
            <Deferred
              data={['featuredPublications', 'featuredBlogPosts']}
              fallback={
                <aside className="min-w-0 lg:col-span-4">
                  <div
                    className="border-borderColor/80 dark:bg-bgDarker min-h-112 rounded-md border bg-white px-4 py-6 shadow-sm sm:min-h-128 sm:px-5 sm:py-7"
                    aria-hidden
                  />
                </aside>
              }
            >
              {featuredPublications ? (
                <aside className="min-w-0 lg:col-span-4">
                  <Suspense
                    fallback={
                      <div
                        className="border-borderColor/80 dark:bg-bgDarker min-h-112 rounded-md border bg-white px-4 py-6 shadow-sm sm:min-h-128 sm:px-5 sm:py-7"
                        aria-hidden
                      />
                    }
                  >
                    <FeaturedPublications
                      publications={featuredPublications}
                      blogPosts={featuredBlogPosts}
                    />
                  </Suspense>
                </aside>
              ) : null}
            </Deferred>
          )}
        </div>
      </Section>
      {/* Below-the-fold sections (deferred props) */}
      <Deferred
        data={[
          'infocus',
          'events',
          'publications',
          'sawteeInMedia',
          'newsletters',
          'webinars',
        ]}
        fallback={
          <div className="text-muted-foreground px-4 py-8 text-sm md:px-8 lg:px-12">
            Loading more content…
          </div>
        }
      >
        <>
          {infocus &&
            homePageSections?.find(h => h.name === 'Infocus')?.show && (
              <InfocusSection infocus={infocus} />
            )}

          {events &&
            homePageSections?.find(h => h.name === 'Policy Outreach')?.show && (
              <PolicyOutreachSection events={events} />
            )}

          {publications &&
            homePageSections?.find(h => h.name === 'Latest Publications')
              ?.show && (
              <LatestPublicationSection publications={publications} />
            )}

          <Section className="outreach-section">
            <div className="mx-auto max-w-5xl">
              <Title
                title={
                  sawteeInMedia && newsletters
                    ? 'Media and Newsletter'
                    : sawteeInMedia && !newsletters
                      ? 'Media'
                      : 'Newsletters'
                }
              />
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                {homePageSections?.find(h => h.name === 'Sawtee in Media')
                  ?.show && <MediaSection sawteeInMedia={sawteeInMedia} />}

                {homePageSections?.find(h => h.name === 'Newsletter')?.show && (
                  <NewsletterSection newsletters={newsletters} />
                )}
              </div>
            </div>
          </Section>
          {homePageSections?.find(h => h.name === 'Webinar')?.show && (
            <WebinarSection webinars={webinars} />
          )}
        </>
      </Deferred>

      {features && (
        <Section className="reform-section relative overflow-hidden">
          <SvgBackground
            className="opacity-40 dark:opacity-20"
            svgStyles="dark:text-theme-900 text-theme-100"
          />
          <div className="relative mx-auto max-w-5xl">
            <FeaturedSection features={features} />
          </div>
        </Section>
      )}
      {homePageSections?.find(h => h.name === 'Newsletter Callout')?.show && (
        <NewsletterCalloutSection />
      )}
    </>
  );
};

const Section = ({
  children,
  title,
  className = '',
  dark = false,
}: {
  children?: ReactNode;
  title?: string | null;
  className?: string;
  dark?: boolean;
}) => {
  return (
    <section
      className={cn(
        'dark:bg-background mx-auto w-full px-6 py-12 md:px-20 md:py-16 lg:py-20',
        dark ? 'bg-bgDarker' : 'bg-bodyBackground',
        className
      )}
    >
      {title ? <Title title={title} /> : null}
      {children}
    </section>
  );
};

const FeaturedEventsSection = ({ events }: { events: Post[] }) => {
  const lead = events[0];
  if (!lead) {
    return null;
  }

  return (
    <div className="mb-4 grid grid-cols-1 place-items-start gap-5 md:grid-cols-12">
      <div className="group md:col-span-5">
        <Link href={`/category/featured-events/${lead.slug}`}>
          <div
            className="relative h-60 max-h-60 overflow-hidden rounded-md text-center"
            title={lead.title}
          >
            <div className="ease absolute inset-0 top-0 z-10 hidden h-1.25 w-full bg-sky-500/80 transition-all duration-200 group-hover:block" />
            <div className="ease absolute inset-0 z-20 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-transparent" />
            <img
              src={featuredImageUrl(
                lead.media,
                '/assets/SM-placeholder-1024x512.webp'
              )}
              alt={lead.title}
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full object-cover transition-all duration-200 ease-linear"
            />
          </div>
        </Link>
        <div className="mt-3 flex flex-col justify-between rounded-b leading-normal lg:rounded-r lg:rounded-b-none">
          <div className="">
            <Link
              href={`/category/featured-events/${lead.slug}`}
              className="inline-flex min-h-6 items-center py-1 text-xs font-medium text-sky-700 uppercase transition duration-200 ease-in-out hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
            >
              {lead.category?.name}
            </Link>
            <Link
              href={`/category/featured-events/${lead.slug}`}
              className="text-secondary-foreground mb-2 block text-2xl leading-6 font-bold tracking-wide transition duration-200 ease-in-out group-hover:text-sky-500/80 lg:text-3xl"
            >
              {lead.title}
            </Link>
            {lead.excerpt ? (
              <p
                className="text-muted-foreground mt-2 text-base dark:text-slate-400"
                dangerouslySetInnerHTML={{ __html: lead.excerpt }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:col-span-7">
        {events.map((event, index) => {
          if (index === 0) {
            return null;
          }

          const featured_image = featuredImageUrl(
            event.media,
            '/assets/SM-placeholder-300x150.webp'
          );

          return (
            <div className="group" key={event.id}>
              <Link href={`/category/featured-events/${event.slug}`}>
                <div
                  className="relative h-40 max-h-40 overflow-hidden rounded-md text-center"
                  title={event.title}
                >
                  <img
                    src={featured_image}
                    alt={event.title}
                    width={300}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-all duration-200 ease-linear"
                  />
                  <div className="ease absolute inset-0 top-0 z-10 hidden h-1 w-full bg-sky-500/80 transition-all duration-200 group-hover:block" />
                  <div className="ease absolute inset-0 z-20 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-transparent" />
                </div>
              </Link>
              <Link
                href={`/category/featured-events/${event.slug}`}
                className="text-md text-secondary-foreground my-2 inline-block leading-5 font-semibold tracking-wide transition duration-200 ease-in-out group-hover:text-sky-500/80"
              >
                {event.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

export const CarouselSection = ({
  slides,
  slidesResponsiveImages,
}: {
  slides?: Slide[];
  slidesResponsiveImages?: string[];
}) => {
  return (
    <FullWidthCarousel
      slides={slides}
      responsiveImages={slidesResponsiveImages}
    />
  );
};

export const InfocusSection = ({ infocus = [] }: { infocus?: Post[] }) => {
  return (
    <Section className="infocus-section">
      <div className="mx-auto max-w-5xl">
        <Title title={'In focus'} />
        <SimpleList heading={null}>
          {infocus.map(item => {
            return (
              <li className="mb-6 flex w-full flex-col gap-3" key={item.id}>
                {item.link ? (
                  <a
                    className="underline underline-offset-2 hover:underline-offset-4"
                    href={item.link}
                  >
                    <h3 className="text-secondary-foreground hover:text-secondary-foreground/80 font-serif text-lg font-semibold transition-colors">
                      {item.title}
                    </h3>
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2 hover:underline-offset-4"
                    href={`/category/in-focus/${item.slug}`}
                  >
                    <h3 className="text-secondary-foreground hover:text-secondary-foreground/80 font-serif text-lg font-semibold transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                )}

                {item.excerpt ? (
                  <p
                    className="text-muted-foreground text-sm"
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                ) : null}
              </li>
            );
          })}
        </SimpleList>
        <ExploreButton text="More in focus" link={'/category/in-focus'} />
      </div>
    </Section>
  );
};

export const LatestPublicationSection = ({
  publications = [],
}: {
  publications?: Publication[];
}) => {
  return (
    <Section className="publications-section">
      <div className="mx-auto max-w-5xl">
        <Title title={'Latest in publications'} />
        <Suspense fallback={null}>
          <MultiPostsCarousel data={publications} />
        </Suspense>
        <ExploreButton
          className="mt-8"
          text="More In Publications"
          link={'/category/publications'}
        />
      </div>
    </Section>
  );
};

export const PolicyOutreachSection = ({ events = [] }: { events?: Post[] }) => {
  return (
    <Section>
      <div className="mx-auto max-w-5xl">
        <Title title={'Policy outreach'} />
        <FeaturedEventsSection events={events} />
        <ExploreButton
          text="More in featured events"
          link={'/category/featured-events'}
        />
      </div>
    </Section>
  );
};

export const MediaSection = ({ sawteeInMedia }: { sawteeInMedia?: Post[] }) => {
  if (!sawteeInMedia?.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      <OutreachColumn
        eyebrow="Coverage"
        heading="SAWTEE in media"
        description="Press mentions and commentary featuring SAWTEE’s work across South Asia."
      >
        <ul className="divide-borderColor/60 divide-y dark:divide-white/10">
          {sawteeInMedia.map(item => {
            const hasContent = Boolean(item.content);
            const file = postFileMedia(item.media);
            const titleClass =
              'text-sm font-medium leading-snug text-secondary-foreground transition-colors hover:text-theme-700 dark:hover:text-theme-300 md:text-[0.9375rem]';

            return (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                {file && !hasContent ? (
                  <a
                    href={file.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={titleClass}
                  >
                    {item.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
                {hasContent ? (
                  <Link
                    href={`/category/${item.category?.slug}/${item.slug}`}
                    className={titleClass}
                  >
                    {item.title}
                  </Link>
                ) : null}
                {item.published_at ? (
                  <p className="text-muted-foreground mt-1.5 text-xs tracking-wide">
                    {formatDate(item.published_at)}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </OutreachColumn>
      <ExploreButton
        text="More in SAWTEE in media"
        link="/category/sawtee-in-media"
        className="mt-5"
      />
    </div>
  );
};

/** @deprecated Use MediaSection — kept for any external imports of the old typo name. */
export const MediaSesction = MediaSection;

export const NewsletterSection = ({
  newsletters,
}: {
  newsletters?: Post[];
}) => {
  if (!newsletters?.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      <OutreachColumn
        eyebrow="Updates"
        heading="SAWTEE e-newsletters"
        description="Monthly digests on trade, economics, and environment from the SAWTEE desk."
      >
        <ul className="divide-borderColor/60 divide-y dark:divide-white/10">
          {newsletters.map(item => {
            const file = postFileMedia(item.media);

            return (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                <a
                  className="text-secondary-foreground hover:text-theme-700 dark:hover:text-theme-300 text-sm leading-snug font-medium transition-colors md:text-[0.9375rem]"
                  href={
                    file?.original_url ?? `/category/newsletters/${item.slug}`
                  }
                  target={file?.original_url ? '_blank' : undefined}
                  rel={file?.original_url ? 'noopener noreferrer' : undefined}
                >
                  {item.title}
                  {file?.original_url ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
                {item.published_at ? (
                  <p className="text-muted-foreground mt-1.5 text-xs tracking-wide">
                    {formatDate(item.published_at)}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </OutreachColumn>
      <ExploreButton
        text="More newsletters"
        link="/category/newsletters"
        className="mt-5"
      />
    </div>
  );
};

function OutreachColumn({
  eyebrow,
  heading,
  description,
  children,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="border-borderColor/80 dark:bg-bgDarker rounded-md border bg-white px-5 py-6 shadow-sm sm:px-6 sm:py-7">
      <p className="text-theme-700 dark:text-theme-300 mb-2 font-sans text-[11px] font-semibold tracking-[0.14em] uppercase md:text-xs">
        {eyebrow}
      </p>
      <h3 className="text-secondary-foreground text-lg font-semibold tracking-tight md:text-xl">
        {heading}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-prose text-sm leading-relaxed">
        {description}
      </p>
      <div className="border-borderColor/70 mt-5 border-t pt-1 dark:border-white/10">
        {children}
      </div>
    </div>
  );
}

export const WebinarSection = ({ webinars = [] }: { webinars?: Post[] }) => {
  return (
    <Section className="section videos-section">
      <div className="mx-auto max-w-5xl">
        <Title title="Recordings and resources" />
        <p className="text-muted-foreground mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
          Watch recent webinars and download related materials from SAWTEE’s
          research and dialogue programmes.
        </p>
        <Suspense
          fallback={
            <div
              className="border-borderColor/80 bg-muted/40 aspect-video w-full rounded-md border"
              aria-hidden
            />
          }
        >
          <VideoCarousel posts={webinars} />
        </Suspense>
        <ExploreButton
          className="mt-8"
          text="More recordings and resources"
          link="/category/webinar-series"
        />
      </div>
    </Section>
  );
};

export const NewsletterCalloutSection = () => {
  return (
    <Section className="subscribe-section">
      <NewsletterCallout />
    </Section>
  );
};
