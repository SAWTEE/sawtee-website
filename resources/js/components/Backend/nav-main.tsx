'use client';

import { Link, usePage } from '@inertiajs/react';

import type { DashboardMenuItem } from '@/components/Backend/app-sidebar';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({ menu }: { menu?: DashboardMenuItem[] }) {
  const { url } = usePage();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>SAWTEE CMS Menu</SidebarGroupLabel>
      <SidebarMenu>
        {menu?.map((menuItem: any) => {
          const routeLink = route(menuItem.route);
          const active = routeLink.includes(url);
          const Icon = menuItem.icon;
          return (
            <Link
              key={menuItem.name}
              href={route(menuItem.route)}
              preserveState
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  {...({ isActive: active, tooltip: menuItem.name } as any)}
                >
                  {Icon ? <Icon /> : null}
                  <span>{menuItem.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
