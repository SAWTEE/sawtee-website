import type { ComponentProps, ComponentType } from 'react';

import { NavMain } from '@/components/Backend/nav-main';
import { NavUser } from '@/components/Backend/nav-user';
import ApplicationLogo from '@/components/shared/ApplicationLogo';
import InertiaLink from '@/components/shared/InertiaLink';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { User } from '@/types';

export type DashboardMenuItem = {
  name: string;
  icon?: ComponentType<{ className?: string }>;
  route: string;
};

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  user?: User | null;
  menu?: DashboardMenuItem[];
};

export function AppSidebar({ user, menu, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <InertiaLink
                href="/admin/dashboard"
                prefetch="mount"
                preserveState
                cacheTags={['admin-nav', 'dashboard']}
                className="flex items-center gap-2"
              >
                <ApplicationLogo className="size-5" />
                <span className="text-base font-semibold">SAWTEE CMS</span>
              </InertiaLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain menu={menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? undefined} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
