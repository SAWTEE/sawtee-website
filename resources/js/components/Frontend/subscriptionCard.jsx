import { MailboxIcon } from 'lucide-react';
import { SubscribeForm } from './NewsletterCallout';

const SubscriptionCard = ({
  children,
  showIcon = false,
  showChildren = false,
  subText,
}) => {
  return (
    <div className="relative w-full text-center">
      {showIcon && (
        <MailboxIcon className="mx-auto h-24 w-24 text-slate-600 dark:text-slate-300" />
      )}

      {subText && <p className="mt-2 text-sm text-theme-500">{subText}</p>}

      {showChildren && <div>{children}</div>}

      <SubscribeForm />
    </div>
  );
};

export default SubscriptionCard;
