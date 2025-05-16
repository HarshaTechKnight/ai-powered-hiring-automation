
"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_NAME, APP_ICON } from "@/config/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <APP_ICON className="h-6 w-6 text-primary" />
          <span>{APP_NAME}</span>
        </Link>
      </div>
      {/* Add User Menu or other header items here if needed */}
    </header>
  );
}
