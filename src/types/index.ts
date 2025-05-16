
import type { AnalyzeInterviewOutput } from "@/ai/flows/analyze-interview";

export type CandidateStatus =
  | 'Applied'
  | 'Resume Screening Pending'
  | 'Resume Screened'
  | 'Interview Scheduling' // New status for when scheduling is in progress or an option
  | 'Interview Scheduled'
  | 'Interview Analysis Pending'
  | 'Interview Analyzed'
  | 'Offer Extended'
  | 'Hired'
  | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  resumeFile?: File | null;
  resumeFileName?: string;
  resumeDataUri?: string;
  resumeSummary?: string;
  resumeScore?: number;
  weightingCriteria?: string;
  interviewAudioFile?: File | null;
  interviewAudioFileName?: string;
  interviewAudioDataUri?: string;
  interviewTranscript?: string;
  jobDescription?: string;
  evaluationMetrics?: string;
  interviewAnalysis?: AnalyzeInterviewOutput;
  createdAt: string;

  // New fields for interview scheduling
  interviewDate?: string; // ISO string for combined date and time
  interviewer?: string;
  interviewType?: 'Phone Screen' | 'Video Call' | 'In-Person';
  interviewLocationLink?: string; // Physical address or meeting URL
}

