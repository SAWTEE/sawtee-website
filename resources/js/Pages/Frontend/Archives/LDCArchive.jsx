import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { DateFormat } from '@/lib/helpers';

const LDCArchive = ({ posts }) => {
  return (
    <div className="grid w-full gap-x-4 gap-y-10 px-4 md:grid-cols-2 md:px-8">
      {posts.map(post => {
        return (
          <Card key={post.id} className="rounded-md bg-bgDarker shadow-md">
            <CardContent className="flex h-full w-full flex-col gap-4 space-y-4 px-6">
              <div className="flex w-full justify-between">
                {post.category && (
                  <Badge className="rounded-md">{post.category.name}</Badge>
                )}

                <time
                  className="self-end text-sm font-medium"
                  fontSize={'xs'}
                  fontWeight="medium"
                  justifySelf={'flex-end'}
                >
                  {DateFormat(post.published_at)}
                </time>
              </div>
              {post.link && <a href={post.link} className="primary-link">
                <h3 className="text-md font-normal tracking-normal lg:text-lg lg:leading-5">
                  {post.title}
                </h3>
              </a>}
              {!post.link && <Link href={`/category/${post.category.slug}/${post.slug}`} className="primary-link">
                <h3 className="text-md font-normal tracking-normal lg:text-lg lg:leading-5">
                  {post.title}
                </h3>
              </Link>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LDCArchive;
