import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,

  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({
  user,
  menu,
  ...props
}) {

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <SidebarMenu>
              <SidebarMenuItem>

              </SidebarMenuItem>
         <Link
            href={route('admin.dashboard')}
          >

              SAWTEE CMS

          </Link>
          </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain menu={menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
