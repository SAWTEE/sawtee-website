import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { Blob } from '../shared/icons';

export const TwoColumnImageSection = ({
  data,
  showBlobIcon = false,
  showBorderBox = false,
  children,
}) => {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 items-center justify-center gap-10">
      {data.map(item => {
        return (
          <div
            key={item.id}
            className="relative my-10 flex max-w-[30rem] flex-1 items-center justify-center"
          >
            {showBorderBox && (
              <div className="absolute -top-5 left-6 h-full w-full rounded-2xl border-4" />
            )}

            {showBlobIcon && (
              <Blob
                className={
                  'absolute -top-[20%] left-0 h-[150%] w-full text-theme-100 dark:text-theme-400'
                }
              />
            )}
            {children}

            <Link
              href={item.link}
              className="group relative overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="ease absolute inset-0 h-full w-full bg-black/20 transition-all duration-200 group-hover:bg-black/10" />

              <ExternalLink
                aria-label={'Play Button'}
                className="ease absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/60 transition-all duration-200 group-hover:text-white/100"
              />

              <img
                src={item.image_src || 'assets/SM-placeholder-300x150.png'}
                loading="lazy"
                alt={item.title}
                className="h-full w-full rounded-xl object-cover"
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
};
