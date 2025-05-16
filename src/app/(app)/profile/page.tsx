
"use client";

import React, { useRef, useState } from 'react';
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Mail, LogOut, UploadCloud, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { currentUser, logout, isLoading: authLoading, updateUserAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, GIF or WEBP image.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        await updateUserAvatar(file);
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been changed.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Could not update your avatar. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (authLoading && !currentUser) { // Show skeleton only if truly loading initial user
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
    return <p>Not authenticated. Redirecting...</p>; 
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <UserCircle2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="items-center text-center border-b pb-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 mb-2 text-3xl">
              <AvatarImage 
                src={currentUser.avatarDataUri || `https://placehold.co/100x100.png?text=${getInitials(currentUser.name)}`} 
                alt={currentUser.name || "User Avatar"} 
                data-ai-hint="user avatar"
              />
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-2 right-0 h-8 w-8 rounded-full group-hover:opacity-100 opacity-70 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Change avatar"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          <CardTitle className="text-2xl mt-2">{currentUser.name || "User"}</CardTitle>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
           <p className="text-xs text-center text-muted-foreground">
            Profile editing is not yet implemented for name/email.
          </p>
          <Button onClick={logout} className="w-full" variant="destructive" disabled={authLoading || isUploading}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
