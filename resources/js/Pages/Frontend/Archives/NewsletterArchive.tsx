import VerticalTimeline from '@/components/Frontend/Timeline';
import type { Post } from '@/types';

type NewsletterArchiveProps = {
  posts?: Post[] | null;
};

const NewsletterArchive = ({ posts = null }: NewsletterArchiveProps) => {
  if (!posts || posts.length <= 0) return 'No posts found';

  return (
    <section className="container max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="text-primary mb-2 font-serif text-xl font-bold md:text-2xl lg:text-3xl xl:text-4xl">
          Trade, Climate Change and Development Monitor
        </h2>
        <span className="text-secondary-foreground text-sm">
          Monthly E-Newsletter of South Asia Watch on Trade, Economics and
          Environment
        </span>
      </div>
      <div className="archive-list">
        <VerticalTimeline items={posts} />
      </div>
    </section>
  );
};

export default NewsletterArchive;
