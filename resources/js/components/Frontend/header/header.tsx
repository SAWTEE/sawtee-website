import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import DesktopNavigation from './DesktopNavigation';
import { ModeToggle } from './mode-toggle';
import SearchModal from './searchModal';

const SiteHeader = ({ className, children, rest }) => (
  <header
    className={cn(
      'ease 0.25s sticky top-0 z-40 flex items-center justify-between bg-white py-2 shadow-md backdrop-blur-xl transition-transform dark:bg-bgDarker',
      className
    )}
    {...rest}
  >
    {children}
  </header>
);

const SiteHeaderInner = ({ className, children }) => (
  <div
    className={cn(
      'mx-8 flex h-16 w-full items-center justify-between px-4 py-2',
      className
    )}
  >
    {children}
  </div>
);

const Logo = ({ text = 'SAWTEE', src }) => {
  if (src) {
    return <img src={src} alt="Logo" className="w-32 object-cover" />;
  }
  return (
    <p
      className={
        'text-center font-sans font-bold uppercase text-theme-500 md:text-left'
      }
    >
      {text}
    </p>
  );
};

export const SiteLogo = ({ src, established }) => {
  // check if the logo is a url,
  // we assume, if it's a url, it points to an image, else it's a text
  return (
    <div className="block shrink-0 text-center">
      <Link href="/" className=" " aria-label="logo">
        <Logo src={src} />
      </Link>
      {established && (
        <p className="text-xs font-semibold">Estd: {established}</p>
      )}
    </div>
  );
};

const Header = ({
  menu = null,
  mobileMenu = null,
  socialLinks = null,
  showSocialLinks = false,
  showMobileMenu = false,
  setShowMobileMenu = () => {},
  children,
  visible,
  ...props
}) => {
  return (
    <SiteHeader {...props}>
      <SiteHeaderInner>
        <div
          className="flex w-full justify-between"
          flex={{ base: 1 }}
          align="center"
          justify={'space-between'}
        >
          <SiteLogo src={'/assets/logo-sawtee.svg'} established={null} />
          <DesktopNavigation menu={menu} />
          <div className="hidden gap-4 lg:flex">
            <ModeToggle />
            <SearchModal />
          </div>
          <div className="block lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-primary hover:opacity-80"
              id="open-sidebar"
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
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </SiteHeaderInner>
    </SiteHeader>
  );
};

export default Header;
