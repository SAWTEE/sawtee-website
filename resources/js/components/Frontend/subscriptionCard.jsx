import { MailboxIcon } from 'lucide-react';
import { SubscribeForm } from './NewsletterCallout';

const SubscriptionCard = ({
  children,
  showIcon = false,
  showChildren = false,
  headingText = 'Subscribe to our Newsletter',
  subText,
}) => {
  return (
    <div className="relative w-full text-center">
      {showIcon && (
        <MailboxIcon className="mx-auto h-24 w-24 text-slate-600 dark:text-slate-300" />
      )}
      {/* <h4 className="text-2xl font-bold uppercase text-slate-800 dark:text-slate-300">
        {headingText}
      </h4> */}
      {subText && <p className="mt-2 text-sm text-theme-500">{subText}</p>}

      {showChildren && <div>{children}</div>}

      <SubscribeForm />

{/* <div data-supascribe-embed-id="164835946128" data-supascribe-subscribe></div> */}


    </div>
  );
};

export default SubscriptionCard;
