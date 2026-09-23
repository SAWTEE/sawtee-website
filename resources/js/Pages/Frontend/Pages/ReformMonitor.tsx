import type { HTMLAttributes } from 'react';

import SimpleAlerts from '@/components/Frontend/SimpleAlerts';
import { useSiteCopy } from '@/lib/site-copy';

type ReformMonitorProps = HTMLAttributes<HTMLElement> & {
  content?: string | null;
};

const ReformMonitor = ({ content, ...rest }: ReformMonitorProps) => {
  const copy = useSiteCopy();

  return (
    <section className="w-full px-10 pt-5 pb-20 lg:px-20" {...rest}>
      <h1 className="sr-only">{copy.reform_monitor.title}</h1>
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}

      <SimpleAlerts
        title={null}
        className={'mt-8 text-center text-xl italic'}
        message={copy.reform_monitor.disclaimer}
      />
    </section>
  );
};

export default ReformMonitor;
