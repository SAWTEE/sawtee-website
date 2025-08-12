import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { DashBoardMenuItems } from '@/lib/data';
import { ModeToggle } from '@/components/Frontend/header/mode-toggle';
import { usePage } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function Authenticated({ user, children }) {
  const { url } = usePage();
  const sections = url.split('/').filter(Boolean);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Toaster />

        <AppSidebar user={user} menu={DashBoardMenuItems} />
        <SidebarInset className="bg-sidebar">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/admin/` + sections[1]}>
                      {sections[1]
                        ? sections[1].charAt(0).toUpperCase() +
                          sections[1].slice(1).replaceAll('-', ' ')
                          .split('?')[0]
                        : 'Home'}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {sections[2] && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  {sections[2] && (
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {sections[2].charAt(0).toUpperCase() +
                          sections[2].slice(1)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto px-8 flex items-center gap-2">
                <ModeToggle />
              </div>
            </div>
          </header>
          <div className=" p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
