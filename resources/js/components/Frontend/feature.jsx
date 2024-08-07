import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

export default function FeaturedSection({ features }) {
  return features.map((feature, index) => (
    <div
      key={feature.id}
      className="mx-auto mt-6 flex w-[90%] flex-col items-center justify-center gap-4 lg:w-[85%] lg:flex-row xl:w-[80%]"
    >
      <div
        className={cn(
          'w-full rounded-md p-6 md:px-8 lg:w-[50%]',
          index % 2 === 0 ? 'lg:order-1' : 'order-0'
        )}
      >
        <h2 className="text-3xl font-semibold text-secondary-foreground">
          <span className='after:content:"" after:bg-primary-100 relative z-20 after:absolute after:bottom-1 after:left-0 after:z-[-1] after:h-[30%] after:w-full after:bg-gradient-to-l after:from-theme-50 after:to-theme-300 dark:after:bg-gradient-to-l dark:after:from-theme-300 dark:after:to-theme-500'>
            {feature.title}
          </span>
        </h2>

        <p className="text-md mt-4 text-muted-foreground">
          {feature.description}
        </p>
      </div>
      <div className="relative w-full md:block lg:w-[50%]">
        <Link
          href={feature.link}
          className="group relative flex aspect-auto w-full items-center justify-center overflow-hidden rounded-xl p-0"
        >
          <img
            className="h-full w-full rounded-sm object-cover lg:rounded-lg"
            src={feature.image_src}
            alt={feature.title}
            loading="lazy"
          />
          <div className="absolute inset-0 z-30 h-full w-full bg-black opacity-20 transition-opacity group-hover:opacity-30" />

          <ExternalLink
            aria-label={'Play Button'}
            className={
              'transform:translateX(-50%) transform:translateY(-50%) absolute z-20 h-12 w-12 text-white/70 transition-all duration-150 ease-in-out group-hover:text-white'
            }
          />
        </Link>
      </div>
    </div>
  ));
}
