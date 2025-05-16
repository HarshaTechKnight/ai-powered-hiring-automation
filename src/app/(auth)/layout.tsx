
"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { APP_ICON, APP_NAME } from '@/config/nav';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && currentUser) {
      router.push('/dashboard'); // Redirect to dashboard if already logged in
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || (!isLoading && currentUser)) { // Show loader if loading or if user exists (before redirect)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-semibold text-primary">
            <APP_ICON className="h-8 w-8" />
            <span>{APP_NAME}</span>
        </Link>
      </div>
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg sm:p-8">
        {children}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {APP_NAME}. For demonstration purposes only.
      </p>
    </div>
  );
}
