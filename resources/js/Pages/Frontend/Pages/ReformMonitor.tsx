import SimpleAlerts from '@/components/Frontend/SimpleAlerts';
import type { HTMLAttributes } from 'react';

type ReformMonitorProps = HTMLAttributes<HTMLElement> & {
  content?: string | null;
};

const ReformMonitor = ({ content, ...rest }: ReformMonitorProps) => {
  return (
    <section className="w-full px-10 pb-20 pt-5 lg:px-20" {...rest}>
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
