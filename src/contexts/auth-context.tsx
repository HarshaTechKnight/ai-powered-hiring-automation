
"use client";

import type { User } from "@/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Keep async for future API calls
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "karmahire_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // MOCK IMPLEMENTATION - NOT SECURE FOR PRODUCTION
    // In a real app, call your backend API here
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo, allow any login if email is valid. In real app, verify credentials.
    if (email && pass) { // Basic check
      const user: User = { id: crypto.randomUUID(), email, name: email.split('@')[0] }; // Mock user
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setCurrentUser(user);
      router.push("/dashboard");
    } else {
        throw new Error("Invalid email or password");
    }
    setIsLoading(false);
  };

  const register = async (name: string, email: string, pass: string) => {
    // MOCK IMPLEMENTATION - NOT SECURE FOR PRODUCTION
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (name && email && pass) { // Basic check
        const user: User = { id: crypto.randomUUID(), email, name };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setCurrentUser(user);
        router.push("/dashboard");
    } else {
        throw new Error("All fields are required for registration");
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
