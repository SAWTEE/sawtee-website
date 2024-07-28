import { htmlToText } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import CardWithEffect from '../CardWithEffect';

export default function OurWork({ themes, sections, content }) {
  const [intro, setIntro] = useState(null);
  const [sectors, setSectors] = useState(null);
  useEffect(() => {
    const intro = sections.find(section => section.title === 'Intro');
    const sectors = sections.filter(section => section.parent_id !== null);
    intro && setIntro(intro);
    sectors && setSectors(sectors);
  }, [sections]);

  return (
    <div className="intro relative py-20 max-w-7xl px-5 md:px-10 mx-auto">
      <h2 className="text-xl md:text-2xl lg:text-4xl dark:text-zinc-300 text-center mb-6">
        Thematic Areas
      </h2>

      <div className="flex flex-col max-w-4xl mx-auto gap-8 justify-center items-center relative mb-24">
        {intro && (
          <blockquote className="blockquote text-xl bg-bgDarker/90 m-0 py-10 dark:text-zinc-400 self-center">
            {htmlToText(intro.description)}
          </blockquote>
        )}
      </div>

      <div class="flex flex-wrap my-12 ">
        {themes.map((theme, index) => {
          return (
            <div
              key={theme.title}
              className={`w-full bg-bgDarker p-8 border-zinc-500 last:border-b-0 border-b md:w-1/2 ${(index + 1) % 3 === 0 ? 'md:border-r-0' : 'border-r'} md:border-r lg:w-1/3 hover:shadow-md transition-all duration-300 ease-in-out`}
            >
              <div className="flex items-center mb-6">
                <div className="ml-4 text-xl dark:text-zinc-200">
                  {theme.title}
                </div>
              </div>
              <p className="leading-normal text-zinc-700 line-clamp-3 dark:text-gray-200 text-md">
                {theme.description}
              </p>
            </div>
          );
        })}
      </div>
      <div className="page_content grid md:grid-cols-2 mx-auto px-8 md:px-4 py-12 gap-8 items-center max-w-5xl">
        {sectors?.map(({ id, title, description, media, link }) => {
          return (
            <CardWithEffect key={id} className="cards max-w-lg  p-0">
              <img
                className="w-full h-full object-cover aspect-square"
                alt="sector cover"
                src={
                  media[0]
                    ? media[0].original_url
                    : '/assets/SM-placeholder-1024x512.png'
                }
              />
              <Link
                href={`/category/${link}`}
                className="absolute group inset-0 flex flex-col justify-between items-center w-full h-full bg-bgDarker bg-blend-lighten"
              >
                <h2 className="title text-center self-start dark:text-zinc-300 py-6 text-lg md:text-2xl w-full group-hover:bg-theme-500/50">
                  {title}
                </h2>
                <p className="grow flex w-full h-full px-6 dark:text-gray-200 justify-center items-center">
                  {description || 'Random text to check the positioning'}
                </p>
              </Link>
            </CardWithEffect>
          );
        })}
      </div>
    </div>
  );
}
