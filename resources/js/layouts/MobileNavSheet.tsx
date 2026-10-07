import SearchModal from '@/components/Frontend/header/searchModal';
import MobileMenu from '@/components/Frontend/mobileMenu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { MenuItem, SocialMenuItem, SocialMenuLink } from '@/types';

type MobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: MenuItem[];
  socialMenu: SocialMenuLink[];
};

export default function MobileNavSheet({
  open,
  onOpenChange,
  menu,
  socialMenu,
}: MobileNavSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
          <div className="mx-auto my-4">
            <SearchModal />
          </div>
        </SheetHeader>

        <MobileMenu
          menu={menu}
          socialLinks={socialMenu as SocialMenuItem[]}
          showSocialLinks={true}
        />
      </SheetContent>
    </Sheet>
  );
}
