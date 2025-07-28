
export default function NewsletterCallout() {
  return (
    <div className="rounded-lg bg-sky-100 px-6 py-6 dark:bg-sky-900 md:px-12 md:py-12 lg:px-16 lg:py-16 xl:flex xl:items-center">
      <div className="xl:w-0 xl:flex-1">
        <h2 className="text-2xl font-extrabold leading-8 tracking-tight text-sky-700 dark:text-sky-300/80 sm:text-3xl sm:leading-9">
          Receive the latest publication releases, events and monthly
          newsletter.
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-6 text-sky-700/90 dark:text-sky-400/80">
          Do you want to get notified? Sign up for our newsletter and you'll be
          among the first to find out about new publication releases, events and
          monthly newsletter.
        </p>
      </div>
      <div className="mt-8 sm:w-full sm:max-w-md xl:ml-8 xl:mt-0">
        <div className="mt-3 sm:ml-3 sm:mt-0 sm:flex-shrink-0">
          <SubscribeForm />

          {/* <div data-supascribe-embed-id="164835946128" data-supascribe-subscribe></div> */}
        </div>
      </div>
    </div>
  );
}

export const SubscribeForm = () => {
  return (
    <iframe
      src="https://sawteenp.substack.com/embed"
      width="100%"
      height="220"
      style={{
        border: '1px solid #EEE',
        borderRadius: '0.25rem',
        background: 'white',
      }}
      frameBorder="0"
      scrolling="no"
    ></iframe>
  );
};
