import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
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
    <div className="page-content mx-auto max-w-2xl px-[32px] py-[80px] text-lg leading-8 md:px-0">
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
    <div id="member-institutions" className="offset-element">
      <PageSectionTitle titleText={'Member Institutions'} />

      {memberInstitutions?.map(({ country, institutes, id }) => {
        return (
          <Accordion key={id} type="single" collapsible className="w-full">
            <AccordionItem value={country}>
              <AccordionTrigger>
                <p className="text-primary font-serif text-xl font-bold md:text-2xl">
                  {country}
                </p>
              </AccordionTrigger>
              <AccordionContent className="ml-6">
                <ol className="list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
                  {institutes.map(({ member_name, member_website_link }) => {
                    return (
                      <li key={member_name} className="text-lg">
                        <a
                          target="_blank"
                          title={member_name}
                          aria-label={member_name}
                          href={member_website_link}
                          rel="noopener noreferrer"
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
    <div id={sectionID} className="offset-element">
      <PageSectionTitle titleText={title} />

      {isTabs && childSections.length > 0 && (
        <div className="px-6 py-4">
          <Tabs defaultValue={childSections[0].title} orientation="vertical">
            <TabsList className="bg-bgDarker/60 grid h-auto w-full grid-cols-3 p-2">
              {childSections.map(({ title: childTitle }) => (
                <TabsTrigger key={childTitle} value={childTitle}>
                  <p className="font-serif text-lg font-bold md:text-xl">
                    {childTitle}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>
            {childSections.map(
              ({ description: childDescription, title: childTitle }) => (
                <TabsContent
                  key={childTitle}
                  value={childTitle}
                  className="bg-bgDarker/60 space-y-2 rounded-xl p-6 leading-8 text-zinc-700 dark:text-zinc-300"
                >
                  {childDescription && (
                    <p className="list-decimal px-4">
                      {htmlToText(childDescription)}
                    </p>
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
                <AccordionItem value={childTitle}>
                  <AccordionTrigger>
                    <p className="text-primary font-serif text-lg font-bold md:text-xl">
                      {childTitle}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="bg-bgDarker/60 rounded-md">
                    <div
                      className="p-6 text-lg leading-8 text-zinc-700 dark:text-zinc-300"
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
          className="text-zinc-700 dark:text-zinc-300"
          dangerouslySetInnerHTML={{
            __html: description ?? '',
          }}
        />
      )}
      <Separator className="my-20" />
    </div>
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
  return (
    <h2
      className={cn(
        'text-primary mb-4 py-4 font-serif text-2xl font-bold md:text-3xl lg:text-4xl',
        className
      )}
    >
      {titleText}
    </h2>
  );
};
