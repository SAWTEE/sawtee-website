import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import type { MenuItem } from '@/types';
import DesktopNavigation from './DesktopNavigation';
import { ModeToggle } from './mode-toggle';
import SearchModal from './searchModal';

type SiteHeaderProps = ComponentPropsWithoutRef<'header'> & {
  children?: ReactNode;
};

const SiteHeader = ({ className = '', children, ...rest }: SiteHeaderProps) => (
  <header
    className={cn(
      'sticky top-0 z-40 flex items-center justify-between overflow-visible bg-white py-2 shadow-md backdrop-blur-xl transition-transform duration-200 ease-out dark:bg-bgDarker',
      className
    )}
    {...rest}
  >
    {children}
  </header>
);

const SiteHeaderInner = ({
  className = '',
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      'mx-auto flex h-14 w-full max-w-full items-center justify-between px-3 sm:h-16 sm:px-6 md:px-8',
      className
    )}
  >
    {children}
  </div>
);

const Logo = ({ text = 'SAWTEE', src }: { text?: string; src?: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt="SAWTEE"
        width={128}
        height={32}
        className="h-auto w-24 max-w-full object-contain sm:w-32"
      />
    );
  }
  return (
    <p className="text-center font-sans font-bold uppercase text-theme-500 md:text-left">
      {text}
    </p>
  );
};

export const SiteLogo = ({
  src,
  established,
}: {
  src?: string;
  established?: string | null;
}) => {
  return (
    <div className="block shrink-0 text-center">
      <Link href="/" aria-label="SAWTEE home">
        <Logo src={src} />
      </Link>
      {established ? (
        <p className="text-xs font-semibold">Estd: {established}</p>
      ) : null}
    </div>
  );
};

type HeaderProps = {
  menu?: MenuItem[] | null;
  mobileMenu?: MenuItem[] | null;
  socialLinks?: unknown;
  showSocialLinks?: boolean;
  showMobileMenu?: boolean;
  setShowMobileMenu?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
};

const Header = ({
  menu = null,
  showMobileMenu = false,
  setShowMobileMenu,
  className,
}: HeaderProps) => {
  return (
    <SiteHeader className={className}>
      <SiteHeaderInner>
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <SiteLogo src="/assets/logo-sawtee.svg" />
          <DesktopNavigation menu={menu ?? []} />
          <div className="hidden shrink-0 gap-4 lg:flex">
            <ModeToggle />
            <SearchModal />
          </div>
          <div className="shrink-0 lg:hidden">
            <button
              type="button"
              onClick={() => setShowMobileMenu?.(!showMobileMenu)}
              className="text-primary hover:opacity-80"
              id="open-sidebar"
              aria-label="Open menu"
              aria-expanded={showMobileMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </SiteHeaderInner>
    </SiteHeader>
  );
};

export default Header;
