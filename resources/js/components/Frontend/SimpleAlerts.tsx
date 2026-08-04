import { cn } from '@/lib/utils';

export default function SimpleAlerts({ title, message, className }) {
  return (
    <div
      class={cn(
        'mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-gray-800 dark:text-blue-400',
        className
      )}
      role="alert"
    >
      <span class="font-medium">{title}</span> {message}
    </div>
  );
}
