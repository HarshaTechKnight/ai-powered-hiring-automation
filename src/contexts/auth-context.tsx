
"use client";

import type { User } from "@/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
// Firebase imports removed:
// import { 
//   onAuthStateChanged, 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword, 
//   signOut as firebaseSignOut, 
//   updateProfile 
// } from "firebase/auth";
// import { auth } from "@/lib/firebase"; 

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_STORAGE_KEY = "karmahire_mock_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true to simulate loading
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user from localStorage
    try {
      const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading mock user from localStorage", error);
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
    setIsLoading(false); // Finished "loading"
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // In a real mock, you might check credentials against a hardcoded list
    // For this, we'll just create a user
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: email,
      name: "Mock User " + email.split('@')[0], // Simple name generation
    };
    setCurrentUser(mockUser);
    try {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error("Error saving mock user to localStorage", error);
    }
    setIsLoading(false);
    // router.push('/dashboard'); // Handled by (app) layout
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: email,
      name: name,
    };
    setCurrentUser(mockUser);
     try {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error("Error saving mock user to localStorage", error);
    }
    setIsLoading(false);
    // router.push('/dashboard'); // Handled by (app) layout
  };

  const logout = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    try {
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing mock user from localStorage", error);
    }
    router.push("/login"); // Explicitly redirect to login on logout
    setIsLoading(false);
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
