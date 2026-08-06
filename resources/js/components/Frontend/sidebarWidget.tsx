import { formatDate } from '@/lib/helpers';
import type { Post } from '@/types';
import { Link } from '@inertiajs/react';
import ExploreButton from './ExploreButton';
import Glassbox from './Glassbox';
import SimpleList from './SimpleList';

type SidebarWidgetProps = {
  array?: Post[] | null;
  title?: string;
  link?: string | null;
  className?: string;
};

const SidebarWidget = ({ array, title, link, ...rest }: SidebarWidgetProps) => {
  if (!array?.length) {
    return null;
  }

  return (
    <Glassbox
      className="sidebar_widget relative max-h-max overflow-y-auto border border-[#006181]/12 py-5 shadow-none dark:border-[#006181]/20"
      {...rest}
    >
      <SimpleList className="border-none px-5 md:px-6" heading={title}>
        {array.map(post => {
          return (
            <li className="group mb-5 last:mb-3" key={post.id}>
              <Link
                className="text-secondary-foreground group-hover:text-[#006181] dark:group-hover:text-[#4da3c0] no-underline"
                href={`/category/${post.category?.slug}/${post.slug}`}
              >
                <p className="font-serif text-sm leading-snug font-medium tracking-tight md:text-[0.95rem]">
                  {post.title}
                </p>
              </Link>
              {post.published_at && (
                <p className="text-muted-foreground mt-1.5 text-xs">
                  {formatDate(post.published_at)}
                </p>
              )}
            </li>
          );
        })}
        <ExploreButton
          text={title ? `More ${title}` : 'Explore more'}
          link={
            link ??
            (array[0]
              ? `/category/${array[0].category?.slug}`
              : '#')
          }
          className="mt-2 p-0"
        />
      </SimpleList>
    </Glassbox>
  );
};

export default SidebarWidget;
