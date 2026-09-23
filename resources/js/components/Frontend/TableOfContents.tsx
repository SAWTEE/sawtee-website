import { Link } from '@inertiajs/react';

import type { Article } from '@/types';

type TableOfContentsProps = {
  articles?: Article[] | null;
  volumeSlug?: string | null;
};

export const TableOfContents = ({
  articles = null,
  volumeSlug = null,
}: TableOfContentsProps) => {
  return (
    <section className="mt-2">
      {articles && articles.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {articles.map(article => {
            return (
              <li
                className="group border-theme-600/10 dark:border-theme-600/20 border-b py-4 last:border-b-0"
                key={article.id}
              >
                <div className="flex w-full flex-1 flex-col gap-1.5">
                  <Link
                    className="text-secondary-foreground group-hover:text-theme-600 dark:group-hover:text-theme-450 font-serif text-lg leading-snug font-medium tracking-tight no-underline md:text-xl"
                    href={`/category/publications/trade-insight/${volumeSlug}/${article.slug}`}
                  >
                    {article.title}
                  </Link>

                  <span className="text-muted-foreground text-xs font-medium">
                    {article.author ? article.author : 'Author not specified'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
          <p>No articles in this volume yet.</p>
        </div>
      )}
    </section>
  );
};
