import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DateFormat } from '@/lib/helpers';

const CovidArchive = ({ posts = [] }: { posts?: any[] }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-10 px-4 md:px-8 lg:grid-cols-2">
      {posts.map((post: any) => {
        const authors = () => {
          if (post.author) {
            const result = post.author.replace('and', ',').split(',');
            return result;
          }
          return [];
        };
        return (
          <Card
            key={post.id}
            className="min-w-lg w-full rounded-md bg-bgDarker shadow-md"
          >
            <CardContent className="flex h-full w-full flex-col gap-4 space-y-4 px-6">
              <div className="flex w-full justify-between">
                {post.genre ? (
                  <Badge className="rounded-md">{post.genre}</Badge>
                ) : null}

                <time className="self-end justify-self-end text-sm font-medium text-muted-foreground">
                  {DateFormat(post.published_at)}
                </time>
              </div>
              <a href={post.link} className="primary-link">
                <h3 className="text-md font-normal tracking-normal lg:text-lg lg:leading-5">
                  {post.title}
                </h3>
              </a>
              <div className="flex flex-wrap items-center gap-x-2">
                {post.author ? (
                  <div className="flex -space-x-4 transition-all duration-300 ease-in hover:space-x-1 rtl:space-x-reverse">
                    <TooltipProvider>
                      {authors().map((author: any) => (
                        <Tooltip key={author}>
                          <TooltipTrigger>
                            <div className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-gray-100 shadow-sm dark:bg-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-300">
                                {author.split(' ').map((initial: any) => {
                                  return initial[0];
                                })}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{author}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CovidArchive;
