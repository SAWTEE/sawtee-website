import * as React from 'react';

import { cn } from '@/lib/utils';
import { getGlassStyles, type GlassCustomization } from '@/lib/glass-utils';
import { hoverEffects, type HoverEffect } from '@/lib/hover-effects';

type GlassCardVariant =
  | 'classic'
  | 'default'
  | 'glass'
  | 'glassSubtle'
  | 'frosted'
  | 'fluted'
  | 'crystal';

export interface GlassCardProps extends React.ComponentProps<'div'> {
  variant?: GlassCardVariant;
  gradient?: boolean;
  animated?: boolean;
  hover?: HoverEffect;
  glass?: GlassCustomization;
}

function getVariantClass(
  variant: GlassCardVariant,
  hasCustomGlass: boolean
): string {
  if (variant === 'default') {
    return 'bg-card text-card-foreground border shadow-sm';
  }

  // Previous Glassbox look (pre Crenspire glass-ui)
  if (variant === 'classic') {
    return 'border border-white/40 bg-white/70 text-secondary-foreground shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/55 dark:text-zinc-200';
  }

  if (hasCustomGlass) {
    return 'glass-bg text-foreground';
  }

  const variants: Record<
    Exclude<GlassCardVariant, 'classic' | 'default'>,
    string
  > = {
    glass: 'glass-bg text-foreground',
    glassSubtle:
      'glass-bg text-foreground opacity-50 backdrop-blur-[var(--glass-blur-sm)]',
    frosted: 'glass-frosted text-foreground',
    fluted: 'glass-fluted text-foreground',
    crystal: 'glass-crystal text-foreground',
  };

  return variants[variant] ?? variants.glass;
}

/**
 * Crenspire glass-ui Card — separate from shadcn `@/components/ui/card`.
 * Default variant is classic (legacy Glassbox); purple demo gradients are opt-in only.
 */
export const Card = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = 'classic',
      gradient = false,
      animated = false,
      hover = 'none',
      glass,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const hasCustomGlass = glass !== undefined;
    const usesGlassStyles = variant !== 'default' && variant !== 'classic';
    const glassStyles = usesGlassStyles ? getGlassStyles(glass) : {};

    return (
      <div
        ref={ref}
        data-slot="glass-card"
        className={cn(
          'relative flex flex-col gap-6 overflow-hidden rounded-xl py-6',
          getVariantClass(variant, hasCustomGlass),
          gradient &&
            'from-theme-500/10 to-theme-500/5 bg-linear-to-br via-sky-500/10',
          animated &&
            'transition-all duration-300 hover:scale-[1.02] hover:shadow-[--glass-shadow-lg]',
          hoverEffects({ hover }),
          className
        )}
        style={{
          ...glassStyles,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'GlassCard';

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="glass-card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="glass-card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="glass-card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="glass-card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="glass-card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="glass-card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
