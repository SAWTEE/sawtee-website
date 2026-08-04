import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

type Feature = {
  id: string | number;
  title: string;
  description?: string;
  image_src?: string;
  link?: string;
};

export default function FeaturedSection({
  features = undefined,
}: {
  features?: Feature[];
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
              <h3 className="text-xl font-bold tracking-tight text-primary md:text-2xl lg:text-3xl">
                {feature.title}
              </h3>
              <div
                className="mt-3 h-1 w-14 bg-gradient-to-l from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500"
                aria-hidden
              />
              {feature.description ? (
                <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                  {feature.description}
                </p>
              ) : null}
              {feature.link ? (
                <a
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex max-w-max items-center gap-1.5 text-sm font-medium text-theme-700 underline underline-offset-4 transition-colors hover:text-theme-600 hover:underline-offset-[6px] dark:text-theme-300 dark:hover:text-theme-200"
                >
                  Learn more
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
            </div>

            <div
              className={cn(
                'relative w-full',
                imageFirst ? 'lg:order-1' : 'lg:order-2'
              )}
            >
              {feature.link ? (
                <a
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${feature.title} (opens in a new tab)`}
                  className="group relative block overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-500 focus-visible:ring-offset-2"
                >
                  <FeatureImage feature={feature} />
                </a>
              ) : (
                <div className="overflow-hidden rounded-md">
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

function FeatureImage({ feature }: { feature: Feature }) {
  return (
    <>
      <div className="aspect-[16/10] w-full overflow-hidden bg-bgDarker">
        {feature.image_src ? (
          <img
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            src={feature.image_src}
            alt={feature.title}
            loading="lazy"
          />
        ) : null}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-theme-900/0 transition-colors duration-300 group-hover:bg-theme-900/10"
        aria-hidden
      />
    </>
  );
}
