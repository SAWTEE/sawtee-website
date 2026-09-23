import AirBnbCard from '@/components/Frontend/AirBnbCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSiteCopy } from '@/lib/site-copy';
import type { MediaFellow, MediaFellowshipYear } from '@/types';

type MediaFellowsProps = {
  fellowships?: MediaFellowshipYear[];
};

export default function MediaFellows({ fellowships = [] }: MediaFellowsProps) {
  const copy = useSiteCopy();
  const sortByYear: MediaFellowshipYear[] = [...fellowships].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  if (sortByYear.length === 0) {
    return (
      <div className="page-content relative mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-20 lg:py-24">
        <p className="text-muted-foreground text-sm md:text-base">
          {copy.media_fellows.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="page-content relative mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-20 lg:py-24">
      <p className="text-muted-foreground mb-10 max-w-2xl text-sm leading-relaxed md:mb-12 md:text-base">
        {copy.media_fellows.intro}
      </p>

      <div className="space-y-2">
        {sortByYear.map(({ year, description, fellows }) => {
          return (
            <Accordion
              key={year}
              type="single"
              collapsible
              defaultValue={year}
              className="w-full"
            >
              <AccordionItem
                value={year}
                className="border-borderColor/60 dark:border-white/10"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <span className="text-primary dark:text-foreground font-serif text-lg font-semibold tracking-tight md:text-xl">
                    {copy.media_fellows.cohort_heading.replace(
                      '{year}',
                      String(year)
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div
                    className="text-secondary-foreground/90 border-l-theme-600 text-prose dark:border-l-theme-600/80 dark:text-muted-foreground mb-8 max-w-prose border-l-3 pl-5 leading-relaxed md:pl-6 md:text-base"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />

                  <div className="space-y-10 md:space-y-12">
                    {fellows.map(fellow => {
                      return <Fellow key={fellow.id} mediaFellow={fellow} />;
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}

type FellowProps = {
  mediaFellow: MediaFellow;
};

export const Fellow = ({ mediaFellow }: FellowProps) => {
  const { id, name, avatar, designation, bio, published_stories, experience } =
    mediaFellow;

  const nameParts = name.split(' ');
  const experienceItems = Array.isArray(experience)
    ? experience
    : experience
      ? [experience]
      : [];

  return (
    <article
      className="border-borderColor/70 bg-bgDarker/80 border-l-theme-600 dark:border-l-theme-600/80 rounded-lg border border-l-3 p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-black/40"
      id={String(id)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="border-theme-600/15 dark:border-theme-600/30 h-12 w-12 border">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-theme-600/10 text-theme-600 dark:bg-theme-600/20 dark:text-theme-450 text-sm font-medium">
            {nameParts[0]?.[0]}
            {nameParts[1]?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="text-primary dark:text-foreground font-serif text-lg font-semibold tracking-tight md:text-xl">
            {name}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{designation}</p>
        </div>
      </div>

      <p className="text-secondary-foreground/90 text-prose dark:text-muted-foreground mt-5 leading-relaxed md:text-base">
        {bio}
      </p>

      <Accordion type="single" collapsible className="mt-4 w-full">
        <AccordionItem
          value="published_stories"
          className="border-borderColor/60 dark:border-white/10"
        >
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-primary font-serif text-base font-semibold tracking-tight md:text-lg">
              Published Stories
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="text-muted-foreground marker:text-theme-600/70 list-decimal space-y-2 pl-5">
              {published_stories.map(({ title, link }) => {
                return (
                  <li key={title} className="text-prose md:text-base">
                    <a
                      target="_blank"
                      className="text-secondary-foreground hover:text-theme-600 dark:hover:text-theme-450"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      {title}
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {published_stories.map(({ image_src, title, media_src }, i) => {
                return (
                  <div key={`${title}-${i}`} className="min-w-0">
                    <AirBnbCard
                      img={image_src}
                      title={title}
                      mediaSrc={media_src}
                    />
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="experience"
          className="border-borderColor/60 dark:border-white/10"
        >
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-primary font-serif text-base font-semibold tracking-tight md:text-lg">
              Experience with the Fellowship
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {experienceItems.map((exp, i) => {
                return (
                  <p
                    key={i}
                    className="experience-text text-secondary-foreground/90 text-prose dark:text-muted-foreground leading-relaxed md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: exp,
                    }}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </article>
  );
};
