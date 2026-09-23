import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/shared/theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const ariaLabel = `Switch to ${nextTheme} mode`;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={() => setTheme(nextTheme)}
      className={cn(
        'text-muted-foreground border-theme-600/15 relative h-10 w-10 shrink-0 rounded-md border bg-transparent shadow-none transition-colors',
        'hover:text-primary hover:border-theme-600/35 hover:bg-theme-600/5',
        'focus-visible:ring-theme-600/40',
        'dark:border-theme-600/30 dark:text-muted-foreground',
        'dark:hover:border-theme-600/45 dark:hover:bg-theme-600/10 dark:hover:text-foreground'
      )}
    >
      <Sun
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          'text-theme-600 h-[1.125rem] w-[1.125rem] transition-all duration-300 ease-out',
          'scale-100 rotate-0 opacity-100',
          'dark:scale-0 dark:-rotate-90 dark:opacity-0'
        )}
      />
      <Moon
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          'text-theme-450 absolute h-[1.125rem] w-[1.125rem] transition-all duration-300 ease-out',
          'scale-0 rotate-90 opacity-0',
          'dark:scale-100 dark:rotate-0 dark:opacity-100'
        )}
      />
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
}
