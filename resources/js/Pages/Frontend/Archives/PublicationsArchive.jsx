import Glassbox from '@/components/Frontend/Glassbox';
import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import SidebarWidget from '@/components/Frontend/sidebarWidget';
import SubscriptionCard from '@/components/Frontend/subscriptionCard';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import React from 'react';
import MainLayout from '../../../components/Layouts/MainLayout';
import PageLayout from '../../../components/Layouts/PageLayout';

export default function PublicationsArchive({
  category,
  infocus,
  sawteeInMedia,
  publications,
  showSubscriptionBox = true,
  featured_image,
  srcSet,
}) {
  return (
    <MainLayout>
      <WebsiteHead
        title={category.meta_title ? category.meta_title : category.name}
        description={category.meta_description}
        image={
          featured_image
            ? featured_image.original_url
            : '/assets/logo-sawtee.webp'
        }
      />
      <PageLayout
        featured_image={featured_image}
        srcSet={srcSet}
        title={category.name}
        showBackgroundPattern={false}
      >
        <Section className={'mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20'}>
          <div className="grid place-content-center gap-10 md:grid-cols-4 xl:grid-cols-6">
            <section className="archive-list md:col-span-2 xl:col-span-4">
              <ItemsList
                items={category.children}
                publications={publications}
              />
            </section>

            <aside className="sidebar flex flex-col items-center gap-12 md:col-span-2">
              {sawteeInMedia && (
                <SidebarWidget
                  array={sawteeInMedia}
                  title={'SAWTEE in Media'}
                  link={'/category/sawtee-in-media'}
                />
              )}
              {infocus && (
                <SidebarWidget
                  array={infocus}
                  title={'Infocus'}
                  link={'/category/in-focus'}
                />
              )}

              {showSubscriptionBox && (
                <Glassbox className={'w-full p-0'}>
                  <SubscriptionCard />
                </Glassbox>
              )}
            </aside>
          </div>
        </Section>
      </PageLayout>
    </MainLayout>
  );
}

const ItemComponent = ({ item, publications, className }) => {
  return (
    <div className={cn('w-full', className)} key={item.name}>
      <h3 className="pb-8 text-2xl lg:text-3xl" id={item.name}>
        <Link
          className="underline"
          title={`Explore ${item.name}`}
          href={`/category/publications/${item.slug}`}
        >
          {item.name}
        </Link>
      </h3>
      {publications[item.slug] && publications[item.slug].length > 0 && (
        <div className="grid grid-cols-4 gap-6">
          {publications[item.slug].map(publication => {
            return (
              <div key={publication.id}>
                <article className="article mx-auto max-w-[140px] overflow-hidden rounded-md">
                  <a
                    href={
                      publication.file
                        ? `/publications/${publication.file?.name}`
                        : '#'
                    }
                    className="group relative"
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <div className="absolute left-0 top-0 h-full w-full bg-black/10 bg-blend-overlay group-hover:bg-transparent" />

                    <img
                      className="aspect-[3/4] h-full w-full rounded-md object-cover"
                      src={
                        `${publication.media[0]?.original_url}` ||
                        '/assets/SM-placeholder-150x150.png'
                      }
                      alt={publication.title}
                      title={publication.title}
                      loading="lazy"
                    />
                  </a>
                </article>
                {publication.title && (
                  <a
                    className="underline"
                    target="_blank"
                    href={`/publications/${publication.file?.name}`}
                  >
                    <p className="mt-4 text-center text-sm font-semibold">
                      {publication.title}
                    </p>
                    {publication.subtitle && (
                      <p className="mt-1 text-center text-xs">
                        {publication.subtitle}
                      </p>
                    )}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
      {item.children && item.children.length > 0 && (
        <React.Fragment key={item.id}>
          <ItemsList
            items={item.children}
            publications={publications}
            className="ml-4 pt-0"
          />
        </React.Fragment>
      )}
    </div>
  );
};

// Main component that receives the data
const ItemsList = ({ items, publications, className }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <React.Fragment key={item.id}>
          <ItemComponent
            className={className}
            item={item}
            publications={publications}
          />
          {i < items.length - 1 && (
            <Separator className="my-12 border-t-4 border-bgDarker" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
