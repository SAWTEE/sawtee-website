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
import LogoCarousel from '@/components/Frontend/LogoCarousel';

export default function SectionTemplate({ sections, content, pageData }) {
  const logos = [];
  pageData.forEach(country =>
    country.institutes.map(
      member =>
        member.logo &&
        logos.push({
          alt: member.member_name,
          src: member.logo,
          link: member.member_website_link,
        })
    )
  );
  return (
    <div className="page-content mx-auto max-w-2xl px-[32px] py-[80px] text-lg leading-8 md:px-0">
      {sections?.map(section => {
        if (section.parent_id === null) {
          return (
            <PageSection
              key={section.title}
              section={section}
              sections={sections}
            />
          );
        }
      })}
      {pageData && <Members memberInstitutions={pageData} />}

      {/* <div id="logo-carousel" className="offset-element pt-20">
        <LogoCarousel logos={logos} />
      </div> */}
    </div>
  );
}

const Members = ({ memberInstitutions }) => {
  return (
    <div id="member-institutions" className="offset-element">
      <PageSectionTitle titleText={'Member Institutions'} />

      {memberInstitutions?.map(({ country, institutes, id }) => {
        return (
          <Accordion key={id} collapsible className="w-full">
            <AccordionItem border="none" value={country}>
              <AccordionTrigger>
                <p className="font-sans text-xl font-bold text-primary md:text-2xl">
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
                          ariaLabel={member_name}
                          href={member_website_link}
                          rel="noreferrer"
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

const PageSection = ({ section, sections }) => {
  const { title, slug, description } = section;

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
            <TabsList className="grid h-auto w-full grid-cols-3 bg-bgDarker bg-opacity-60 p-2">
              {childSections.map(({ title }) => (
                <TabsTrigger key={title} value={title}>
                  <p className="font-sans text-lg font-bold md:text-xl">
                    {title}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>
            {childSections.map(({ description, title }) => (
              <TabsContent
                key={title}
                value={title}
                className="space-y-2 rounded-xl bg-bgDarker bg-opacity-60 p-6 leading-8 text-zinc-700 dark:text-zinc-300"
              >
                {description && (
                  <p className="list-decimal px-4">{htmlToText(description)}</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {isAccordian &&
        childSections?.map(({ title, description }) => {
          return (
            <Accordion key={title} collapsible className="w-full">
              <AccordionItem value={title}>
                <AccordionTrigger>
                  <p className="font-sans text-lg font-bold text-primary md:text-xl">
                    {title}
                  </p>
                </AccordionTrigger>
                <AccordionContent className="rounded-md bg-bgDarker bg-opacity-60">
                  <div
                    className="p-6 text-lg leading-8 text-zinc-700 dark:text-zinc-300"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}

      {isDefault && (
        <div
          className="text-zinc-700 dark:text-zinc-300"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
      <Separator className="my-20" />
    </div>
  );
};

const PageSectionTitle = ({ titleText, className }) => {
  return (
    <h2
      className={cn(
        'mb-4 py-4 font-sans text-2xl font-bold text-primary md:text-3xl lg:text-4xl',
        className
      )}
    >
      {titleText}
    </h2>
  );
};
