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
import MegaMenu from './MegaMenu';

export default function DesktopNavigation({ menu }) {
  const { url, props } = usePage();
  const { experts } = props;

  const [elementFocused, setElementFocused] = React.useState(null);
  const handleHoverButton = index => {
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
        {menu.map((menuItem, index) => {
          const active = menuItem.url === `${url}`;
          const hasMegaMenu =
            menuItem.name === 'Our Work' || menuItem.name === 'Know Us';
          const hasChildren = menuItem.children.length > 0;
          return (
            <NavigationMenuItem
              key={menuItem.title}
              className={!hasMegaMenu ? 'dropdown' : ''}
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

const DropDown = ({ className, menuItem }) => {
  return (
    <ul
      className={cn(
        'dropdown-menu left-50 absolute mt-1 hidden w-full min-w-64 rounded-md border shadow-lg',
        className
      )}
    >
      <div className="rounded-lg bg-popover p-4">
        {menuItem.children?.map(item => {
          return <ListItem key={item.title} item={item} href={item.url} />;
        })}
      </div>
    </ul>
  );
};

const ListItem = React.forwardRef(({ className, item, ...props }, ref) => {
  return (
    <li
      className={cn(
        'dropdown relative flex w-full select-none items-center justify-between space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-bgDarker hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
    >
      <Link
        ref={ref}
        className="flex w-full items-center justify-between"
        {...props}
      >
        <span className="mr-1 font-medium leading-none">{item.title}</span>
        {item.children.length > 0 && (
          <ChevronDownIcon
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-300"
            aria-hidden="true"
          />
        )}
      </Link>
      {item.children.length > 0 && (
        <DropDown
          className="left-[14rem] top-0 z-20 min-w-64"
          key={item.title}
          menuItem={item}
        />
      )}
    </li>
  );
});
ListItem.displayName = 'ListItem';
