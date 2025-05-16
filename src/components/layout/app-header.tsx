
"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_NAME, APP_ICON } from "@/config/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle2, LogOut, LogIn, UserPlus, Loader2 } from "lucide-react";

export function AppHeader() {
  const { currentUser, logout, isLoading } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <APP_ICON className="h-6 w-6 text-primary" />
          <span className="sr-only">{APP_NAME}</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={currentUser.avatarDataUri || `https://placehold.co/40x40.png?text=${getInitials(currentUser.name)}`} 
                    alt={currentUser.name || "User"} 
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
             <Button variant="outline" asChild>
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4"/> Sign In
                </Link>
            </Button>
            <Button asChild>
                <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4"/> Sign Up
                </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
