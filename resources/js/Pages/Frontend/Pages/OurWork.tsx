import { cn, htmlToText } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CardWithEffect from '../../../components/Frontend/CardWithEffect';

export default function OurWork({ themes, sections }) {
  const [intro, setIntro] = useState(null);
  const [sectors, setSectors] = useState(null);

  const Themes = themes.filter(theme => theme.title !== 'Covid');

  useEffect(() => {
    const intro = sections.find(section => section.title === 'Intro');
    const sectors = sections.filter(section => section.parent_id !== null);
    intro && setIntro(intro);
    sectors && setSectors(sectors);
  }, [sections]);

  return (
    <div className="intro relative mx-auto max-w-7xl px-5 py-20 md:px-10">
      <h2 className="mb-6 text-center text-xl dark:text-zinc-300 md:text-2xl lg:text-4xl">
        Thematic Areas
      </h2>

      {intro && (
        <div className="relative mx-auto mb-24 flex max-w-4xl flex-col items-center justify-center gap-8">
          <figure className="mx-auto max-w-screen-md text-center">
            <svg
              className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 14"
            >
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <blockquote>
              <p className="text-2xl font-medium italic text-gray-900 dark:text-white">
                {htmlToText(intro.description)}
              </p>
            </blockquote>
          </figure>
        </div>
      )}

      <div className="mx-auto mb-10 grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
        {Themes?.map((theme, index) => {
          const colSpan = index <= 1 || index === Themes.length - 2 ? 3 : 2;

          return (
            <div
              key={theme.title}
              className={cn(
                'w-full bg-bgDarker last:col-span-3',
                `col-span-${colSpan}`
              )}
              id={`theme${theme.id}`}
            >
              <div className="relative h-full">
                <span className="absolute left-0 top-0 ml-1 mt-1 h-full w-full rounded-lg bg-theme-500" />

                <div className="relative h-full space-y-2 rounded-lg border-2 border-theme-500 bg-bgDarker p-5">
                  <div className="-mt-1 flex items-center">
                    <h3 className="my-2 text-xl font-bold text-slate-800 dark:text-slate-300">
                      {theme.title}
                    </h3>
                  </div>

                  <p className="mb-2 text-slate-700 dark:text-slate-400">
                    {theme.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="page_content mx-auto grid max-w-5xl items-center gap-8 px-8 py-12 md:grid-cols-2 md:px-4">
        {sectors?.map(({ id, title, description, media, link }) => {
          return (
            <CardWithEffect key={id} className="cards max-w-lg p-0">
              <img
                className="aspect-square h-full w-full object-cover"
                alt="sector cover"
                src={
                  media[0]
                    ? media[0].original_url
                    : '/assets/SM-placeholder-1024x512.png'
                }
              />
              <Link
                href={`/category/${link}`}
                className="group absolute inset-0 flex h-full w-full flex-col items-center justify-between"
              >
                <h2 className="title group-hover:bg-theme-500/70text-zinc-300 w-full self-start py-6 text-center text-lg md:text-2xl">
                  {title}
                </h2>
                {description && (
                  <p className="flex w-full items-center justify-center bg-[rgba(0,0,0,0.5)] px-6 py-2 text-gray-200">
                    {description}
                  </p>
                )}
              </Link>
            </CardWithEffect>
          );
        })}
      </div>
    </div>
  );
}
