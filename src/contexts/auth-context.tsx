
"use client";

import type { User } from "@/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile 
} from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import Firebase auth instance

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "", // Firebase email can be null
          name: firebaseUser.displayName || undefined,
        };
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting currentUser and redirecting
      // No need to manually push to router here if (app)/layout.tsx handles it
    } catch (error: any) {
      // Firebase errors have a 'code' and 'message' property
      console.error("Firebase login error:", error);
      throw new Error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      // onAuthStateChanged will handle setting currentUser
      // Refresh user data to get displayName immediately if needed, or rely on onAuthStateChanged
      const updatedFirebaseUser = auth.currentUser;
       if (updatedFirebaseUser) {
         setCurrentUser({
           id: updatedFirebaseUser.uid,
           email: updatedFirebaseUser.email || "",
           name: updatedFirebaseUser.displayName || undefined,
         });
       }
      // No need to manually push to router here if (app)/layout.tsx handles it
    } catch (error: any) {
      console.error("Firebase registration error:", error);
      throw new Error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null); // Explicitly clear user
      router.push("/login"); // Navigate to login after sign out
    } catch (error: any) {
      console.error("Firebase logout error:", error);
      throw new Error(error.message || "Logout failed.");
    } finally {
      setIsLoading(false);
    }
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
