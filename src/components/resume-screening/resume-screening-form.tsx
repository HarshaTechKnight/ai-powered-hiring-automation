
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
import { performResumeScreening } from "@/app/actions";
import type { SummarizeResumeOutput } from "@/ai/flows/summarize-resume";
import { toBase64DataURI } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@/types";
import { useCandidates } from "@/contexts/candidate-context";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];


const formSchema = z.object({
  resumeFile: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "Resume file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .docx, .txt files are accepted."
    ),
  weightingCriteria: z.string().min(10, "Weighting criteria must be at least 10 characters."),
});

type ResumeScreeningFormValues = z.infer<typeof formSchema>;

interface ResumeScreeningFormProps {
  candidate?: Candidate; // Optional: if screening for a specific candidate
  onScreeningComplete?: (candidateId: string, results: SummarizeResumeOutput) => void;
}

export function ResumeScreeningClientForm({ candidate, onScreeningComplete }: ResumeScreeningFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SummarizeResumeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { updateCandidate } = useCandidates();

  const form = useForm<ResumeScreeningFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeFile: undefined,
      weightingCriteria: candidate?.weightingCriteria || "",
    },
  });

  async function onSubmit(values: ResumeScreeningFormValues) {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const file = values.resumeFile[0];
      const resumeDataUri = await toBase64DataURI(file);

      const screeningResults = await performResumeScreening({
        resumeDataUri,
        weightingCriteria: values.weightingCriteria,
      });
      
      setResults(screeningResults);
      toast({
        title: "Resume Screened Successfully",
        description: "AI analysis complete.",
      });

      if (candidate) {
        updateCandidate(candidate.id, {
          status: 'Resume Screened',
          resumeDataUri, // Save for reference if needed, though file object is more useful for re-upload
          resumeFileName: file.name,
          weightingCriteria: values.weightingCriteria,
          resumeSummary: screeningResults.summary,
          resumeScore: screeningResults.weightedScore,
        });
        onScreeningComplete?.(candidate.id, screeningResults);
      }

    } catch (e: any) {
      console.error("Screening failed:", e);
      setError(e.message || "An unexpected error occurred during resume screening.");
      toast({
        title: "Screening Failed",
        description: e.message || "Could not process the resume.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="resumeFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Resume</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Upload the candidate's resume (PDF, DOCX, TXT, max 5MB).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weightingCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weighting Criteria</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Prioritize candidates with 5+ years of experience in Next.js, strong communication skills, and a background in SaaS..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the key skills, experience, and qualifications you're looking for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Screening Resume...
              </>
            ) : (
              "Screen Resume"
            )}
          </Button>
        </form>
      </Form>

      {error && (
         <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Screening Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Screening Results
            </CardTitle>
            {candidate && <CardDescription>Results for {candidate.name}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Weighted Score:</h3>
              <p className="text-2xl font-bold text-primary">{results.weightedScore.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Summary:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">{results.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
