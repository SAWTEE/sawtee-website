import { Monitor, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/shared/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const themes = [
  {
    value: 'light',
    label: 'Light',
    description: 'Bright, daylight palette',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Low-light reading palette',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Match device preference',
    icon: Monitor,
  },
] as const;

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
} as const;

type ThemeValue = (typeof themes)[number]['value'];

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const activeLabel = themeLabels[theme] ?? 'System';
  const ariaLabel = `Color theme: ${activeLabel}. Change theme`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={ariaLabel}
          aria-haspopup="menu"
          title={`Theme: ${activeLabel}`}
          className={cn(
            'text-muted-foreground relative h-10 w-10 shrink-0 rounded-md border border-[#006181]/15 bg-transparent shadow-none transition-colors',
            'hover:text-primary hover:border-[#006181]/35 hover:bg-[#006181]/5',
            'focus-visible:ring-[#006181]/40',
            'data-[state=open]:text-primary data-[state=open]:border-[#006181]/35 data-[state=open]:bg-[#006181]/5',
            'dark:border-[#006181]/30 dark:text-zinc-300',
            'dark:hover:border-[#006181]/45 dark:hover:bg-[#006181]/10 dark:hover:text-zinc-100',
            'dark:data-[state=open]:border-[#006181]/45 dark:data-[state=open]:bg-[#006181]/10 dark:data-[state=open]:text-zinc-100'
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
          <span className="sr-only">
            Current theme: {activeLabel}
            {theme === 'system' && resolvedTheme ? ` (${resolvedTheme})` : ''}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[12.5rem] border border-[#006181]/15 p-1.5 shadow-lg dark:border-[#006181]/30"
      >
        <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#006181]/10 dark:bg-[#006181]/20" />
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={value => setTheme(value as ThemeValue)}
        >
          {themes.map(({ value, label, description, icon: Icon }) => {
            const selected = theme === value;

            return (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                className={cn(
                  'cursor-pointer rounded-md py-2 pr-2 pl-8 text-sm',
                  'focus:text-foreground focus:bg-[#006181]/8',
                  'dark:focus:bg-[#006181]/15 dark:focus:text-zinc-100',
                  selected &&
                    'text-foreground bg-[#006181]/6 dark:bg-[#006181]/12 dark:text-zinc-100'
                )}
              >
                <span className="flex items-start gap-2.5">
                  <Icon
                    aria-hidden
                    strokeWidth={1.75}
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0',
                      selected
                        ? 'text-[#006181] dark:text-[#4da3c0]'
                        : 'text-muted-foreground'
                    )}
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="leading-none font-medium">{label}</span>
                    <span className="text-muted-foreground text-[11px] leading-snug font-normal">
                      {description}
                    </span>
                  </span>
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
