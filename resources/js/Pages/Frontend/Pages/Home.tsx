import { Deferred, Link } from '@inertiajs/react';
import { lazy, type ReactNode, Suspense } from 'react';

import ExploreButton from '@/components/Frontend/ExploreButton';
import FeaturedSection from '@/components/Frontend/feature';
import FullWidthCarousel from '@/components/Frontend/FullWidthCarousel';
import WebsiteHead from '@/components/Frontend/Head';
import {
  BelowTheFoldSkeleton,
  FeaturedPublicationsSkeleton,
  PublicationCoversSkeleton,
  VideoCarouselSkeleton,
} from '@/components/Frontend/HomeSkeletons';
import NewsletterCallout from '@/components/Frontend/NewsletterCallout';
import SimpleList from '@/components/Frontend/SimpleList';
import SvgBackground from '@/components/Frontend/SvgBackground';
import Title from '@/components/Frontend/title';
import { formatDate } from '@/lib/helpers';
import { useSiteCopy } from '@/lib/site-copy';
import { cn } from '@/lib/utils';
import type {
  HomePageProps,
  HomePageSection,
  MediaItem,
  Post,
  Publication,
  Slide,
} from '@/types';

function featuredImageUrl(
  media: MediaItem[] | undefined,
  fallback: string,
  preferPreview = false
): string {
  const item = media?.find(
    mediaItem => mediaItem.collection_name === 'post-featured-image'
  );

  if (!item) {
    return fallback;
  }

  if (preferPreview) {
    return item.preview_url ?? item.original_url ?? fallback;
  }

  return item.original_url ?? item.preview_url ?? fallback;
}

function postFileMedia(media: MediaItem[] | undefined): MediaItem | undefined {
  return media?.find(item => item.collection_name === 'post-files');
}

function sectionByName(
  sections: HomePageSection[] | undefined,
  name: string
): HomePageSection | undefined {
  return sections?.find(section => section.name === name);
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
  const copy = useSiteCopy();
  const featuredPublication = sectionByName(
    homePageSections,
    'Featured Publication'
  );
  const FeaturedPublicationSectionIsVisible = Boolean(
    featuredPublication?.show
  );

  const lcpImage = slides?.[0]?.media?.[0]?.original_url;
  const lcpSrcSet = slidesResponsiveImages?.[0] || undefined;

  return (
    <>
      <WebsiteHead
        title={seo?.title ?? copy.seo.home_title}
        description={seo?.description ?? copy.seo.home_description}
        image={seo?.image ?? copy.seo.default_image}
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

      <h1 className="sr-only">{copy.home.h1}</h1>

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
                  <FeaturedPublicationsSkeleton />
                </aside>
              }
            >
              {featuredPublications ? (
                <aside className="min-w-0 lg:col-span-4">
                  <Suspense fallback={<FeaturedPublicationsSkeleton />}>
                    <FeaturedPublications
                      publications={featuredPublications}
                      blogPosts={featuredBlogPosts}
                      publicationsHeading={featuredPublication?.heading}
                      blogsHeading={
                        featuredPublication?.intro ??
                        copy.home.featured_blogs_heading
                      }
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
        fallback={<BelowTheFoldSkeleton />}
      >
        <>
          {infocus && sectionByName(homePageSections, 'Infocus')?.show && (
            <InfocusSection
              infocus={infocus}
              heading={sectionByName(homePageSections, 'Infocus')?.heading}
              intro={sectionByName(homePageSections, 'Infocus')?.intro}
            />
          )}

          {events &&
            sectionByName(homePageSections, 'Policy Outreach')?.show && (
              <PolicyOutreachSection
                events={events}
                heading={
                  sectionByName(homePageSections, 'Policy Outreach')?.heading
                }
                intro={
                  sectionByName(homePageSections, 'Policy Outreach')?.intro
                }
              />
            )}

          {publications &&
            sectionByName(homePageSections, 'Latest Publications')?.show && (
              <LatestPublicationSection
                publications={publications}
                heading={
                  sectionByName(homePageSections, 'Latest Publications')
                    ?.heading
                }
                intro={
                  sectionByName(homePageSections, 'Latest Publications')?.intro
                }
              />
            )}

          <Section className="outreach-section">
            <div className="mx-auto max-w-5xl">
              <Title
                title={
                  sawteeInMedia && newsletters
                    ? copy.home.media_and_newsletter_heading
                    : sawteeInMedia && !newsletters
                      ? copy.home.media_heading
                      : copy.home.newsletters_heading
                }
              />
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                {sectionByName(homePageSections, 'Sawtee in Media')?.show && (
                  <MediaSection
                    sawteeInMedia={sawteeInMedia}
                    heading={
                      sectionByName(homePageSections, 'Sawtee in Media')
                        ?.heading
                    }
                    intro={
                      sectionByName(homePageSections, 'Sawtee in Media')?.intro
                    }
                    eyebrow={copy.home.media_eyebrow}
                  />
                )}

                {sectionByName(homePageSections, 'Newsletter')?.show && (
                  <NewsletterSection
                    newsletters={newsletters}
                    heading={
                      sectionByName(homePageSections, 'Newsletter')?.heading
                    }
                    intro={sectionByName(homePageSections, 'Newsletter')?.intro}
                    eyebrow={copy.home.newsletter_eyebrow}
                  />
                )}
              </div>
            </div>
          </Section>
          {sectionByName(homePageSections, 'Webinar')?.show && (
            <WebinarSection
              webinars={webinars}
              heading={sectionByName(homePageSections, 'Webinar')?.heading}
              intro={sectionByName(homePageSections, 'Webinar')?.intro}
            />
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
      {sectionByName(homePageSections, 'Newsletter Callout')?.show && (
        <NewsletterCalloutSection
          heading={
            sectionByName(homePageSections, 'Newsletter Callout')?.heading
          }
          intro={sectionByName(homePageSections, 'Newsletter Callout')?.intro}
        />
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
            className="bg-muted relative aspect-video w-full overflow-hidden rounded-md text-center"
            title={lead.title}
          >
            <div className="ease bg-theme-500/80 absolute inset-0 top-0 z-10 hidden h-1.25 w-full transition-all duration-200 group-hover:block" />
            <div className="ease absolute inset-0 z-20 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-transparent" />
            <img
              src={featuredImageUrl(
                lead.media,
                '/assets/SM-placeholder-1024x512.webp'
              )}
              alt={lead.title}
              width={960}
              height={540}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-200 ease-linear"
            />
          </div>
        </Link>
        <div className="mt-3 flex flex-col justify-between rounded-b leading-normal lg:rounded-r lg:rounded-b-none">
          <div className="">
            <Link
              href={`/category/featured-events/${lead.slug}`}
              className="text-theme-700 hover:text-theme-800 dark:text-theme-300 dark:hover:text-theme-200 inline-flex min-h-6 items-center py-1 text-xs font-medium uppercase transition duration-200 ease-in-out"
            >
              {lead.category?.name}
            </Link>
            <Link
              href={`/category/featured-events/${lead.slug}`}
              className="text-secondary-foreground group-hover:text-theme-500/80 mb-2 block text-2xl leading-6 font-bold tracking-wide transition duration-200 ease-in-out lg:text-3xl"
            >
              {lead.title}
            </Link>
            {lead.excerpt ? (
              <p
                className="text-muted-foreground dark:text-muted-foreground mt-2 text-base"
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
            '/assets/SM-placeholder-300x150.webp',
            true
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
                  <div className="ease bg-theme-500/80 absolute inset-0 top-0 z-10 hidden h-1 w-full transition-all duration-200 group-hover:block" />
                  <div className="ease absolute inset-0 z-20 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-transparent" />
                </div>
              </Link>
              <Link
                href={`/category/featured-events/${event.slug}`}
                className="text-md text-secondary-foreground group-hover:text-theme-500/80 my-2 inline-block leading-5 font-semibold tracking-wide transition duration-200 ease-in-out"
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

export const InfocusSection = ({
  infocus = [],
  heading,
  intro,
}: {
  infocus?: Post[];
  heading?: string | null;
  intro?: string | null;
}) => {
  return (
    <Section className="infocus-section">
      <div className="mx-auto max-w-5xl">
        <Title title={heading || 'In focus'} />
        {intro ? (
          <p className="text-muted-foreground -mt-4 mb-8 max-w-2xl text-sm leading-relaxed md:-mt-5 md:text-base">
            {intro}
          </p>
        ) : null}
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
  heading,
  intro,
}: {
  publications?: Publication[];
  heading?: string | null;
  intro?: string | null;
}) => {
  return (
    <Section className="publications-section">
      <div className="mx-auto max-w-5xl">
        <Title title={heading || 'Latest in publications'} />
        {intro ? (
          <p className="text-muted-foreground -mt-4 mb-8 max-w-2xl text-sm leading-relaxed md:-mt-5 md:text-base">
            {intro}
          </p>
        ) : null}
        <Suspense fallback={<PublicationCoversSkeleton />}>
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

export const PolicyOutreachSection = ({
  events = [],
  heading,
  intro,
}: {
  events?: Post[];
  heading?: string | null;
  intro?: string | null;
}) => {
  return (
    <Section>
      <div className="mx-auto max-w-5xl">
        <Title title={heading || 'Policy outreach'} />
        {intro ? (
          <p className="text-muted-foreground -mt-4 mb-8 max-w-2xl text-sm leading-relaxed md:-mt-5 md:text-base">
            {intro}
          </p>
        ) : null}
        <FeaturedEventsSection events={events} />
        <ExploreButton
          text="More in featured events"
          link={'/category/featured-events'}
        />
      </div>
    </Section>
  );
};

export const MediaSection = ({
  sawteeInMedia,
  heading,
  intro,
  eyebrow,
}: {
  sawteeInMedia?: Post[];
  heading?: string | null;
  intro?: string | null;
  eyebrow?: string;
}) => {
  if (!sawteeInMedia?.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      <OutreachColumn
        eyebrow={eyebrow || 'Coverage'}
        heading={heading || 'SAWTEE in media'}
        description={
          intro ||
          'Press mentions and commentary featuring SAWTEE’s work across South Asia.'
        }
      >
        <ul className="divide-borderColor/60 divide-y dark:divide-white/10">
          {sawteeInMedia.map(item => {
            const hasContent = item.has_content ?? Boolean(item.content);
            const file = postFileMedia(item.media);
            const titleClass =
              'text-sm font-medium leading-snug text-secondary-foreground transition-colors hover:text-theme-700 dark:hover:text-theme-300 md:text-fine';

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
  heading,
  intro,
  eyebrow,
}: {
  newsletters?: Post[];
  heading?: string | null;
  intro?: string | null;
  eyebrow?: string;
}) => {
  if (!newsletters?.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      <OutreachColumn
        eyebrow={eyebrow || 'Updates'}
        heading={heading || 'SAWTEE e-newsletters'}
        description={
          intro ||
          'Monthly digests on trade, economics, and environment from the SAWTEE desk.'
        }
      >
        <ul className="divide-borderColor/60 divide-y dark:divide-white/10">
          {newsletters.map(item => {
            const file = postFileMedia(item.media);

            return (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                <a
                  className="text-secondary-foreground hover:text-theme-700 dark:hover:text-theme-300 md:text-fine text-sm leading-snug font-medium transition-colors"
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
      <p className="text-theme-700 dark:text-theme-300 tracking-kicker mb-2 font-sans text-xs font-semibold uppercase md:text-xs">
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

export const WebinarSection = ({
  webinars = [],
  heading,
  intro,
}: {
  webinars?: Post[];
  heading?: string | null;
  intro?: string | null;
}) => {
  return (
    <Section className="section videos-section">
      <div className="mx-auto max-w-5xl">
        <Title title={heading || 'Recordings and resources'} />
        <p className="text-muted-foreground mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
          {intro ||
            'Watch recent webinars and download related materials from SAWTEE’s research and dialogue programmes.'}
        </p>
        <Suspense fallback={<VideoCarouselSkeleton />}>
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

export const NewsletterCalloutSection = ({
  heading,
  intro,
}: {
  heading?: string | null;
  intro?: string | null;
}) => {
  return (
    <Section className="subscribe-section">
      <NewsletterCallout heading={heading} intro={intro} />
    </Section>
  );
};
