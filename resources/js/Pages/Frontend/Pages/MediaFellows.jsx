import AirBnbCard from '@/components/Frontend/AirBnbCard';
import Glassbox from '@/components/Frontend/Glassbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mediaFellowshipData } from '@/lib/data';

export default function MediaFellows() {
  const sortByYear = mediaFellowshipData.sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  return (
    <div className="mx-auto max-w-2xl px-8 py-20 md:px-0">
      <Glassbox className="mt-8 px-6 text-slate-800">
        {sortByYear?.map(({ year, description, fellows }, i) => {
          return (
            <Accordion
              type="single"
              collapsible
              defaultValue={year}
              className="w-full"
            >
              <AccordionItem value={year}>
                <AccordionTrigger className="text-xl font-bold">
                  {'SAWTEE Media Fellowship ' + year}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="text-lg text-slate-800 dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />

                  {fellows.map(fellow => {
                    return <Fellow mediaFellow={fellow} />;
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </Glassbox>
    </div>
  );
}

export const Fellow = ({ mediaFellow }) => {
  const { id, name, avatar, designation, bio, published_stories, experience } =
    mediaFellow;

  return (
    <div className="my-10" id={id} my={10}>
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>
            {name.split(' ')[0][0]}
            {name.split(' ')[1][0]}
          </AvatarFallback>
        </Avatar>
        <div className="ml-6 flex items-center gap-4">
          <h2 className="font-sans text-lg lg:text-xl">{name}</h2>
          <p className="text-sm">{designation}</p>
        </div>
      </div>

      <p className="my-8 text-lg">{bio}</p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={'published_stories'}>
          <AccordionTrigger className="text-lg">
            {'Published Stories'}
          </AccordionTrigger>
          <AccordionContent>
            <ol className="ml-6 list-decimal">
              {published_stories?.map(({ title, link }) => {
                return (
                  <li key={title} className="text-lg">
                    <a
                      target="_blank"
                      className="underline hover:underline-offset-2"
                      href={link}
                    >
                      {title}
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {published_stories?.map(({ image_src, title, media_src }, i) => {
                return (
                  <div key={i} className="grid gap-4">
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
        <AccordionItem value={'experience'}>
          <AccordionTrigger className="text-lg">
            {'Experience with the Fellowship'}
          </AccordionTrigger>
          <AccordionContent>
            {experience?.map(exp => {
              return (
                <p
                  className="experience-text my-2 text-lg"
                  dangerouslySetInnerHTML={{
                    __html: exp,
                  }}
                />
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
