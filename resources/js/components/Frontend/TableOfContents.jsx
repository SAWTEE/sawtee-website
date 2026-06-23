import React from 'react';
import { Link } from '@inertiajs/react';

export const TableOfContents = ({ articles, volumeSlug }) => {
  return (
    <section className="mb-10 border-t border-border/40">
      {/* Vertical Scroll Area */}

      {articles && articles.length > 0 ? (
        <ul className="flex flex-col gap-1 pt-10">
          {articles.map(article => {
            console.log(article);
            return (
              <li className="group mb-4" key={article.id}>
                {/* Article Item Container */}
                <div className="flex w-full flex-1 flex-col gap-1.5">
                  <Link
                    className="text-secondary-foreground underline underline-offset-2 group-hover:text-primary/80 group-hover:underline-offset-4 dark:group-hover:text-secondary-foreground/80"
                    href={`/category/publications/trade-insight/${volumeSlug}/${article.slug}`}
                  >
                    {article.title}
                  </Link>

                  {/* Article Category Badge */}
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
