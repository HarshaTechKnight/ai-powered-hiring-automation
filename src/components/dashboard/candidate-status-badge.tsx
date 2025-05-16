
import type { CandidateStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CandidateStatusBadgeProps {
  status: CandidateStatus;
}

export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let className = "";

  switch (status) {
    case 'Applied':
    case 'Resume Screening Pending':
      variant = "outline";
      className = "border-blue-500 text-blue-500";
      break;
    case 'Resume Screened':
    case 'Interview Scheduling':
    case 'Interview Scheduled':
      variant = "secondary";
      className = "bg-sky-100 text-sky-700 border-sky-300";
      break;
    case 'Interview Analysis Pending':
       variant = "outline";
       className = "border-purple-500 text-purple-500";
      break;
    case 'Interview Analyzed':
      variant = "default";
      className = "bg-indigo-100 text-indigo-700 border-indigo-300";
      break;
    case 'Offer Extended':
      variant = "default";
      className = "bg-green-100 text-green-700 border-green-300";
      break;
    case 'Hired':
      variant = "default";
      className = "bg-emerald-500 text-white"; // Primary style for hired
      break;
    case 'Rejected':
      variant = "destructive";
      className = "bg-red-100 text-red-700 border-red-300";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant} className={cn("capitalize", className)}>{status.toLowerCase()}</Badge>;
}
