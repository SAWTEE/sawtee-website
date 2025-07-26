'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function NavMain({ menu }) {
  const { url } = usePage();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>SAWTEE CMS Menu</SidebarGroupLabel>
      <SidebarMenu>
        {menu?.map(menuItem => {
          const routeLink = route(menuItem.route);
          const active = routeLink.includes(url);
          return (
            <Link href={route(menuItem.route)} preserveState>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active} tooltip={menuItem.name}>
                  {menuItem.icon && <menuItem.icon />}
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
