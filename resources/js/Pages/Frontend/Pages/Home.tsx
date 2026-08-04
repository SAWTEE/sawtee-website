import type { HomePageProps } from '@/types';
import ExploreButton from '@/components/Frontend/ExploreButton';
import { FeaturedPublications } from '@/components/Frontend/FeaturedPublications';
import FullWidthCarousel from '@/components/Frontend/FullWidthCarousel';
import WebsiteHead from '@/components/Frontend/Head';
import MultiPostsCarousel from '@/components/Frontend/MultiPostsSlider';
import NewsletterCallout from '@/components/Frontend/NewsletterCallout';
import SimpleList from '@/components/Frontend/SimpleList';
import SvgBackground from '@/components/Frontend/SvgBackground';
import VideoCarousel from '@/components/Frontend/VideoCarousel';
import FeaturedSection from '@/components/Frontend/feature';
import Title from '@/components/Frontend/title';
import ListItem from '@/components/shared/ListItem';
import { formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import MainLayout from '../../../components/Layouts/MainLayout';
import { features } from '@/lib/data';

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
  seo,
}: HomePageProps) => {
  // const [open, setOpen] = useState(true);

  const FeaturedPublicationSectionIsVisible = homePageSections?.find(
    h => h.name === 'Featured Publication'
  );

  return (
    <MainLayout>
      <WebsiteHead
        title={seo?.title ?? 'Home'}
        description={
          seo?.description ??
          "Explore South Asia's dynamic journey since the 1980s, navigating global integration and economic challenges."
        }
        image={seo?.image ?? '/assets/logo-sawtee.webp'}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />

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

      <Section className="carousel-section py-8 md:py-10">
        <div
          className={cn(
            'mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-8 lg:gap-10',
            FeaturedPublicationSectionIsVisible?.show === 1 && 'lg:grid-cols-6'
          )}
          id="carousel-section"
        >
          <div className="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10 lg:col-span-4">
            {slides &&
            homePageSections?.find(h => h.name === 'Carousel')?.show ? (
              <CarouselSection
                slides={slides}
                slidesResponsiveImages={slidesResponsiveImages}
              />
            ) : null}
          </div>
          {featuredPublications &&
            FeaturedPublicationSectionIsVisible?.show === 1 && (
              <div
                className={
                  slides
                    ? 'self-stretch lg:col-span-2'
                    : 'self-end lg:col-span-2'
                }
              >
                <FeaturedPublications
                  publications={featuredPublications}
                  blogPosts={featuredBlogPosts}
                />
              </div>
            )}
        </div>
      </Section>
      {/* Infocus Section */}
      {infocus && homePageSections?.find(h => h.name === 'Infocus')?.show && (
        <InfocusSection infocus={infocus} />
      )}

      {/* Events Section */}
      {events &&
        homePageSections?.find(h => h.name === 'Policy Outreach')?.show && (
          <PolicyOutreachSection events={events} />
        )}

      {/* Add publication section here  */}
      {publications &&
        homePageSections?.find(h => h.name === 'Latest Publications')?.show && (
          <LatestPublicationSection publications={publications} />
        )}

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
          <div className="grid gap-10 lg:grid-cols-6">
            {homePageSections?.find(h => h.name === 'Sawtee in Media')
              ?.show && <MediaSesction sawteeInMedia={sawteeInMedia} />}

            {homePageSections?.find(h => h.name === 'Newsletter')?.show && (
              <NewsletterSection newsletters={newsletters} />
            )}
          </div>
        </div>
      </Section>
      {homePageSections?.find(h => h.name === 'Webinar')?.show && (
        <WebinarSection webinars={webinars} />
      )}
      {homePageSections?.find(h => h.name === 'Newsletter Callout')?.show && (
        <NewsletterCalloutSection />
      )}
    </MainLayout>
  );
};

const Section = ({ children = undefined, title = null, className = '', dark = undefined }: any) => {
  return (
    <section
      className={cn(
        'mx-auto w-full px-6 py-12 dark:bg-background md:px-20 md:py-20',
        dark ? 'bg-bgDarker' : 'bg-bodyBackground',
        className
      )}
    >
      {title && <Title title={title} />}
      {children}
    </section>
  );
};

const FeaturedEventsSection = ({ events = undefined }: any) => {
  return (
    <div className="mb-4 grid grid-cols-1 place-items-start gap-5 md:grid-cols-12">
      <div className="group md:col-span-5">
        <Link href={`/category/featured-events/${events[0].slug}`}>
          <div
            className="relative h-60 max-h-60 overflow-hidden rounded-md text-center"
            title={events[0].title}
          >
            <div className="ease absolute inset-0 top-0 z-10 hidden h-[5px] w-full bg-sky-500/80 transition-all duration-200 group-hover:block" />
            <div className="ease absolute inset-0 z-20 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-transparent" />
            <img
              src={
                events[0].media.filter(
                  // @ts-ignore allowlist-migration
                  item => item.collection_name === 'post-featured-image'
                )[0]?.original_url ??
                `https://placehold.co/600x400/eee/000/webp?text=No+Image`
              }
              alt={events[0].title}
              loading="lazy"
              className="aspect-video w-full object-cover transition-all duration-200 ease-linear"
            />
          </div>
        </Link>
        <div className="mt-3 flex flex-col justify-between rounded-b leading-normal lg:rounded-b-none lg:rounded-r">
          <div className="">
            <Link
              href={`/category/featured-events/${events[0].slug}`}
              className="text-xs font-medium uppercase text-sky-500 transition duration-200 ease-in-out hover:text-sky-600"
            >
              {events[0].category.name}
            </Link>
            <Link
              href={`/category/featured-events/${events[0].slug}`}
              className="mb-2 block text-2xl font-bold leading-6 tracking-wide text-secondary-foreground transition duration-200 ease-in-out group-hover:text-sky-500/80 lg:text-3xl"
            >
              {events[0].title}
            </Link>
            <p
              className="mt-2 text-base text-muted-foreground dark:text-slate-400"
              dangerouslySetInnerHTML={{ __html: events[0]?.excerpt }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:col-span-7">
        {events.map((event: any, index: any) => {
          const featured_image =
            event.media.length > 0
              ? (event.media.filter(
                  // @ts-ignore allowlist-migration
                  item => item.collection_name === 'post-featured-image'
                )[0]?.original_url ??
                `https://placehold.co/300x160/eee/000/webp?text=No+Image`)
              : `https://placehold.co/300x160/eee/000/webp?text=No+Image`;

          return (
            index !== 0 && (
              <div className="group" key={event.id}>
                <Link href={`/category/featured-events/${event.slug}`}>
                  <div
                    className="relative h-40 max-h-40 overflow-hidden rounded-md text-center"
                    title={event.title}
                  >
                    <img
                      src={featured_image}
                      alt={event.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-all duration-200 ease-linear"
                    />
                    <div className="ease absolute inset-0 top-0 z-10 hidden h-1 w-full bg-sky-500/80 transition-all duration-200 group-hover:block" />
                    <div className="ease absolute inset-0 z-20 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-transparent" />
                  </div>
                </Link>
                <Link
                  href={`/category/featured-events/${event.slug}`}
                  className="text-md my-2 inline-block font-semibold leading-5 tracking-wide text-secondary-foreground transition duration-200 ease-in-out group-hover:text-sky-500/80"
                >
                  {event.title}
                </Link>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Home;

export const CarouselSection = ({ slides = undefined, slidesResponsiveImages = undefined }: any) => {
  return (
    <FullWidthCarousel
      slides={slides}
      responsiveImages={slidesResponsiveImages}
    />
  );
};
{
  /*infocus code chnages for external link from home pages  */
}
export const InfocusSection = ({ infocus = undefined }: any) => {
  return (
    <Section className="infocus-section">
      <div className="mx-auto max-w-5xl">
        <Title title={'In focus'} />
        <SimpleList heading={null}>
          {infocus.map((item: any) => {
            return (
              <li className="mb-6 flex w-full flex-col gap-3" key={item.id}>
                {/* मुख्य परिवर्तन यहाँ छ: 'item.link' छ कि छैन भनेर चेक गर्ने */}
                {item.link ? (
                  <a
                    className="underline underline-offset-2 hover:underline-offset-4"
                    href={item.link}
                  >
                    <h3 className="font-sans text-lg font-semibold text-secondary-foreground transition-colors hover:text-secondary-foreground/80">
                      {item.title}
                    </h3>
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2 hover:underline-offset-4"
                    href={`/category/in-focus/${item.slug}`}
                  >
                    <h3 className="font-sans text-lg font-semibold text-secondary-foreground transition-colors hover:text-secondary-foreground/80">
                      {item.title}
                    </h3>
                  </Link>
                )}

                <p
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: item.excerpt }}
                />
              </li>
            );
          })}
        </SimpleList>
        <ExploreButton text="More in focus" link={'/category/in-focus'} />
      </div>
    </Section>
  );
};

export const LatestPublicationSection = ({ publications = undefined }: any) => {
  return (
    <Section className="publications-section">
      <div className="mx-auto max-w-5xl">
        <Title title={'Latest in publications'} />
        <MultiPostsCarousel
          link={'/category/publications'}
          text={'More in publications'}
          data={publications}
        />
        <ExploreButton
          className="mt-8"
          text="More In Publications"
          link={'/category/publications'}
        />
      </div>
    </Section>
  );
};

export const PolicyOutreachSection = ({ events = undefined }: any) => {
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

export const MediaSesction = ({ sawteeInMedia = undefined }: any) => {
  return (
    <div className="w-full md:col-span-3">
      <SimpleList heading={'SAWTEE in media'}>
        {sawteeInMedia.map((item: any) => {
          const hasContent = item.content !== null || '';
          const file = item.media?.filter(
            // @ts-ignore allowlist-migration
            media => media.collection_name === 'post-files'
          )[0];

          return (
            <li className="group mb-4" key={item.id}>
              <div>
                {file && !hasContent && (
                  <a
                    href={file?.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="md:text-md text-sm leading-5 text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg"
                  >
                    {item.title}
                  </a>
                )}
                {hasContent && (
                  <Link
                    href={`/category/${item.category.slug}/${item.slug}`}
                    className="md:text-md text-sm leading-5 text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg"
                  >
                    {item.title}
                  </Link>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(item.published_at)}
                </p>
              </div>
            </li>
          );
        })}
      </SimpleList>
      <ExploreButton
        // @ts-ignore allowlist-migration
        size={['xs', 'sm']}
        text="More in SAWTEE in media "
        link={'/category/sawtee-in-media'}
      />
    </div>
  );
};

export const NewsletterSection = ({ newsletters = undefined }: any) => {
  return (
    <div className="md:col-span-3">
      <SimpleList
        heading={'SAWTEE e-newsletters'}
        className={'relative flex w-full flex-col'}
      >
        {newsletters.map((item: any) => {
          const file = item.media.filter(
            // @ts-ignore allowlist-migration
            m => m.collection_name === 'post-files'
          )[0];
          return (
            <li key={item.id}>
              <ListItem>
                <a
                  className="md:text-md font-sans text-sm leading-5 text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg"
                  href={file?.original_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              </ListItem>
            </li>
          );
        })}
      </SimpleList>

      <ExploreButton
        // @ts-ignore allowlist-migration
        size="sm"
        text="More newsletters"
        link={'/category/newsletters'}
      />
    </div>
  );
};

export const WebinarSection = ({ webinars = undefined }: any) => {
  return (
    <Section className="section videos-section">
      <div className="mx-auto max-w-5xl">
        <Title title={'Recordings and resources'} />
        <VideoCarousel posts={webinars} />
        <ExploreButton
          className="mt-8"
          text="More In Recordings and resources"
          link={'/category/webinar-series'}
        />
      </div>
    </Section>
  );
};

export const NewsletterCalloutSection = () => {
  return (
    <Section
      py={{ base: '6', md: '12', lg: '16' }}
      px={{ base: '10', md: '16', lg: '20' }}
      className="subscribe-section"
    >
      <NewsletterCallout />
    </Section>
  );
};
