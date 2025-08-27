import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DateFormat } from '@/lib/helpers';

const CovidArchive = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 w-full gap-x-4 gap-y-10 px-4 lg:grid-cols-2 md:px-8">
      {posts.map(post => {
        const authors = () => {
          if (post.author) {
            const result = post.author.replace('and', ',').split(',');
            return result;
          }
        };
        return (
          <Card key={post.id} className="w-full min-w-lg rounded-md bg-bgDarker shadow-md">
            <CardContent className="flex h-full w-full flex-col gap-4 space-y-4 px-6">
              <div className="flex w-full justify-between">
                {post.genre && (
                  <Badge className="rounded-md">{post.genre}</Badge>
                )}

                <time
                  className="self-end text-sm font-medium justify-self-end text-muted-foreground"
                  fontSize={'xs'}
                  fontWeight="medium"
                >
                  {DateFormat(post.published_at)}
                </time>
              </div>
              <a href={post.link} className="primary-link">
                <h3 className="text-md font-normal tracking-normal lg:text-lg lg:leading-5">
                  {post.title}
                </h3>
              </a>
              <div className="flex flex-wrap items-center gap-x-2">
                {post.author && (
                  <div class="flex -space-x-4 transition-all duration-300 ease-in hover:space-x-1 rtl:space-x-reverse">
                    <TooltipProvider>
                      {authors().map(author => (
                        <Tooltip key={author}>
                          <TooltipTrigger>
                            <div class="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-gray-100 shadow-sm dark:bg-gray-600">
                              <span class="font-medium text-gray-600 dark:text-gray-300">
                                {author.split(' ').map(initial => {
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
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CovidArchive;
