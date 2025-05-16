
"use client";

import { MoreHorizontal, FileText, Mic2, CheckCircle, XCircle, Clock, UserPlus, ArrowRightCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import type { Candidate, CandidateStatus } from "@/types";
import { useCandidates } from "@/contexts/candidate-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface CandidateActionsProps {
  candidate: Candidate;
}

const ALL_STATUSES: CandidateStatus[] = [
  'Applied', 'Resume Screening Pending', 'Resume Screened',
  'Interview Scheduling', 'Interview Scheduled', 'Interview Analysis Pending',
  'Interview Analyzed', 'Offer Extended', 'Hired', 'Rejected'
];

export function CandidateActions({ candidate }: CandidateActionsProps) {
  const router = useRouter();
  const { updateCandidateStatus } = useCandidates();
  const { toast } = useToast();

  const handleStatusUpdate = (status: CandidateStatus) => {
    updateCandidateStatus(candidate.id, status);
    toast({
      title: "Status Updated",
      description: `${candidate.name}'s status changed to ${status}.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/resume-screening/${candidate.id}`)}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Screen Resume</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/interview-analysis/${candidate.id}`)}
          disabled={!candidate.resumeScreened && candidate.status !== 'Resume Screened' && candidate.status !== 'Interview Scheduling' && candidate.status !== 'Interview Scheduled' && candidate.status !== 'Interview Analysis Pending' && candidate.status !== 'Interview Analyzed' && candidate.status !== 'Offer Extended' && candidate.status !== 'Hired'}
        >
          <Mic2 className="mr-2 h-4 w-4" />
          <span>Analyze Interview</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Clock className="mr-2 h-4 w-4" />
            <span>Update Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {ALL_STATUSES.map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(status)} disabled={candidate.status === status}>
                  {candidate.status === status ? <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : <ArrowRightCircle className="mr-2 h-4 w-4 opacity-50" />}
                  <span>{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
