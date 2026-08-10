import { usePage } from '@inertiajs/react';
import { ArrowUpToLineIcon } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

import Footer from '@/components/Frontend/footer/footer';
import Header from '@/components/Frontend/header/header';
import SearchModal from '@/components/Frontend/header/searchModal';
import MobileMenu from '@/components/Frontend/mobileMenu';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { mobileMenu } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { MenuItem, SharedProps, SocialMenuLink } from '@/types';

type MainLayoutProps = {
  children?: ReactNode;
  className?: string;
};

export default function MainLayout({ children, className }: MainLayoutProps) {
  const [visible, setVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const page = usePage<SharedProps>();
  const primaryMenu = page.props.primaryMenu ?? [];
  const footerMenu = page.props.footerMenu ?? [];
  const socialMenu: SocialMenuLink[] = page.props.socialMenu ?? [];
  const navMenu: MenuItem[] =
    primaryMenu.length > 0 ? primaryMenu : (mobileMenu as MenuItem[]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const toggleVisibility = () => {
      setVisible(window.scrollY > 570);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent aria-describedby={undefined}>
          <SheetHeader>
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            <div className="mx-auto my-4">
              <SearchModal />
            </div>
          </SheetHeader>

          <MobileMenu
            menu={navMenu}
            socialLinks={socialMenu}
            showSocialLinks={true}
          />
        </SheetContent>
      </Sheet>

      <Header
        menu={primaryMenu}
        mobileMenu={navMenu}
        socialLinks={socialMenu}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <main id="main">
        <div
          className={cn(
            'relative mx-auto min-h-screen w-full px-4 sm:px-6',
            className
          )}
        >
          {children}
        </div>
      </main>

      <Footer menu={footerMenu} socialMenu={socialMenu} />

      <Button
        className={cn(
          'scroll-to-top group fixed right-12 bottom-20 z-50 flex h-10 w-10 items-center justify-center rounded-full p-2 backdrop-blur-md transition-all duration-300 ease-in-out',
          visible ? 'translate-y-0' : 'translate-y-60'
        )}
        aria-label="Scroll to top"
        onClick={scrollToTop}
        size="icon"
      >
        <ArrowUpToLineIcon className="scroll-icon h-5 w-5" aria-hidden />
      </Button>
    </ThemeProvider>
  );
}
