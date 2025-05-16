
"use client";

import type { Candidate, CandidateStatus } from "@/types";
import type { AnalyzeInterviewOutput } from "@/ai/flows/analyze-interview";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CandidateContextType {
  candidates: Candidate[];
  addCandidate: (candidateData: Pick<Candidate, 'name' | 'email'>) => void;
  updateCandidate: (candidateId: string, updates: Partial<Candidate>) => void;
  updateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  getCandidateById: (candidateId: string) => Candidate | undefined;
  loading: boolean;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "karmahire_candidates";

export const CandidateProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCandidates = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCandidates) {
        // Filter out any invalid entries that might not parse as Candidate[]
        const parsedCandidates = JSON.parse(storedCandidates) as Candidate[];
        // We can't store File objects in localStorage, so they will be undefined here
        // This is fine as they are only needed transiently for uploads
        setCandidates(parsedCandidates.map(c => ({...c, resumeFile: undefined, interviewAudioFile: undefined })));
      }
    } catch (error) {
      console.error("Failed to load candidates from localStorage", error);
      // Optionally clear corrupted data
      // localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) { // Only save to localStorage after initial load
      // Don't store File objects in localStorage
      const candidatesToStore = candidates.map(({ resumeFile, interviewAudioFile, ...rest }) => rest);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(candidatesToStore));
    }
  }, [candidates, loading]);

  const addCandidate = (candidateData: Pick<Candidate, 'name' | 'email'>) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: crypto.randomUUID(),
      status: "Applied",
      createdAt: new Date().toISOString(),
    };
    setCandidates((prev) => [...prev, newCandidate]);
  };

  const updateCandidate = (candidateId: string, updates: Partial<Candidate>) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, ...updates } : c))
    );
  };
  
  const updateCandidateStatus = (candidateId: string, status: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status } : c))
    );
  };

  const getCandidateById = (candidateId: string) => {
    return candidates.find(c => c.id === candidateId);
  };

  return (
    <CandidateContext.Provider value={{ candidates, addCandidate, updateCandidate, updateCandidateStatus, getCandidateById, loading }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error("useCandidates must be used within a CandidateProvider");
  }
  return context;
};
