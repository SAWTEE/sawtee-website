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
        'bg-theme-50 text-theme-800 dark:bg-muted dark:text-theme-450 mb-4 rounded-lg p-4 text-sm',
        className
      )}
      role="alert"
    >
      <span className="font-medium">{title}</span> {message}
    </div>
  );
}
