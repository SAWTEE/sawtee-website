import ApplicationLogo from '@/components/shared/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { ModeToggle } from '../Frontend/header/mode-toggle';

export default function Guest({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
      <div className="absolute bottom-10 right-10">
        <ModeToggle />
      </div>
      <div>
        <Link href="/">
          <ApplicationLogo className="h-20 w-20" />
        </Link>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </div>
  );
}
