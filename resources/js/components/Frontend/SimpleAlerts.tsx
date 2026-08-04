import { cn } from '@/lib/utils';

type SimpleAlertsProps = {
  title?: string | null;
  message?: string | null;
  className?: string;
};

export default function SimpleAlerts({
  title,
  message,
  className = '',
}: SimpleAlertsProps) {
  return (
    <div
      className={cn(
        'mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-gray-800 dark:text-blue-400',
        className
      )}
      role="alert"
    >
      <span className="font-medium">{title}</span> {message}
    </div>
  );
}
