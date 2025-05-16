
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Mail, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { currentUser, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto py-2">
        <div className="flex items-center gap-2 mb-6">
          <UserCircle2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-full" />
            </div>
             <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    // This should ideally be handled by the (app) layout redirecting to login
    return <p>Not authenticated. Redirecting...</p>; 
  }

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <UserCircle2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="items-center text-center border-b pb-6">
          <Avatar className="h-24 w-24 mb-4 text-3xl">
            {/* Placeholder for actual image if available */}
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(currentUser.name)}`} alt={currentUser.name || "User Avatar"} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{currentUser.name || "User"}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-4 w-4" /> {currentUser.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
            <p className="text-lg">{currentUser.name || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
            <p className="text-lg">{currentUser.email}</p>
          </div>
          {/* Add more profile fields here as needed */}
          <Button onClick={logout} className="w-full mt-4" variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
          <p className="text-xs text-center text-muted-foreground pt-4">
            Note: Profile editing is not yet implemented in this prototype.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
