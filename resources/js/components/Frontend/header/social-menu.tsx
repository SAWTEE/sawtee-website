import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { SocialMenuItem } from '@/types';
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '../../shared/icons';

type SocialMenuProps = {
  menu?: SocialMenuItem[] | null;
  className?: string;
};

const networkLabels: Record<string, string> = {
  twitter: 'Twitter',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

export const SocialMenu = ({
  menu,
  className = '',
  ...props
}: SocialMenuProps) => (
  <ul
    className={cn('mt-4 flex space-x-4 sm:justify-center lg:mt-0', className)}
    {...props}
  >
    {menu?.map((item: any) => {
      const SocialIcon = icons[item.name as keyof typeof icons];
      if (!SocialIcon) {
        return null;
      }
      const styles = () => {
        if (item.name === 'twitter') {
          return 'bg-brand-twitter hover:bg-brand-twitter/80';
        }
        if (item.name === 'youtube') {
          return 'bg-brand-youtube hover:bg-brand-youtube/80';
        }
        if (item.name === 'linkedin') {
          return 'bg-brand-linkedin hover:bg-brand-linkedin/80';
        }
        if (item.name === 'facebook') {
          return 'bg-brand-facebook hover:bg-brand-facebook/80';
        }
        return '';
      };
      const label = networkLabels[item.name] ?? item.name;
      return (
        <SocialMenuListItem
          key={item.name}
          className={styles()}
          link={item.link}
          label={`SAWTEE on ${label}`}
        >
          <SocialIcon className="h-5 w-5 text-white" aria-hidden />
        </SocialMenuListItem>
      );
    })}
  </ul>
);

function SocialMenuListItem({
  link,
  className = '',
  children,
  label,
}: {
  link?: string;
  className?: string;
  children?: ReactNode;
  label: string;
}) {
  return (
    <li
      className={cn('rounded-full bg-gray-700 hover:bg-gray-700/90', className)}
    >
      <a
        href={link}
        className="flex h-9 w-9 items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
      >
        {children}
      </a>
    </li>
  );
}

const icons = {
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
};

const SocialNav = ({
  menu,
  className = '',
}: {
  menu?: SocialMenuItem[] | null;
  className?: string;
}) => (
  <div className={cn('ml-auto block', className)}>
    <SocialMenu menu={menu} />
  </div>
);

export default SocialNav;
