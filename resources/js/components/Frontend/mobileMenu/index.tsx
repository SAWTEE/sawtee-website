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

const MenuLink = ({ title, url, index, isOpen, ...rest }) => {
  return (
    <Link
      href={url}
      className="flex p-4 text-primary-foreground no-underline hover:underline"
      {...rest}
    >
      <p>
        <span className="pr-2">{index + ' ' + '|'}</span>
        {title}
      </p>
    </Link>
  );
};

const DropDownMenu = ({ menuItem, index, className }) => {
  return (
    <ul className={'w-full list-none space-y-4'}>
      <Collapsible>
        <li
          className={
            'group flex w-full items-center justify-between gap-4 border-b-2 border-b-gray-500 text-lg'
          }
        >
          <MenuLink
            className={cn(
              'flex w-full p-4 no-underline hover:underline',
              className
            )}
            title={menuItem.title}
            url={menuItem.url}
            index={`0${index + 1}`}
            isOpen={false}
          />
          <CollapsibleTrigger>
            {menuItem.children && (
              <ChevronDownIcon
                className="h-6 w-6 transition-all duration-200 ease-in-out"
                transition={'all .25s ease-in-out'}
              />
            )}
          </CollapsibleTrigger>
        </li>
        <CollapsibleContent className="w-full transition-all duration-200 ease-in">
          {menuItem?.children?.map((child, index) => (
            <React.Fragment key={child.title}>
              <DropDownMenu
                className={'ml-4'}
                menuItem={child}
                index={index}
                padding={'5px'}
                size="sm"
              />
            </React.Fragment>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </ul>
  );
};

const MobileMenu = ({
  menu = null,
  showSocialLinks = false,
  socialLinks = null,
}) => {
  return (
    <ScrollArea className="h-full px-4">
      {menu &&
        menu.map((menuItem, index) => (
          <React.Fragment key={menuItem.title}>
            <DropDownMenu menuItem={menuItem} index={index} />
          </React.Fragment>
        ))}

      {showSocialLinks && (
        <div className="mx-auto my-5 p-5">
          <SocialMenu ml="0" menu={socialLinks} />
        </div>
      )}
    </ScrollArea>
  );
};

export default MobileMenu;
