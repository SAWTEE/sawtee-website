import type { Article } from '@/types';
import { Link } from '@inertiajs/react';

type TableOfContentsProps = {
  articles?: Article[] | null;
  volumeSlug?: string | null;
};

export const TableOfContents = ({
  articles = null,
  volumeSlug = null,
}: TableOfContentsProps) => {
  return (
    <section className="mb-10 border-t border-border/40">
      {articles && articles.length > 0 ? (
        <ul className="flex flex-col gap-1 pt-10">
          {articles.map(article => {
            return (
              <li className="group mb-4" key={article.id}>
                <div className="flex w-full flex-1 flex-col gap-1.5">
                  <Link
                    className="text-xl text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80 md:text-2xl"
                    href={`/category/publications/trade-insight/${volumeSlug}/${article.slug}`}
                  >
                    {article.title}
                  </Link>

                  <span className="text-xs font-medium italic text-theme-500 dark:text-theme-300">
                    {article.author ? article.author : 'Author not specified'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <p>No articles in this volume yet.</p>
        </div>
      )}
    </section>
  );
};

export default TableOfContents;
