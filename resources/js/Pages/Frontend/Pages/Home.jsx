import ExploreButton from '@/components/Frontend/ExploreButton';
import { FeaturedPublications } from '@/components/Frontend/FeaturedPublications';
import FullWidthCarousel from '@/components/Frontend/FullWidthCarousel';
import WebsiteHead from '@/components/Frontend/Head';
import MultiPostsCarousel from '@/components/Frontend/MultiPostsSlider';
import NewsletterCallout from '@/components/Frontend/NewsletterCallout';
import Particles from '@/components/Frontend/Particles';
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

const Home = ({
  infocus,
  slides,
  events,
  featuredPublications,
  publications,
  sawteeInMedia,
  newsletters,
  webinars,
  slidesResponsiveImages,
  homePageSections,
}) => {
  const features = [
    // {
    //   id: '1',
    //  title: 'Reform Monitoring Platform',
    //  image_src: '/assets/Policy-Reform-Banner-green-sized.webp',
    //  link: '/reform-monitoring-platform',
    //  description:
    //    'The Reform Monitoring Platform intends to strengthen monitoring and evaluation of the policy reform process through an online reform tracking system to increase transparency, inclusiveness, and accountability of trade and investment related reforms.',
    // },
    {
      id: '2',
      title: 'Media fellowship',
      image_src: '/assets/Media-Fellowship-banner.webp',
      link: '/media-fellows',
      description:
        'SAWTEE is delighted to announce an exciting fellowship opportunity for journalists in Nepal. This fellowship presents a unique opportunity for journalists to deepen their knowledge, expand their network, and contribute to the public’s understanding of critical issues at the intersection of trade and climate change.',
    },
    {
      id: '3',
      title: 'COVID-19 resources',
      image_src: '/assets/COVID-19-South-Asia-and-LDCs.webp',
      link: '/category/covid',
      description:
        "Between 2020 and 2021, COVID-19 pandemic affected the social, economic and well-being of people worldwide. SAWTEE undertook activities that provided evidence-based insights and expert perspectives to help understand the pandemic and its impacts. Explore SAWTEE's curated collection of works related to the COVID-19 pandemic, including articles, reports and recorded webinars that examined the health impacts of the pandemic, along with lessons for future resilience and preparedness.",
    },

    // {
    //  id: '4',
    //  title: "Advancing LDC's Trade Interests",
    //  image_src: '/assets/advancing-ldc_upscaled.webp',
    //  link: '/advancing-ldcs’-interests-in-the-wto-strengthening-participation,-securing-priorities',
    //  description:
    //    'This project seeks to undertake a range of activities towards strengthened participation of the LDCs in the WTO by addressing their felt-demands by pursuing a multi-pronged implementation strategy in view of the proposed project. ',
    // },
  ];

  const FeaturedPublicationSectionIsVisible = homePageSections?.find(
    h => h.name === 'Featured Publication'
  );

  return (
    <MainLayout>
      <WebsiteHead
        title={'Home'}
        description="Explore South Asia's dynamic journey since the 1980s, navigating global integration and economic challenges."
        image={'/assets/logo-sawtee.webp'}
      />
      <Section py={4} className="px-6 carousel-section lg:py-4">
        <div
          className={cn(
            'grid grid-cols-1 gap-10',
            FeaturedPublicationSectionIsVisible?.show === 1 &&
              'mx-auto lg:grid-cols-6'
          )}
          id="carousel-section"
        >
          <div className="overflow-hidden rounded-md shadow-xl place-self-center lg:col-span-4">
            {/* Carousel Section */}
            {slides &&
            homePageSections?.find(h => h.name === 'Carousel')?.show ? (
              <CarouselSection
                slides={slides}
                slidesResponsiveImages={slidesResponsiveImages}
              />
            ) : null}
          </div>
          {/* Featured Publication Section */}
          {featuredPublications &&
            FeaturedPublicationSectionIsVisible?.show === 1 && (
              <div
                className={
                  slides
                    ? 'self-center lg:col-span-2'
                    : 'self-end lg:col-span-2'
                }
              >
                <FeaturedPublications publications={featuredPublications} />
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
        <section className="reform-section dark:bg-gray-900">
          <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8 lg:py-20">
            <SvgBackground svgStyles={'dark:text-gray-800'} />
            <Particles className="absolute inset-0 pointer-events-none" />
            <div className="relative mx-auto max-w-9xl">
              <FeaturedSection features={features} />
            </div>
          </div>
        </section>
      )}
      <Section className="outreach-section">
        <div className="max-w-5xl mx-auto">
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

const Section = ({ children, title = null, className, dark }) => {
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

const FeaturedEventsSection = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-5 mb-4 place-items-start md:grid-cols-12">
      <div className="group md:col-span-5">
        <Link href={`/category/featured-events/${events[0].slug}`}>
          <div
            className="relative overflow-hidden text-center rounded-md"
            title={events[0].title}
          >
            <div className="ease absolute inset-0 top-0 z-10 hidden h-[5px] w-full bg-sky-500/80 transition-all duration-200 group-hover:block" />
            <div className="absolute inset-0 z-20 w-full h-full transition-all duration-200 ease bg-black/20 group-hover:bg-transparent" />
            <img
              src={
                events[0].media.filter(
                  item => item.collection_name === 'post-featured-image'
                )[0]?.original_url
              }
              alt="event cover"
              loading="lazy"
              className="object-cover w-full transition-all duration-500 ease-linear aspect-video"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between mt-3 leading-normal rounded-b lg:rounded-b-none lg:rounded-r">
          <div className="">
            <Link
              href={`/category/featured-events/${events[0].slug}`}
              className="text-xs font-medium uppercase transition duration-500 ease-in-out text-sky-500 hover:text-sky-600"
            >
              {events[0].category.name}
            </Link>
            <Link
              href={`/category/featured-events/${events[0].slug}`}
              className="block mb-2 text-2xl font-bold leading-6 tracking-wide transition duration-500 ease-in-out text-secondary-foreground group-hover:text-sky-500/80 lg:text-3xl"
            >
              {events[0].title}
            </Link>
            <p className="mt-2 text-base text-muted-foreground dark:text-slate-400" dangerouslySetInnerHTML={{__html: events[0]?.excerpt}} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:col-span-7">
        {events.map((event, index) => {
          const featured_image =
            event.media.length > 0
              ? event.media.filter(
                  item => item.collection_name === 'post-featured-image'
                )[0]?.original_url
              : '/assets/SM-placeholder-150x150.png';
          return (
            index !== 0 && (
              <div className="group" key={event.id}>
                <Link href={`/category/featured-events/${event.slug}`}>
                  <div
                    className="relative overflow-hidden text-center rounded-md max-h-40"
                    title={event.title}
                  >
                    <img
                      src={featured_image}
                      alt="event cover"
                      loading="lazy"
                      className="object-cover w-full h-full transition-all duration-500 ease-linear aspect-square"
                    />
                    <div className="absolute inset-0 top-0 z-10 hidden w-full h-1 transition-all duration-200 ease bg-sky-500/80 group-hover:block" />
                    <div className="absolute inset-0 z-20 w-full h-full transition-all duration-200 ease bg-black/20 group-hover:bg-transparent" />
                  </div>
                </Link>
                <Link
                  href={`/category/featured-events/${event.slug}`}
                  className="inline-block my-2 font-semibold leading-5 tracking-wide transition duration-500 ease-in-out text-md text-secondary-foreground group-hover:text-sky-500/80"
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

export const CarouselSection = ({ slides, slidesResponsiveImages }) => {
  return (
      <FullWidthCarousel
        slides={slides}
        responsiveImages={slidesResponsiveImages}
      />

  );
};

export const InfocusSection = ({ infocus }) => {
  return (
    <Section className="infocus-section">
      <div className="max-w-5xl mx-auto">
        <Title title={'In focus'} />
        <SimpleList heading={null}>
          {infocus.map(item => {
            return (
              <li className="flex flex-col w-full gap-3 mb-6" key={item.id}>
                <Link
                  className="underline underline-offset-2 hover:underline-offset-4"
                  target="_blank"
                  href={`/category/in-focus/${item.slug}`}
                >
                  <h3 className="font-sans text-lg font-semibold text-secondary-foreground hover:text-secondary-foreground/80">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{__html: item.excerpt}} />
              </li>
            );
          })}
        </SimpleList>
        <ExploreButton text="More in focus" link={'/category/in-focus'} />
      </div>
    </Section>
  );
};

export const LatestPublicationSection = ({ publications }) => {
  return (
    <Section className="publications-section">
      <div className="max-w-5xl mx-auto">
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

export const PolicyOutreachSection = ({ events }) => {
  return (
    <Section>
      <div className="max-w-5xl mx-auto">
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

export const MediaSesction = ({ sawteeInMedia }) => {
  return (
    <div className="w-full md:col-span-3">
      <SimpleList heading={'sawtee in media'}>
        {sawteeInMedia.map(item => {
          const hasContent = item.content !== null || '';
          const file = item.media?.filter(
            media => media.collection_name === 'post-files'
          )[0];

          return (
            <li className="mb-4 group" key={item.id}>
              <div>
                {file && !hasContent && (
                  <a
                    href={file?.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm leading-5 underline md:text-md text-secondary-foreground underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg"
                  >
                    {item.title}
                  </a>
                )}
                {hasContent && (
                  <Link
                    href={`/category/${item.category.slug}/${item.slug}`}
                    className="text-sm leading-5 underline md:text-md text-secondary-foreground underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg"
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
        size={['xs', 'sm']}
        text="More in SAWTEE in media "
        link={'/category/sawtee-in-media'}
      />
    </div>
  );
};

export const NewsletterSection = ({ newsletters }) => {
  return (
    <div className="md:col-span-3">
      <SimpleList
        heading={'SAWTEE e-newsletters'}
        className={'relative flex w-full flex-col'}
      >
        {newsletters.map(item => {
          const file = item.media.filter(
            m => m.collection_name === 'post-files'
          )[0];
          return (
            <li key={item.id}>
              <ListItem>
                <a
                  className="font-sans text-sm leading-5 underline md:text-md text-secondary-foreground underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg"
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
        size="sm"
        text="More newsletters"
        link={'/category/newsletters'}
      />
    </div>
  );
};

export const WebinarSection = ({ webinars }) => {
  return (
    <Section className="section videos-section">
      <div className="max-w-5xl mx-auto">
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
