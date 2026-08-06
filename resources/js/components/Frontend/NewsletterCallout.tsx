export default function NewsletterCallout() {
  return (
    <div className="rounded-lg bg-sky-100 px-6 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16 xl:flex xl:items-center dark:bg-sky-950">
      <div className="xl:w-0 xl:flex-1">
        <h2 className="text-2xl leading-8 font-extrabold tracking-tight text-sky-900 sm:text-3xl sm:leading-9 dark:text-sky-100">
          Receive the latest publication releases, events and monthly
          newsletter.
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-6 text-sky-900 dark:text-sky-200">
          Do you want to get notified? Sign up for our newsletter and
          you&apos;ll be among the first to find out about new publication
          releases, events and monthly newsletter.
        </p>
      </div>
      <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
        <div className="mt-3 sm:mt-0 sm:ml-3 sm:shrink-0">
          <SubscribeForm />
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
      title="Subscribe to the SAWTEE newsletter on Substack"
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
