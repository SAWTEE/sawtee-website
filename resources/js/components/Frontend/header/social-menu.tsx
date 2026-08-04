import { cn } from '@/lib/utils';
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '../../shared/icons';

// warning for showSocialLinks and menu.length
export const SocialMenu = ({ menu, className, ...props }) => (
  <ul
    className={cn('mt-4 flex space-x-4 sm:justify-center lg:mt-0', className)}
    {...props}
  >
    {menu?.map(item => {
      const SocialIcon = icons[item.name];
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
      };
      return (
        <SocialMenuItem key={item.name} className={styles()} link={item.link}>
          <SocialIcon className="h-5 w-5 text-white" />
        </SocialMenuItem>
      );
    })}
  </ul>
);

const SocialMenuItem = ({ link, className, children }) => (
  <li
    className={cn('rounded-full bg-gray-700 hover:bg-gray-700/90', className)}
  >
    <a
      href={link}
      className="flex h-9 w-9 items-center justify-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  </li>
);

const icons = {
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
};

const SocialNav = ({ menu, className }) => (
  <div className={cn('ml-auto block', className)}>
    <SocialMenu menu={menu} />
  </div>
);

export default SocialNav;
