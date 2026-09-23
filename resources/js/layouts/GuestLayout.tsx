import type { ReactNode } from 'react';

import { ModeToggle } from '@/components/Frontend/header/mode-toggle';
import ApplicationLogo from '@/components/shared/ApplicationLogo';
import InertiaLink from '@/components/shared/InertiaLink';
import { ThemeProvider } from '@/components/shared/theme-provider';

type GuestLayoutProps = { children: ReactNode };

export default function Guest({ children }: GuestLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="bg-muted dark:bg-background flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
        <div className="absolute right-10 bottom-10">
          <ModeToggle />
        </div>
        <div>
          <InertiaLink href="/">
            <ApplicationLogo className="h-20 w-20" />
          </InertiaLink>
        </div>

        <div className="dark:bg-muted mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
