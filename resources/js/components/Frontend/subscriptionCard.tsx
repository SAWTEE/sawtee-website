import { MailboxIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { SubscribeForm } from './NewsletterCallout';

type SubscriptionCardProps = {
  children?: ReactNode;
  showIcon?: boolean;
  showChildren?: boolean;
  subText?: string | null;
};

const SubscriptionCard = ({
  children,
  showIcon = false,
  showChildren = false,
  subText,
}: SubscriptionCardProps) => {
  return (
    <div className="relative w-full text-center">
      {showIcon && (
        <MailboxIcon className="mx-auto h-24 w-24 text-slate-600 dark:text-slate-300" />
      )}

      {subText && <p className="text-theme-500 mt-2 text-sm">{subText}</p>}

      {showChildren && <div>{children}</div>}

      <SubscribeForm />
    </div>
  );
};

export default SubscriptionCard;
