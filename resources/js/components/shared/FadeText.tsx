import { cn } from '@/lib/utils';

export function FadeText({
  className = '',
  text,
}: {
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  text?: string;
  framerProps?: unknown;
}) {
  return (
    <span className={cn('motion-safe:animate-fade-up inline-block', className)}>
      {text}
    </span>
  );
}
