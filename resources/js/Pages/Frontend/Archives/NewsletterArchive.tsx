import VerticalTimeline from '@/components/Frontend/Timeline';
// Here we have used react-icons package for the icons

const NewsletterArchive = ({ posts }) => {
  if (!posts || posts.length <= 0) return 'No posts found';

  return (
    <section className="container max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="mb-2 font-sans text-xl font-bold text-primary md:text-2xl lg:text-3xl xl:text-4xl">
          Trade, Climate Change and Development Monitor
        </h2>
        <span className="text-sm text-secondary-foreground">
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
