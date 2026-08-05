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
import MultiLevelMenu from './MultiLevelMenu';

type DesktopNavigationProps = {
  menu?: MenuItem[];
};

export default function DesktopNavigation({
  menu = [],
}: DesktopNavigationProps) {
  const { url, props } = usePage<SharedProps>();
  const { experts } = props;

  const [elementFocused, setElementFocused] = React.useState<number | null>(
    null
  );
  const handleHoverButton = (index: number | null) => {
    setElementFocused(index);
  };

  return (
    <NavigationMenu
      className="hidden max-w-full justify-center lg:flex"
      onMouseLeave={() => {
        handleHoverButton(null);
      }}
      viewport={false}
    >
      <NavigationMenuList className="gap-4">
        {(menu ?? []).map((menuItem, index) => {
          const active = menuItem.url === `${url}`;
          const hasMegaMenu =
            menuItem.name === 'Our Work' || menuItem.name === 'Know Us';
          const hasChildren = (menuItem.children?.length ?? 0) > 0;

          if (hasMegaMenu) {
            return (
              <NavigationMenuItem key={menuItem.title} className="relative">
                <NavigationMenuLink
                  asChild
                  active={active}
                  className="p-0"
                  onMouseEnter={() => handleHoverButton(index)}
                >
                  <Link href={menuItem.url}>
                    <NavigationMenuTrigger
                      className={cn('bg-transparent dark:text-white')}
                      hasChildren={hasChildren}
                    >
                      {menuItem.title}
                      <FocusHighlight active={elementFocused === index} />
                    </NavigationMenuTrigger>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuContent className="z-40">
                  <MegaMenu item={menuItem} experts={experts} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          if (hasChildren) {
            return (
              <NavigationMenuItem
                key={menuItem.title}
                className="relative"
                onMouseEnter={() => handleHoverButton(index)}
              >
                <MultiLevelMenu
                  item={menuItem}
                  triggerClassName="bg-transparent"
                  triggerAddon={
                    <FocusHighlight active={elementFocused === index} />
                  }
                  openOnHover
                />
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={menuItem.title} className="relative">
              <NavigationMenuLink
                asChild
                active={active}
                className="p-0"
                onMouseEnter={() => handleHoverButton(index)}
              >
                <Link
                  href={menuItem.url}
                  className={cn(
                    'group relative inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium dark:text-white'
                  )}
                >
                  {menuItem.title}
                  <FocusHighlight active={elementFocused === index} />
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
          className="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-md bg-accent dark:bg-neutral-800"
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
