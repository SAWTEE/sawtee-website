import type { HTMLAttributes } from 'react';

import SimpleAlerts from '@/components/Frontend/SimpleAlerts';

type ReformMonitorProps = HTMLAttributes<HTMLElement> & {
  content?: string | null;
};

const ReformMonitor = ({ content, ...rest }: ReformMonitorProps) => {
  return (
    <section className="w-full px-10 pt-5 pb-20 lg:px-20" {...rest}>
      <h1 className="sr-only">Reform Monitoring Platform</h1>
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
