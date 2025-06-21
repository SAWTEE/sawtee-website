import { Link } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import ListItem from '../shared/ListItem';

export default function VerticalTimeline({ items }) {
  return (
    <div className={'-my-6'}>
      {items.map((item, index) => {
        const file = item.media.filter(
          m => m.collection_name === 'post-files'
        )[0];
        return (
          <div key={item.id} className="group relative py-6 pl-8 sm:pl-32">
            <div className="mb-1 flex flex-col items-center before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3 before:self-start before:bg-slate-300 before:px-px after:absolute after:left-2 after:box-content after:h-3 after:w-3 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-4 after:border-slate-50 after:bg-sky-600 group-last:before:hidden sm:flex-row sm:before:left-0 sm:before:ml-[6.5rem] sm:after:left-0 sm:after:ml-[6.5rem]">
              <time className="left-0 mb-3 inline-flex h-6 w-20 translate-y-0.5 items-center justify-center rounded-full bg-sky-100 px-2 text-xs font-semibold uppercase text-sky-600 sm:absolute sm:mb-0">
                {formatDate(item.published_at, 'MMM dd')}
              </time>
              <ListItem className="mx-0 max-w-md">
                <a target="_blank" href={file ? file.original_url : ''}>
                  <h3 className="md:text-md font-sans text-sm leading-5 text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 lg:text-lg">
                    {item.title}
                  </h3>
                </a>
              </ListItem>
            </div>
            <div className="text-slate-500">{item.excerpt}</div>
          </div>
        );
      })}
    </div>
  );
}
