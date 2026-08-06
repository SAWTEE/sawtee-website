import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import type { MenuItem, SharedProps } from '@/types';
import MegaMenu from './MegaMenu';
import MultiLevelMenu, { topLevelNavItemClassName } from './MultiLevelMenu';

type DesktopNavigationProps = {
  menu?: MenuItem[];
};

/** Mega menus share a dedicated layout; names match MegaMenu.tsx. */
const MEGA_MENU_NAMES = new Set(['Our Work', 'Know Us']);

function menuItemKey(item: MenuItem, index: number): string {
  if (item.id != null) {
    return String(item.id);
  }
  return `${item.title}-${item.url}-${index}`;
}

function usesMegaMenu(item: MenuItem): boolean {
  return item.name != null && MEGA_MENU_NAMES.has(item.name);
}

function hasMenuChildren(item: MenuItem): boolean {
  return (item.children?.length ?? 0) > 0;
}

export default function DesktopNavigation({
  menu = [],
}: DesktopNavigationProps) {
  const { url, props } = usePage<SharedProps>();
  const { experts } = props;

  // Single source of truth for hover/open highlight across mega, multilevel, and links.
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const clearTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const activate = React.useCallback((key: string) => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
    setActiveKey(key);
  }, []);

  // Delay clearing so the pointer can cross into portaled dropdown content
  // without immediately forcing the multilevel menu closed.
  const scheduleClearActive = React.useCallback(() => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
    }
    clearTimer.current = setTimeout(() => {
      setActiveKey(null);
      clearTimer.current = null;
    }, 120);
  }, []);

  React.useEffect(
    () => () => {
      if (clearTimer.current) {
        clearTimeout(clearTimer.current);
      }
    },
    []
  );

  return (
    <NavigationMenu
      className="hidden max-w-full justify-center lg:flex"
      onMouseLeave={scheduleClearActive}
      viewport={false}
    >
      <NavigationMenuList className="gap-4">
        {(menu ?? []).map((menuItem, index) => {
          const key = menuItemKey(menuItem, index);
          const active = menuItem.url === `${url}`;
          const highlighted = activeKey === key;
          const mega = usesMegaMenu(menuItem);
          const nested = hasMenuChildren(menuItem);

          if (mega) {
            return (
              <NavigationMenuItem key={key} className="relative" value={key}>
                <NavigationMenuLink
                  asChild
                  active={active}
                  className="p-0"
                  onPointerEnter={() => activate(key)}
                  onFocus={() => activate(key)}
                >
                  <Link href={menuItem.url}>
                    <NavigationMenuTrigger
                      className={cn(topLevelNavItemClassName)}
                      hasChildren={nested}
                    >
                      {menuItem.title}
                      <FocusHighlight active={highlighted} />
                    </NavigationMenuTrigger>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuContent className="z-40">
                  <MegaMenu item={menuItem} experts={experts} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          if (nested) {
            return (
              <NavigationMenuItem
                key={key}
                className="relative"
                value={key}
                onPointerEnter={() => activate(key)}
              >
                <MultiLevelMenu
                  item={menuItem}
                  triggerClassName={topLevelNavItemClassName}
                  triggerAddon={<FocusHighlight active={highlighted} />}
                  openOnHover
                  open={activeKey === key}
                  onOpenChange={open => {
                    if (open) {
                      activate(key);
                      return;
                    }
                    // Functional update avoids stale closures from delayed hover-close.
                    setActiveKey(current => (current === key ? null : current));
                  }}
                />
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={key} className="relative" value={key}>
              <NavigationMenuLink
                asChild
                active={active}
                className="p-0"
                onPointerEnter={() => activate(key)}
                onFocus={() => activate(key)}
              >
                <Link href={menuItem.url} className={cn(topLevelNavItemClassName)}>
                  {menuItem.title}
                  <FocusHighlight active={highlighted} />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function FocusHighlight({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="bg-accent absolute top-0 right-0 bottom-0 left-0 -z-10 rounded-md dark:bg-neutral-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          layout
          layoutId="focused-element"
        />
      ) : null}
    </AnimatePresence>
  );
}
