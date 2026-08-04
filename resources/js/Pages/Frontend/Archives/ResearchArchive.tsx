import Glassbox from '@/components/Frontend/Glassbox';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

const ResearchArchive = ({ posts }) => {
  // Get the data of the current list.
  if (!posts || posts.length <= 0)
    return <p className="text-2xl">"No posts found"</p>;

  const sortedPosts = Object.entries(posts).sort(([a], [b]) => b - a);

  return (
    <div className="mx-auto mb-5 flex w-full max-w-3xl flex-col items-start justify-start gap-10">
      {sortedPosts.map(tagitem => {
        return (
          <div className="z-10 w-full" key={tagitem[0]}>
            <h2 className="my-5 text-lg font-bold md:text-xl xl:text-2xl">
              {tagitem[0]}
            </h2>
            <Glassbox className={'w-full rounded-xl p-4 text-left'}>
              {tagitem[1].map((researchItem, idx) => (
                <ReasearchItem
                  key={researchItem.id}
                  skipTrail={idx !== tagitem[1].length - 1}
                  className={
                    idx !== tagitem[1].length - 1 ? 'min-h-12' : 'min-h-auto'
                  }
                >
                  <h3 className="text-md tracking-wide text-secondary-foreground/90 hover:text-primary/80 hover:underline hover:underline-offset-4 dark:hover:text-secondary-foreground/80 md:text-lg">
                    <a
                      target="_blank"
                      href={
                        researchItem.file
                          ? `/Research_Reports/${researchItem.file.name}`
                          : researchItem.link
                      }
                    >
                      {researchItem.title}
                    </a>
                  </h3>
                </ReasearchItem>
              ))}
            </Glassbox>
          </div>
        );
      })}
    </div>
  );
};

export default ResearchArchive;

const ReasearchItem = ({ skipTrail, children, className }) => {
  return (
    <div className={cn('flex items-start', className)}>
      <div className="relative mr-4 flex flex-col items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700">
          <FileText className="h-5 w-5 translate-x-1/2 translate-y-1/2 text-zinc-600 dark:text-zinc-400" />
        </div>
        {skipTrail ? (
          <div className="h-12 w-[2px] bg-zinc-200 dark:bg-zinc-700" />
        ) : null}
      </div>
      <div className="">{children}</div>
    </div>
  );
};
