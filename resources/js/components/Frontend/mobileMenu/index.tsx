import { ModeToggle } from '@/components/Frontend/header/mode-toggle';
import { SocialMenu } from '@/components/Frontend/header/social-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import type { MenuItem, SocialMenuItem } from '@/types';

type MenuLinkProps = {
  title?: string;
  url?: string;
  index?: string;
  className?: string;
};

const MenuLink = ({
  title,
  url = '#',
  index,
  className,
  ...rest
}: MenuLinkProps) => {
  return (
    <Link
      href={url}
      className={cn(
        'text-foreground flex p-4 no-underline hover:underline',
        className
      )}
      {...rest}
    >
      <p>
        <span className="pr-2">{index ? `${index} |` : null}</span>
        {title}
      </p>
    </Link>
  );
};

const hasMenuChildren = (item: MenuItem): boolean =>
  (item.children?.length ?? 0) > 0;

type DropDownMenuProps = {
  menuItem: MenuItem;
  index: number;
  className?: string;
};

const DropDownMenu = ({
  menuItem,
  index,
  className = '',
}: DropDownMenuProps) => {
  const openable = hasMenuChildren(menuItem);

  return (
    <ul className="w-full list-none space-y-4">
      <Collapsible>
        <li className="text-foreground group flex w-full items-center justify-between gap-4 border-b-2 border-border text-lg dark:border-white/20">
          <MenuLink
            className={cn(
              'flex w-full p-4 no-underline hover:underline',
              className
            )}
            title={menuItem.title}
            url={menuItem.url}
            index={`0${index + 1}`}
          />
          {openable ? (
            <CollapsibleTrigger
              aria-label={`Toggle ${menuItem.title} submenu`}
              className="text-foreground shrink-0 p-2"
            >
              <ChevronDownIcon className="h-6 w-6 transition-all duration-200 ease-in-out" />
            </CollapsibleTrigger>
          ) : null}
        </li>
        {openable ? (
          <CollapsibleContent className="w-full transition-all duration-200 ease-in">
            {menuItem.children?.map((child: any, childIndex: any) => (
              <React.Fragment key={child.title}>
                <DropDownMenu
                  className="ml-4"
                  menuItem={child}
                  index={childIndex}
                />
              </React.Fragment>
            ))}
          </CollapsibleContent>
        ) : null}
      </Collapsible>
    </ul>
  );
};

type MobileMenuProps = {
  menu?: MenuItem[];
  showSocialLinks?: boolean;
  socialLinks?: SocialMenuItem[] | null;
};

/**
 * Mobile accordion nav. Uses the same Inertia menu tree as desktop
 * `MultiLevelMenu`, but Collapsible (not DropdownMenu) for touch UX.
 */
const MobileMenu = ({
  menu = [],
  showSocialLinks = false,
  socialLinks = null,
}: MobileMenuProps) => {
  return (
    <ScrollArea className="text-foreground h-full px-4">
      {(menu ?? []).map((menuItem: MenuItem, index: number) => (
        <React.Fragment key={menuItem.title}>
          <DropDownMenu menuItem={menuItem} index={index} />
        </React.Fragment>
      ))}

      <div className="mx-auto my-5 flex flex-col items-center gap-4 p-5">
        <ModeToggle />
        {showSocialLinks ? (
          <SocialMenu className="mt-0" menu={socialLinks} />
        ) : null}
      </div>
    </ScrollArea>
  );
};

export default MobileMenu;
