import { formatDate } from '@/lib/helpers';

import { Link } from '@inertiajs/react';
import ExploreButton from './ExploreButton';
import Glassbox from './Glassbox';
import SimpleList from './SimpleList';

const SidebarWidget = ({ array, title, link, ...rest }) => {
  return (
    <Glassbox
      className="sidebar_widget relative max-h-max overflow-y-auto border-none shadow-none"
      {...rest}
    >
      <SimpleList className={'border-none px-8'} heading={title}>
        {array?.map(post => {
          return (
            <li className="group mb-4" key={post.id}>
              <Link
                className="text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80"
                href={`/category/${post.category?.slug}/${post.slug}`}
              >
                <p className="lg:text-md text-sm leading-5">{post.title}</p>
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(post.published_at)}
              </p>
            </li>
          );
        })}
        <ExploreButton
          text={`More ${title}`}
          link={link ?? `${array[0].category?.slug / array[0].slug}`}
          className="p-0"
        />
      </SimpleList>
    </Glassbox>
  );
};

export default SidebarWidget;
