
"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { performInterviewAnalysis } from "@/app/actions";
import type { AnalyzeInterviewOutput } from "@/ai/flows/analyze-interview";
import { toBase64DataURI } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@/types";
import { useCandidates } from "@/contexts/candidate-context";
import { AlertCircle, CheckCircle2, Loader2, BarChart3 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';

const MAX_AUDIO_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_AUDIO_FILE_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm"];


const formSchema = z.object({
  audioFile: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "Audio file is required.")
    .refine((files) => files?.[0]?.size <= MAX_AUDIO_FILE_SIZE, `Max audio file size is 20MB.`)
    .refine(
      (files) => ACCEPTED_AUDIO_FILE_TYPES.includes(files?.[0]?.type),
      "MP3, WAV, OGG, MP4 (audio), WebM (audio) files are accepted."
    ),
  transcript: z.string().min(50, "Transcript must be at least 50 characters."),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters."),
  evaluationMetrics: z.string().min(20, "Evaluation metrics must be at least 20 characters."),
});

type InterviewAnalysisFormValues = z.infer<typeof formSchema>;

interface InterviewAnalysisFormProps {
  candidate?: Candidate;
  onAnalysisComplete?: (candidateId: string, results: AnalyzeInterviewOutput) => void;
}

export function InterviewAnalysisClientForm({ candidate, onAnalysisComplete }: InterviewAnalysisFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeInterviewOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { updateCandidate } = useCandidates();

  const form = useForm<InterviewAnalysisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioFile: undefined,
      transcript: candidate?.interviewTranscript || "",
      jobDescription: candidate?.jobDescription || "",
      evaluationMetrics: candidate?.evaluationMetrics || "Assess communication skills, problem-solving abilities, cultural fit, and technical proficiency relevant to the role.",
    },
  });

  async function onSubmit(values: InterviewAnalysisFormValues) {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const file = values.audioFile[0];
      const audioDataUri = await toBase64DataURI(file);

      const analysisResults = await performInterviewAnalysis({
        audioDataUri,
        transcript: values.transcript,
        jobDescription: values.jobDescription,
        evaluationMetrics: values.evaluationMetrics,
      });
      
      setResults(analysisResults);
      toast({
        title: "Interview Analyzed Successfully",
        description: "AI analysis complete.",
      });

      if (candidate) {
        updateCandidate(candidate.id, {
          status: 'Interview Analyzed',
          interviewAudioDataUri,
          interviewAudioFileName: file.name,
          interviewTranscript: values.transcript,
          jobDescription: values.jobDescription,
          evaluationMetrics: values.evaluationMetrics,
          interviewAnalysis: analysisResults,
        });
        onAnalysisComplete?.(candidate.id, analysisResults);
      }

    } catch (e: any) {
      console.error("Analysis failed:", e);
      setError(e.message || "An unexpected error occurred during interview analysis.");
      toast({
        title: "Analysis Failed",
        description: e.message || "Could not process the interview data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderScoreBar = (label: string, score: number | undefined) => (
    score !== undefined && (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="text-sm font-semibold text-primary">{score.toFixed(1)}/10</span>
        </div>
        <Progress value={score * 10} className="h-2" />
      </div>
    )
  );


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="audioFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Interview Audio</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept={ACCEPTED_AUDIO_FILE_TYPES.join(",")}
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Upload the recorded interview audio (MP3, WAV, OGG, MP4, WebM, max 20MB).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transcript"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Transcript</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the full interview transcript here..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the job description for the role..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="evaluationMetrics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Metrics</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Communication skills, soft skills, overall fit, technical expertise..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Interview...
              </>
            ) : (
              "Analyze Interview"
            )}
          </Button>
        </form>
      </Form>

      {error && (
         <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Interview Analysis Results
            </CardTitle>
             {candidate && <CardDescription>Results for {candidate.name}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/50 p-4 rounded-lg">
                <CardHeader className="p-2">
                   <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="text-primary"/>Scores</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-3">
                  {renderScoreBar("Overall Score", results.overallScore)}
                  {renderScoreBar("Communication Skills", results.communicationSkillsScore)}
                  {renderScoreBar("Soft Skills", results.softSkillsScore)}
                  {renderScoreBar("Overall Fit", results.overallFitScore)}
                </CardContent>
              </Card>
               <div>
                <h3 className="font-semibold text-lg mb-1">Key Insights:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md min-h-[150px]">{results.insights}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
