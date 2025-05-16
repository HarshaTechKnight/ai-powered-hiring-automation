
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/nav"; // APP_NAME, APP_ICON removed as they are in SidebarHeader
import type { NavItem } from "@/config/nav";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { currentUser, isLoading } = useAuth(); // Get auth status

  const renderNavItem = (item: NavItem) => {
    // If item requires auth and user is not logged in (and not loading), don't render
    if (item.authRequired && !isLoading && !currentUser) {
      return null;
    }

    // If item does NOT require auth (e.g. a public landing page link in future)
    // or if user IS logged in, then render
    return (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href} passHref legacyBehavior>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
            tooltip={item.title}
            onClick={() => setOpenMobile(false)}
            className="justify-start"
            disabled={item.disabled}
          >
            <a>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <ScrollArea className="flex-1">
      <SidebarMenu>
        {navItems.map(renderNavItem)}
      </SidebarMenu>
    </ScrollArea>
  );
}
