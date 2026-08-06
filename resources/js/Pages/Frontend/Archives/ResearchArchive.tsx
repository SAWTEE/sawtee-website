import Glassbox from '@/components/Frontend/Glassbox';
import { cn } from '@/lib/utils';
import type { Research, ResearchByYear } from '@/types';
import { FileText } from 'lucide-react';
import type { ReactNode } from 'react';

type ResearchArchiveProps = {
  posts?: ResearchByYear | Research[] | null;
};

const ResearchArchive = ({ posts = null }: ResearchArchiveProps) => {
  if (!posts) {
    return <p className="text-2xl">No posts found</p>;
  }

  const byYear: ResearchByYear = Array.isArray(posts) ? {} : posts;

  if (Object.keys(byYear).length <= 0) {
    return <p className="text-2xl">No posts found</p>;
  }

  const sortedPosts = Object.entries(byYear).sort(
    ([a], [b]) => Number(b) - Number(a)
  );

  return (
    <div className="mx-auto mb-5 flex w-full max-w-3xl flex-col items-start justify-start gap-10">
      {sortedPosts.map(([year, items]) => {
        return (
          <div className="z-10 w-full" key={year}>
            <h2 className="my-5 text-lg font-bold md:text-xl xl:text-2xl">
              {year}
            </h2>
            <Glassbox className={'w-full rounded-xl p-4 text-left'}>
              {items.map((researchItem, idx) => (
                <ResearchItem
                  key={researchItem.id}
                  skipTrail={idx !== items.length - 1}
                  className={
                    idx !== items.length - 1 ? 'min-h-12' : 'min-h-auto'
                  }
                >
                  <h3 className="text-md text-secondary-foreground/90 hover:text-primary/80 dark:hover:text-secondary-foreground/80 tracking-wide hover:underline hover:underline-offset-4 md:text-lg">
                    <a
                      target="_blank"
                      href={
                        researchItem.file
                          ? `/Research_Reports/${researchItem.file.name}`
                          : (researchItem.link ?? undefined)
                      }
                      rel="noopener noreferrer"
                    >
                      {researchItem.title}
                    </a>
                  </h3>
                </ResearchItem>
              ))}
            </Glassbox>
          </div>
        );
      })}
    </div>
  );
};

export default ResearchArchive;

type ResearchItemProps = {
  skipTrail?: boolean;
  children?: ReactNode;
  className?: string;
};

const ResearchItem = ({
  skipTrail = false,
  children,
  className = '',
}: ResearchItemProps) => {
  return (
    <div className={cn('flex items-start', className)}>
      <div className="relative mr-4 flex flex-col items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700">
          <FileText className="h-5 w-5 translate-x-1/2 translate-y-1/2 text-zinc-600 dark:text-zinc-400" />
        </div>
        {skipTrail ? (
          <div className="h-12 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
        ) : null}
      </div>
      <div className="">{children}</div>
    </div>
  );
};
