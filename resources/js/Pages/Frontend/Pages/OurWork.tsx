import CardWithEffect from '@/components/Frontend/CardWithEffect';
import Title from '@/components/Frontend/title';
import { cn, htmlToText } from '@/lib/utils';
import type { PageSection, Theme } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

type OurWorkProps = {
  themes?: Theme[] | null;
  sections?: PageSection[] | null;
  content?: string | null;
};

/** Curated WebP stills for known sector cards — prefer over low-quality CMS stock. */
const SECTOR_IMAGE_OVERRIDES: Record<string, string> = {
  programme: '/assets/our-work-programmes.webp',
  programmes: '/assets/our-work-programmes.webp',
  research: '/assets/our-work-research.webp',
};

function sectorImageSrc(section: PageSection): string {
  const key = (section.link || section.title || '').toLowerCase().trim();
  if (key && SECTOR_IMAGE_OVERRIDES[key]) {
    return SECTOR_IMAGE_OVERRIDES[key];
  }

  return (
    section.media?.[0]?.original_url ?? '/assets/SM-placeholder-1024x512.png'
  );
}

export default function OurWork({
  themes = null,
  sections = null,
}: OurWorkProps) {
  const Themes = (themes ?? []).filter(theme => theme.title !== 'Covid');
  const intro = sections?.find(section => section.title === 'Intro');
  const sectors = sections?.filter(section => section.parent_id !== null) ?? [];
  const introText = intro?.description ? htmlToText(intro.description) : null;

  return (
    <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20 lg:py-24">
      <section className="mx-auto max-w-3xl text-center" aria-labelledby="our-work-intro">
        <h2 id="our-work-intro" className="sr-only">
          Our Work
        </h2>
        {introText && (
          <blockquote className="border-theme-500/40 mx-auto max-w-2xl border-l-2 pl-5 text-left md:pl-6">
            <p className="text-primary/90 font-serif text-lg leading-relaxed font-medium tracking-tight md:text-xl lg:text-2xl dark:text-zinc-200">
              {introText}
            </p>
          </blockquote>
        )}
      </section>

      <section className="mt-16 md:mt-20 lg:mt-24" aria-label="Thematic Areas">
        <div className="mx-auto mb-10 max-w-5xl md:mb-12">
          <Title title="Thematic Areas" as="h2" />
          <p className="text-muted-foreground -mt-4 max-w-2xl text-sm leading-relaxed md:-mt-5 md:text-base">
            Priority areas guiding SAWTEE&apos;s research, dialogue, and policy
            engagement across South Asia.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {Themes.map((theme, index) => {
            const wide = index <= 1 || index === Themes.length - 2;

            return (
              <article
                key={theme.id ?? theme.title}
                className={cn(
                  'last:lg:col-span-3',
                  wide ? 'lg:col-span-3' : 'lg:col-span-2'
                )}
                id={`theme${theme.id}`}
              >
                <div className="border-borderColor/70 bg-bgDarker/80 h-full rounded-lg border border-l-[3px] border-l-[#006181] p-5 shadow-sm backdrop-blur-sm md:p-6 dark:border-white/10 dark:border-l-[#006181]/80 dark:bg-black/40">
                  <h3 className="text-primary font-serif text-lg font-semibold tracking-tight md:text-xl dark:text-zinc-100">
                    {theme.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-[0.95rem]">
                    {theme.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {sectors.length > 0 && (
        <section className="mt-20 md:mt-24 lg:mt-28" aria-label="Workstreams">
          <div className="mx-auto mb-10 max-w-5xl md:mb-12">
            <Title title="Workstreams" as="h2" />
            <p className="text-muted-foreground -mt-4 max-w-2xl text-sm leading-relaxed md:-mt-5 md:text-base">
              Programmes and research that translate thematic priorities into
              concrete engagement.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-2">
            {sectors.map(sector => {
              const { id, title, description, link } = sector;
              const href = link ? `/category/${link}` : '#';

              return (
                <CardWithEffect key={id} className="group p-0">
                  <Link
                    href={href}
                    className="relative block aspect-3/2 w-full overflow-hidden focus-visible:ring-theme-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <img
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      alt=""
                      src={sectorImageSrc(sector)}
                      loading="lazy"
                      decoding="async"
                      style={{
                        filter: 'saturate(0.72) contrast(0.96) brightness(0.88)',
                      }}
                    />
                    {/* Muted brand wash so busy or soft assets read as editorial stills */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-[#006181]/25 mix-blend-multiply dark:bg-[#006181]/35"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/10"
                      aria-hidden
                    />

                    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-5 md:p-6">
                      <h3 className="font-serif text-xl font-semibold tracking-tight text-white md:text-2xl">
                        {title}
                      </h3>
                      {description ? (
                        <p className="line-clamp-2 max-w-prose text-sm leading-relaxed text-white/85 md:text-[0.95rem]">
                          {description}
                        </p>
                      ) : null}
                      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                        Explore
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Link>
                </CardWithEffect>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
