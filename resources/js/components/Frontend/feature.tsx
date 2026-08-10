import { ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { HomeFeature } from '@/types';

export default function FeaturedSection({
  features = undefined,
}: {
  features?: HomeFeature[];
}) {
  if (!features?.length) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-14 md:gap-16 lg:gap-20">
      {features.map((feature, index) => {
        const imageFirst = index % 2 === 1;

        return (
          <article
            key={feature.id}
            className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14"
          >
            <div
              className={cn(
                'flex flex-col justify-center',
                imageFirst ? 'lg:order-2' : 'lg:order-1'
              )}
            >
              <h3 className="text-primary text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                {feature.title}
              </h3>
              <div
                className="from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500 mt-3 h-1 w-14 bg-linear-to-l"
                aria-hidden
              />
              {feature.description ? (
                <p className="text-muted-foreground mt-5 max-w-prose text-sm leading-relaxed md:text-base">
                  {feature.description}
                </p>
              ) : null}
              {feature.link ? (
                <a
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-700 hover:text-theme-600 dark:text-theme-300 dark:hover:text-theme-200 mt-6 inline-flex max-w-max items-center gap-1.5 text-sm font-medium underline underline-offset-4 transition-colors hover:underline-offset-[6px]"
                >
                  Learn more
                  <span className="sr-only">
                    {` about ${feature.title} (opens in a new tab)`}
                  </span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
            </div>

            <div
              className={cn(
                'relative w-full md:block',
                imageFirst ? 'lg:order-1' : 'lg:order-2'
              )}
            >
              {feature.link ? (
                <a
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${feature.title} (opens in a new tab)`}
                  className="group focus-visible:ring-theme-500 relative flex aspect-auto w-full items-center justify-center overflow-hidden rounded-xl p-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <FeatureImage feature={feature} />
                </a>
              ) : (
                <div className="relative flex aspect-auto w-full items-center justify-center overflow-hidden rounded-xl p-0">
                  <FeatureImage feature={feature} />
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function FeatureImage({ feature }: { feature: HomeFeature }) {
  return (
    <>
      {feature.image_src ? (
        <img
          className="h-full w-full rounded-sm object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] lg:rounded-lg"
          src={feature.image_src}
          alt={feature.title}
          loading="lazy"
        />
      ) : null}
      <div
        className="bg-theme-900/0 group-hover:bg-theme-900/10 pointer-events-none absolute inset-0 transition-colors duration-300"
        aria-hidden
      />
    </>
  );
}
