
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeScreeningClientForm } from "@/components/resume-screening/resume-screening-form";
import { useCandidates } from "@/contexts/candidate-context";
import type { Candidate } from "@/types";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CandidateResumeScreeningPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;
  const { getCandidateById, loading: candidatesLoading } = useCandidates();
  const [candidate, setCandidate] = useState<Candidate | null | undefined>(undefined); // undefined for initial, null if not found

  useEffect(() => {
    if (!candidatesLoading && candidateId) {
      const foundCandidate = getCandidateById(candidateId);
      setCandidate(foundCandidate);
    }
  }, [candidateId, getCandidateById, candidatesLoading]);

  if (candidatesLoading || candidate === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (candidate === null) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2">Candidate Not Found</h2>
        <p className="text-muted-foreground mb-4">The candidate you are looking for does not exist.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Resume Screening for {candidate.name}</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Screen {candidate.name}'s Resume</CardTitle>
          <CardDescription>
            Upload {candidate.name}'s resume and provide weighting criteria. Previous criteria are pre-filled if available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeScreeningClientForm 
            candidate={candidate} 
            onScreeningComplete={() => router.push('/dashboard')} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
