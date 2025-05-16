
"use client";

import type { User } from "@/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toBase64DataURI } from "@/lib/file-utils"; // Helper for file to data URI

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserAvatar: (avatarFile: File) => Promise<void>; // New function to update avatar
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_STORAGE_KEY = "karmahire_mock_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading mock user from localStorage", error);
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const saveUserToLocalStorage = (user: User | null) => {
    if (user) {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to load existing user data, or create a new one with a default name
    let userToLogin: User;
    const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // If logging in with the same email, retain existing data, otherwise create new.
        // This is a simple mock logic, a real system would fetch user from DB.
        if (parsedUser.email === email) {
            userToLogin = parsedUser;
        } else {
             userToLogin = {
                id: crypto.randomUUID(),
                email: email,
                name: "User " + email.split('@')[0],
            };
        }
    } else {
        userToLogin = {
            id: crypto.randomUUID(),
            email: email,
            name: "User " + email.split('@')[0],
        };
    }
   
    setCurrentUser(userToLogin);
    saveUserToLocalStorage(userToLogin);
    setIsLoading(false);
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: email,
      name: name,
    };
    setCurrentUser(mockUser);
    saveUserToLocalStorage(mockUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    saveUserToLocalStorage(null);
    router.push("/login");
    setIsLoading(false);
  };

  const updateUserAvatar = async (avatarFile: File) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const avatarDataUri = await toBase64DataURI(avatarFile);
      const updatedUser = { ...currentUser, avatarDataUri };
      setCurrentUser(updatedUser);
      saveUserToLocalStorage(updatedUser);
    } catch (error) {
      console.error("Error updating avatar:", error);
      // Optionally show a toast message for error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout, updateUserAvatar }}>
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
