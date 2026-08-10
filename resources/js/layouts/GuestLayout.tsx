import type { ReactNode } from 'react';

import { ModeToggle } from '@/components/Frontend/header/mode-toggle';
import ApplicationLogo from '@/components/shared/ApplicationLogo';
import InertiaLink from '@/components/shared/InertiaLink';

type GuestLayoutProps = { children?: ReactNode };

export default function Guest({ children }: GuestLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
      <div className="absolute right-10 bottom-10">
        <ModeToggle />
      </div>
      <div>
        <InertiaLink href="/">
          <ApplicationLogo className="h-20 w-20" />
        </InertiaLink>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}
