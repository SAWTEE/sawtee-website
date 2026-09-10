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
        'text-muted-foreground relative h-10 w-10 shrink-0 rounded-md border border-[#006181]/15 bg-transparent shadow-none transition-colors',
        'hover:text-primary hover:border-[#006181]/35 hover:bg-[#006181]/5',
        'focus-visible:ring-[#006181]/40',
        'dark:border-[#006181]/30 dark:text-zinc-300',
        'dark:hover:border-[#006181]/45 dark:hover:bg-[#006181]/10 dark:hover:text-zinc-100'
      )}
    >
      <Sun
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          'h-[1.125rem] w-[1.125rem] text-[#006181] transition-all duration-300 ease-out',
          'scale-100 rotate-0 opacity-100',
          'dark:scale-0 dark:-rotate-90 dark:opacity-0'
        )}
      />
      <Moon
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          'absolute h-[1.125rem] w-[1.125rem] text-[#4da3c0] transition-all duration-300 ease-out',
          'scale-0 rotate-90 opacity-0',
          'dark:scale-100 dark:rotate-0 dark:opacity-100'
        )}
      />
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
}
