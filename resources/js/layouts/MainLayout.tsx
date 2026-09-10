import { usePage } from '@inertiajs/react';
import { ArrowUpToLineIcon } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

import Footer from '@/components/Frontend/footer/footer';
import Header from '@/components/Frontend/header/header';
import SearchModal from '@/components/Frontend/header/searchModal';
import MobileMenu from '@/components/Frontend/mobileMenu';
import { ThemeProvider } from '@/components/shared/theme-provider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { mobileMenu } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { MenuItem, SharedProps, SocialMenuLink } from '@/types';

/** Show after roughly half a viewport of scroll (min 360px). */
const SCROLL_TOP_SHOW_PX = 360;

type MainLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function MainLayout({ children, className }: MainLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
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

    const updateScrollState = () => {
      const threshold = Math.max(
        SCROLL_TOP_SHOW_PX,
        Math.round(window.innerHeight * 0.45)
      );

      setShowScrollTop(document.documentElement.scrollTop >= threshold);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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

      <button
        type="button"
        className={cn(
          'scroll-to-top',
          showScrollTop && 'scroll-to-top--visible'
        )}
        aria-label="Back to top"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        disabled={!showScrollTop}
        onClick={scrollToTop}
      >
        <ArrowUpToLineIcon className="scroll-to-top__icon" aria-hidden />
        <span>Back to top</span>
      </button>
    </ThemeProvider>
  );
}
