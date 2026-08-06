import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { PageSection } from '@/types';

type DefaultPageProps = {
  sections?: PageSection[] | null;
  content?: string | null;
  children?: ReactNode;
};

const DefaultPage = ({ sections, content, ...rest }: DefaultPageProps) => {
  return (
    <section
      className="page-content relative mx-auto max-w-3xl px-5 py-16 text-base leading-relaxed md:px-10 md:py-20 md:text-lg md:leading-8 lg:py-24"
      {...rest}
    >
      {content ? (
        <div
          className="text-secondary-foreground/90 max-w-prose dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : null}

      {sections?.map(({ title, description }, index) => {
        return (
          <div
            key={index}
            className="mt-12 border-t border-[#006181]/12 pt-10 first:mt-0 first:border-t-0 first:pt-0 md:mt-14 md:pt-12 dark:border-[#006181]/20"
          >
            {title ? (
              <h3
                className={cn(
                  'text-primary mb-4 font-serif text-xl font-semibold tracking-tight md:mb-5 md:text-2xl lg:text-3xl dark:text-zinc-100'
                )}
              >
                {title}
                <span
                  className="from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500 mt-2 block h-1 w-14 bg-linear-to-l md:h-1.5 md:w-16"
                  aria-hidden
                />
              </h3>
            ) : null}
            {description ? (
              <div
                className="text-secondary-foreground/90 max-w-prose leading-relaxed dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : null}
          </div>
        );
      })}
    </section>
  );
};

export default DefaultPage;
