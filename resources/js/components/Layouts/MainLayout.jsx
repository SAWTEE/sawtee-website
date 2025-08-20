import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/components/shared/theme-provider';
import Footer from '@/components/Frontend/footer/footer';
import Header from '@/components/Frontend/header/header';
import { Button } from '@/components/ui/button';
import { mobileMenu, socialMenu } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { ArrowUpToLineIcon } from 'lucide-react';
import { register } from 'swiper/element/bundle';
import SearchModal from '@/components/Frontend/header/searchModal';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import MobileMenu from '../Frontend/mobileMenu';
export default function MainLayout({ children, ...rest }) {
  const [visible, setVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const page = usePage();
  const { primaryMenu, footerMenu } = page.props;

  const toggleVisibility = () => {
    if (typeof window !== 'undefined' && window.scrollY > 570) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);

    // Only add event listeners on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }
  }, []); // Remove window.scrollY dependency

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  // Register Swiper only on client side
  useEffect(() => {
    if (isClient) {
      register();
    }
  }, [isClient]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent aria-describedby={undefined}>
          <SheetHeader>
            <SheetTitle className="hidden" ariaLable="Mobile Menu">
              Mobile Menu
            </SheetTitle>
            <div className="mx-auto my-4">
              <SearchModal />
            </div>
          </SheetHeader>

          <MobileMenu
            menu={mobileMenu}
            socialLinks={socialMenu}
            showSocialLinks={true}
          />
        </SheetContent>
      </Sheet>
      <main id="main">
        <Header
          menu={primaryMenu}
          mobileMenu={mobileMenu}
          socialLinks={socialMenu}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

        <div className="relative mx-auto min-h-screen w-full px-6" {...rest}>
          {children}
          <Footer menu={footerMenu} socialMenu={socialMenu} />
        </div>

        <Button
          className={cn(
            'scroll-to-top group fixed bottom-20 right-12 z-50 flex h-10 w-10 items-center justify-center rounded-full p-2 backdrop-blur-md transition-all duration-300 ease-in-out',
            visible ? 'translate-y-0' : 'translate-y-60'
          )}
          aria-label="scroll to top"
          onClick={scrollToTop}
          size="icon"
        >
          <ArrowUpToLineIcon className="scroll-icon h-5 w-5" />
        </Button>
      </main>
    </ThemeProvider>
  );
}
