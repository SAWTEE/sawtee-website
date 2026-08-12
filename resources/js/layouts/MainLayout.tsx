import { usePage } from '@inertiajs/react';
import { ArrowUpToLineIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';

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

type MainLayoutProps = {
  children?: ReactNode;
  className?: string;
};

export default function MainLayout({ children, className }: MainLayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
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

    const updateScrollProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const next =
        scrollable > 0
          ? Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100))
          : 0;

      setScrollProgress(next);
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
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

      <button
        type="button"
        className="scroll-to-top"
        style={
          {
            '--scroll-progress': scrollProgress,
          } as CSSProperties
        }
        aria-label={`Scroll to top. Reading progress ${Math.round(scrollProgress)} percent.`}
        onClick={scrollToTop}
      >
        <span className="scroll-to-top__track" aria-hidden />
        <span className="scroll-to-top__ring" aria-hidden />
        <span className="scroll-to-top__face">
          <ArrowUpToLineIcon className="scroll-to-top__icon" aria-hidden />
        </span>
      </button>
    </ThemeProvider>
  );
}
