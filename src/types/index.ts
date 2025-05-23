
import type { AnalyzeInterviewOutput } from "@/ai/flows/analyze-interview";

export type CandidateStatus =
  | 'Applied'
  | 'Resume Screening Pending'
  | 'Resume Screened'
  | 'Interview Scheduling'
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
  interviewDate?: string;
  interviewer?: string;
  interviewType?: 'Phone Screen' | 'Video Call' | 'In-Person';
  interviewLocationLink?: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  avatarDataUri?: string; // Added for custom avatar
}
