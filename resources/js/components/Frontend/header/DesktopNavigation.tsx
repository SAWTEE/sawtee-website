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
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MenuItem, SharedProps } from '@/types';
import MegaMenu from './MegaMenu';

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
        {(menu ?? []).map((menuItem: any, index: any) => {
          const active = menuItem.url === `${url}`;
          const hasMegaMenu =
            menuItem.name === 'Our Work' || menuItem.name === 'Know Us';
          const hasChildren = (menuItem.children?.length ?? 0) > 0;
          return (
            <NavigationMenuItem
              key={menuItem.title}
              className={
                !hasMegaMenu && hasChildren
                  ? 'dropdown group/dropdown relative'
                  : 'relative'
              }
            >
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
                    <AnimatePresence>
                      {elementFocused === index && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-md bg-accent dark:bg-neutral-800"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          layout
                          layoutId="focused-element"
                        />
                      )}
                    </AnimatePresence>
                  </NavigationMenuTrigger>
                </Link>
              </NavigationMenuLink>
              {hasMegaMenu && (
                <NavigationMenuContent className="z-40">
                  <MegaMenu item={menuItem} experts={experts} />
                </NavigationMenuContent>
              )}
              {!hasMegaMenu && hasChildren && <DropDown menuItem={menuItem} />}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const DropDown = ({
  className = '',
  menuItem,
}: {
  className?: string;
  menuItem: MenuItem;
}) => {
  return (
    <ul
      className={cn(
        // Tailwind v4: utility `hidden` beats @layer base CSS, so reveal via group-hover
        'dropdown-menu absolute left-0 z-50 mt-1 hidden w-full min-w-64 rounded-md border shadow-lg',
        'group-hover/dropdown:block group-focus-within/dropdown:block',
        className
      )}
    >
      <div className="rounded-lg bg-popover p-4">
        {menuItem.children?.map((item: any) => {
          return <ListItem key={item.title} item={item} href={item.url} />;
        })}
      </div>
    </ul>
  );
};

type ListItemProps = ComponentPropsWithoutRef<typeof Link> & {
  item: MenuItem;
  className?: string;
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className = '', item, ...props }, ref) => {
    const hasChildren = (item.children?.length ?? 0) > 0;

    return (
      <li
        className={cn(
          'dropdown group/dropdown relative flex w-full select-none items-center justify-between space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-bgDarker hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
      >
        <Link
          ref={ref}
          className="flex w-full items-center justify-between"
          {...props}
        >
          <span className="mr-1 font-medium leading-none">{item.title}</span>
          {hasChildren && (
            <ChevronDownIcon
              className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-hover/dropdown:rotate-180"
              aria-hidden="true"
            />
          )}
        </Link>
        {hasChildren && (
          <DropDown
            className="left-full top-0 z-20 mt-0 min-w-64"
            key={item.title}
            menuItem={item}
          />
        )}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
