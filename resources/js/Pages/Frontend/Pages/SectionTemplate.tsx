import MemberInstitutesMarquee from '@/components/Frontend/MemberInstitutesMarquee';
import Title from '@/components/Frontend/title';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { slugify } from '@/lib/helpers';
import { cn, htmlToText } from '@/lib/utils';
import type { MemberCountry, PageData, PageSection } from '@/types';

function isMemberCountries(
  data: PageData | undefined
): data is MemberCountry[] {
  return Array.isArray(data);
}

type SectionTemplateProps = {
  sections?: PageSection[] | null;
  pageData?: PageData;
  content?: string | null;
  size?: string;
};

export default function SectionTemplate({
  sections,
  pageData,
}: SectionTemplateProps) {
  return (
    <div className="page-content relative mx-auto max-w-5xl px-5 py-16 text-base leading-relaxed md:px-10 md:py-20 md:text-lg md:leading-8 lg:py-24">
      {sections?.map(section => {
        if (section.parent_id === null) {
          return (
            <PageSectionView
              key={section.title}
              section={section}
              sections={sections}
            />
          );
        }
      })}
      {isMemberCountries(pageData) && <Members memberInstitutions={pageData} />}
    </div>
  );
}

type MembersProps = {
  memberInstitutions?: MemberCountry[] | null;
};

const Members = ({ memberInstitutions = null }: MembersProps) => {
  return (
    <section
      id="member-institutions"
      className="offset-element mt-16 border-t border-[#006181]/15 pt-16 md:mt-20 md:pt-20 dark:border-[#006181]/25"
      aria-label="Member Institutions"
    >
      <div className="mb-8 md:mb-10">
        <Title title="Member Institutions" as="h2" />
        <p className="text-muted-foreground -mt-4 max-w-2xl text-sm leading-relaxed md:-mt-5 md:text-base">
          Partner organisations across South Asia advancing SAWTEE&apos;s
          regional network.
        </p>
      </div>

      <div className="space-y-1">
        {memberInstitutions?.map(({ country, institutes, id }) => {
          return (
            <Accordion key={id} type="single" collapsible className="w-full">
              <AccordionItem
                value={country}
                className="border-borderColor/60 dark:border-white/10"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <span className="text-primary font-serif text-lg font-semibold tracking-tight md:text-xl dark:text-zinc-100">
                    {country}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-1 md:pl-2">
                  <ol className="text-muted-foreground list-decimal space-y-2.5 pl-5 marker:text-[#006181]/70">
                    {institutes.map(({ member_name, member_website_link }) => {
                      return (
                        <li
                          key={member_name}
                          className="text-[0.95rem] md:text-base"
                        >
                          <a
                            target="_blank"
                            title={member_name}
                            aria-label={member_name}
                            href={member_website_link}
                            rel="noopener noreferrer"
                            className="text-secondary-foreground hover:text-[#006181] dark:hover:text-[#4da3c0]"
                          >
                            {member_name}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>

      <MemberInstitutesMarquee className="mt-12 border-[#006181]/12 dark:border-[#006181]/20" />
    </section>
  );
};

type PageSectionViewProps = {
  section: PageSection;
  sections: PageSection[];
};

const PageSectionView = ({ section, sections }: PageSectionViewProps) => {
  const { title, description } = section;

  const isTabs = section.type === 'tabs';
  const isAccordian = section.type === 'accordian';
  const isDefault = section.type === 'default';

  const sectionID = slugify(title);

  const childSections = sections.filter(sec => sec.parent_id === section.id);
  return (
    <section
      id={sectionID}
      className="offset-element mb-14 border-b border-[#006181]/12 pb-14 last:mb-0 last:border-b-0 last:pb-0 md:mb-16 md:pb-16 dark:border-[#006181]/20"
    >
      <PageSectionTitle titleText={title} />

      {isTabs && childSections.length > 0 && (
        <div className="mt-2">
          <Tabs defaultValue={childSections[0].title} orientation="vertical">
            <TabsList className="bg-bgDarker/50 mb-4 grid h-auto w-full grid-cols-3 gap-1 border border-[#006181]/10 p-1.5 dark:border-white/10">
              {childSections.map(({ title: childTitle }) => (
                <TabsTrigger
                  key={childTitle}
                  value={childTitle}
                  className="data-[state=active]:border-l-[3px] data-[state=active]:border-l-[#006181] data-[state=active]:bg-white/80 dark:data-[state=active]:bg-black/40"
                >
                  <span className="font-serif text-sm font-semibold tracking-tight md:text-base lg:text-lg">
                    {childTitle}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {childSections.map(
              ({ description: childDescription, title: childTitle }) => (
                <TabsContent
                  key={childTitle}
                  value={childTitle}
                  className="border-borderColor/60 bg-bgDarker/40 space-y-2 rounded-lg border border-l-[3px] border-l-[#006181] p-5 leading-relaxed text-zinc-700 md:p-6 dark:border-white/10 dark:border-l-[#006181]/80 dark:text-zinc-300"
                >
                  {childDescription && (
                    <p className="px-1">{htmlToText(childDescription)}</p>
                  )}
                </TabsContent>
              )
            )}
          </Tabs>
        </div>
      )}

      {isAccordian &&
        childSections.map(
          ({ title: childTitle, description: childDescription }) => {
            return (
              <Accordion
                key={childTitle}
                type="single"
                collapsible
                className="w-full"
              >
                <AccordionItem
                  value={childTitle}
                  className="border-borderColor/60 dark:border-white/10"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-primary font-serif text-base font-semibold tracking-tight md:text-lg">
                      {childTitle}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="border-borderColor/50 bg-bgDarker/40 rounded-md border-l-[3px] border-l-[#006181] p-5 text-[0.95rem] leading-relaxed text-zinc-700 md:p-6 md:text-base dark:border-white/10 dark:border-l-[#006181]/80 dark:text-zinc-300"
                      dangerouslySetInnerHTML={{
                        __html: childDescription ?? '',
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          }
        )}

      {isDefault && (
        <div
          className="text-secondary-foreground/90 max-w-prose leading-relaxed dark:text-zinc-300"
          dangerouslySetInnerHTML={{
            __html: description ?? '',
          }}
        />
      )}
    </section>
  );
};

type PageSectionTitleProps = {
  titleText?: string | null;
  className?: string;
};

const PageSectionTitle = ({
  titleText = null,
  className = '',
}: PageSectionTitleProps) => {
  if (!titleText) return null;

  return (
    <h2
      className={cn(
        'text-primary mb-5 font-serif text-2xl font-semibold tracking-tight md:mb-6 md:text-3xl lg:text-4xl dark:text-zinc-100',
        className
      )}
    >
      {titleText}
      <span
        className="from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500 mt-2 block h-1 w-14 bg-linear-to-l md:h-1.5 md:w-16"
        aria-hidden
      />
    </h2>
  );
};
