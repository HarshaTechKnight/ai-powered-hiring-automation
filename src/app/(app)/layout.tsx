
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AppHeader } from "@/components/layout/app-header";
import { APP_NAME, APP_ICON } from "@/config/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground">
              <APP_ICON className="h-7 w-7 text-sidebar-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
              <span className="group-data-[collapsible=icon]:hidden">{APP_NAME}</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 hidden md:block">
           <div className="group-data-[collapsible=icon]:hidden text-xs text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} {APP_NAME}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
