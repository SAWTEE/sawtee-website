import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ScrollArea } from './scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './tooltip';
export default function MySidebar({ isCollapsed, menu }) {
  const { url } = usePage();
  return (
    <aside
      className={cn(
        isCollapsed ? 'w-20' : 'w-64',
        'ease-nav-brand absolute inset-y-0 left-0 z-40 mt-20 translate-x-0 bg-white antialiased shadow-lg transition-transform duration-200 dark:bg-bgDarker'
      )}
    >
      <ScrollArea className="h-screen w-full p-4">
        <ul className="mb-0 flex flex-col gap-1 pl-0">
          {menu?.map(menuItem => {
            const routeLink = route(menuItem.route);
            const active = routeLink.includes(url);
            return isCollapsed ? (
              <li key={menuItem.name} className="w-full">
                <TooltipProvider>
                  <Link
                    href={route(menuItem.route)}
                    preserveState
                    className={cn(
                      'flex items-center justify-center gap-2 px-2 py-2 hover:text-muted-foreground dark:hover:text-white',
                      active
                        ? 'text-primary dark:text-secondary'
                        : 'text-foreground dark:text-muted-foreground'
                    )}
                  >
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            active
                              ? 'shadow-soft-2xl bg-primary dark:bg-muted'
                              : 'bg-secondary dark:bg-[rgba(255,255,255,0.08)]',
                            'flex items-center justify-center rounded-lg bg-center stroke-0 text-center hover:dark:bg-secondary xl:p-2.5'
                          )}
                        >
                          <menuItem.icon
                            className="h-4 w-4"
                            color={active ? 'white' : 'currentColor'}
                          />
                          <span className={'sr-only'}>{menuItem.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="z-50">
                        <span className="ease-soft pointer-events-none ml-1 opacity-100 duration-300">
                          {menuItem.name}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </Link>
                </TooltipProvider>
              </li>
            ) : (
              <li key={menuItem.name} className={cn('mb-1 w-full')}>
                <Link
                  href={route(menuItem.route)}
                  className={cn(
                    'mr-2 flex w-full items-center justify-start gap-2 rounded-lg border-2 border-slate-700 bg-center px-2 py-2 text-foreground dark:bg-[rgba(255,255,255,0.08)] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
                    active &&
                      'shadow-soft-2xl bg-primary text-white dark:bg-muted'
                  )}
                >
                  <menuItem.icon className="h-6 w-6" />
                  {menuItem.name && (
                    <span
                      className={cn(
                        menuItem.variant === 'default' &&
                          'ease-soft pointer-events-none ml-1 opacity-100 duration-300'
                      )}
                    >
                      {menuItem.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
      {!isCollapsed && (
        <div className="mt-8 flex w-full max-w-full flex-col items-center justify-center gap-4 px-3 lg:mb-0">
          <div className="text-md text-center leading-normal">
            © {new Date().getFullYear()} SAWTEE made &nbsp;by&nbsp;
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500"
            >
              Ankur Singh
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
