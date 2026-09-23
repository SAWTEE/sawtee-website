import Glassbox from '@/components/Frontend/Glassbox';
import SimpleList from '@/components/Frontend/SimpleList';
import { formatDate } from '@/lib/helpers';
import { useSiteCopy } from '@/lib/site-copy';
import type { SubstackFeedItem } from '@/types';

type SubstackFeedWidgetProps = {
  posts?: SubstackFeedItem[] | null;
  publicationUrl?: string;
  title?: string;
};

export default function SubstackFeedWidget({
  posts = null,
  publicationUrl,
  title,
}: SubstackFeedWidgetProps) {
  const copy = useSiteCopy();
  const items = posts ?? [];
  const resolvedUrl = publicationUrl ?? copy.newsletter.substack_url;
  const resolvedTitle = title ?? copy.newsletter.substack_title;

  return (
    <Glassbox className="sidebar_widget border-theme-600/12 dark:border-theme-600/25 relative max-h-max overflow-y-auto border py-5 shadow-none">
      <SimpleList className="border-none px-5 md:px-6" heading={resolvedTitle}>
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
                  className="text-secondary-foreground group-hover:text-theme-600 dark:group-hover:text-theme-450 no-underline"
                >
                  <p className="md:text-prose font-serif text-sm leading-snug font-medium tracking-tight">
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
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-600 dark:text-theme-450 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-2 hover:underline-offset-4"
          >
            Read on Substack
          </a>
        </li>
      </SimpleList>
    </Glassbox>
  );
}
