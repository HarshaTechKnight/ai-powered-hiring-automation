
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
import { navItems, APP_NAME, APP_ICON } from "@/config/nav";
import type { NavItem } from "@/config/nav";

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const renderNavItem = (item: NavItem) => (
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

  return (
    <ScrollArea className="flex-1">
      <SidebarMenu>
        {navItems.map(renderNavItem)}
      </SidebarMenu>
    </ScrollArea>
  );
}
