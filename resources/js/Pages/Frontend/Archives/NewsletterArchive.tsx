import VerticalTimeline from '@/components/Frontend/Timeline';
import type { Post } from '@/types';

type NewsletterArchiveProps = {
  posts?: Post[] | null;
};

const NewsletterArchive = ({ posts = null }: NewsletterArchiveProps) => {
  if (!posts || posts.length <= 0) {
    return (
      <section className="px-4 md:px-0">
        <ArchiveIntro />
        <p className="text-muted-foreground mt-10 text-center text-sm">
          No newsletter issues found yet.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-0">
      <ArchiveIntro />

      <div className="mt-10 md:mt-12">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#006181]/15 pb-3 dark:border-[#006181]/25">
          <h3 className="text-secondary-foreground font-serif text-lg font-semibold tracking-tight md:text-xl">
            Issue archive
          </h3>
          <span className="text-muted-foreground text-xs tracking-wide uppercase">
            PDF editions
          </span>
        </div>
        <div className="archive-list">
          <VerticalTimeline items={posts} />
        </div>
      </div>
    </section>
  );
};

function ArchiveIntro() {
  return (
    <header className="relative overflow-hidden rounded-xl border border-[#006181]/12 bg-[linear-gradient(160deg,rgba(0,97,129,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent)] px-6 py-8 md:px-8 md:py-10 dark:border-[#006181]/25 dark:bg-[linear-gradient(160deg,rgba(0,97,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(15,23,42,0.4),transparent)]">
      <p className="text-primary mb-2 text-xs font-semibold tracking-[0.18em] uppercase">
        Monthly e-newsletter
      </p>
      <h2 className="text-primary max-w-3xl font-serif text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
        Trade, Climate Change and Development Monitor
      </h2>
      <p className="text-secondary-foreground/80 mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
        Commentary and updates at the intersection of global trade, climate, and
        development across South Asia — published by SAWTEE.
      </p>
    </header>
  );
}

export default NewsletterArchive;
