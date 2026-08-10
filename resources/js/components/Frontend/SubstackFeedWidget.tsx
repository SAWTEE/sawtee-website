import Glassbox from '@/components/Frontend/Glassbox';
import SimpleList from '@/components/Frontend/SimpleList';
import { formatDate } from '@/lib/helpers';
import type { SubstackFeedItem } from '@/types';

type SubstackFeedWidgetProps = {
  posts?: SubstackFeedItem[] | null;
  publicationUrl?: string;
  title?: string;
};

const DEFAULT_PUBLICATION_URL = 'https://sawteenp.substack.com';

export default function SubstackFeedWidget({
  posts = null,
  publicationUrl = DEFAULT_PUBLICATION_URL,
  title = 'On Substack',
}: SubstackFeedWidgetProps) {
  const items = posts ?? [];

  return (
    <Glassbox className="sidebar_widget relative max-h-max overflow-y-auto border border-[#006181]/12 py-5 shadow-none dark:border-[#006181]/25">
      <SimpleList className="border-none px-5 md:px-6" heading={title}>
        {items.length > 0 ? (
          items.map(post => {
            const heading = post.subtitle?.trim() || post.title;
            const support =
              post.subtitle?.trim() && post.subtitle.trim() !== post.title
                ? post.title
                : null;

            return (
              <li className="group mb-5 last:mb-3" key={post.id}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-foreground no-underline group-hover:text-[#006181] dark:group-hover:text-[#4da3c0]"
                >
                  <p className="font-serif text-sm leading-snug font-medium tracking-tight md:text-[0.95rem]">
                    {heading}
                  </p>
                  {support ? (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                      {support}
                    </p>
                  ) : null}
                </a>
                {post.published_at ? (
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    {formatDate(post.published_at)}
                  </p>
                ) : null}
              </li>
            );
          })
        ) : (
          <li className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Latest Substack issues will appear here. Visit the publication for
            recent editions.
          </li>
        )}
        <li className="mt-2 list-none">
          <a
            href={publicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#006181] underline underline-offset-2 hover:underline-offset-4 dark:text-[#4da3c0]"
          >
            Read on Substack
          </a>
        </li>
      </SimpleList>
    </Glassbox>
  );
}
