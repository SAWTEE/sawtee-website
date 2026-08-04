import SimpleAlerts from '@/components/Frontend/SimpleAlerts';

const ReformMonitor = ({ content, ...rest }) => {
  //   const reportUrl = import.meta.env.VITE_REFORM_PLATFORM_EMBBED_URL;
  return (
    <section className="w-full px-10 pb-20 pt-5 lg:px-20" {...rest}>
      {/* <iframe
        title="Reform Meter Dashboard_revised"
        src="https://app.powerbi.com/view?r=eyJrIjoiNzE2YjYyODYtYTFjYy00OTU2LTgzNjQtOGNiYzhjNzBiMDBmIiwidCI6IjE2YWJhZmY3LTMwYjItNDVkYS1iZWMwLWIxY2RjMmZiYzdhZCIsImMiOjEwfQ%3D%3D&amp;embedImagePlaceholder=true"
        width="100%"
        height="1200"
        loading="lazy"
        allowFullScreen="allowfullscreen"
        className="mt-10 w-full dark:bg-black"
      /> */}

      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}

      <SimpleAlerts
        title={null}
        className={'mt-8 text-center text-xl italic'}
        message={
          'The content displayed in this Platform may not necessarily reflect the official position of SAWTEE or its member institutions.'
        }
      />
    </section>
  );
};

export default ReformMonitor;
