
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSchedulingClientForm } from "@/components/interview-scheduling/interview-scheduling-form";
import { useCandidates } from "@/contexts/candidate-context";
import type { Candidate } from "@/types";
import { ArrowLeft, CalendarClock, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CandidateInterviewSchedulingPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;
  const { getCandidateById, loading: candidatesLoading } = useCandidates();
  const [candidate, setCandidate] = useState<Candidate | null | undefined>(undefined);

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

  const canSchedule = candidate.status === 'Resume Screened' || candidate.status === 'Interview Scheduling' || candidate.status === 'Interview Scheduled';

  return (
    <div className="container mx-auto py-2">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
      <div className="flex items-center gap-2 mb-6">
        <CalendarClock className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Interview Scheduling for {candidate.name}</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Schedule Interview for {candidate.name}</CardTitle>
          <CardDescription>
            {candidate.interviewDate 
              ? `Current interview scheduled for: ${format(new Date(candidate.interviewDate), "PPP 'at' p")}. You can update it below.`
              : "Set up the date, time, and details for the candidate's interview."}
            {!canSchedule && <span className="block mt-2 text-destructive text-sm">This candidate is not in a status eligible for interview scheduling (current status: {candidate.status}).</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canSchedule ? (
            <InterviewSchedulingClientForm 
              candidate={candidate} 
              onScheduleComplete={() => router.push('/dashboard')}
            />
          ) : (
            <p className="text-muted-foreground">Please update the candidate's status to 'Resume Screened' or 'Interview Scheduling' to enable scheduling.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
