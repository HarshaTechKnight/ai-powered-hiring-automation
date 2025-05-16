
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { performSkillGapAnalysis } from "@/app/actions";
import type { AnalyzeSkillGapOutput } from "@/ai/flows/analyze-skill-gap-flow";
import { toBase64DataURI } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2, BarChart3, CheckSquare, XSquare, FileText as FileTextIcon, MessageSquareQuote } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
  jobDescription: z.string().min(50, "Job description must be at least 50 characters."),
});

type SkillGapAnalysisFormValues = z.infer<typeof formSchema>;

export function SkillGapAnalysisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeSkillGapOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SkillGapAnalysisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeFile: undefined,
      jobDescription: "",
    },
  });

  async function onSubmit(values: SkillGapAnalysisFormValues) {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const file = values.resumeFile[0];
      const resumeDataUri = await toBase64DataURI(file);

      const analysisResults = await performSkillGapAnalysis({
        resumeDataUri,
        jobDescription: values.jobDescription,
      });
      
      setResults(analysisResults);
      toast({
        title: "Skill Gap Analysis Complete",
        description: "AI has analyzed the resume against the job description.",
      });

    } catch (e: any) {
      console.error("Analysis failed:", e);
      setError(e.message || "An unexpected error occurred during skill gap analysis.");
      toast({
        title: "Analysis Failed",
        description: e.message || "Could not process the skill gap analysis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderSkillList = (title: string, skills: string[] | undefined, icon: React.ElementType, itemClassName?: string) => (
    skills && skills.length > 0 && (
      <div>
        <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
          {React.createElement(icon, { className: "h-5 w-5 text-primary"})}
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className={itemClassName}>{skill}</Badge>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="resumeFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Candidate's Resume *</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept={ACCEPTED_FILE_TYPES.join(",")}
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Upload the resume (PDF, DOCX, TXT, max 5MB).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the full job description here..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The AI will compare the resume against this job description.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Skills...
              </>
            ) : (
              "Analyze Skill Gap"
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
              Skill Gap Analysis Results
            </CardTitle>
            <CardDescription>Review the AI-powered analysis of the candidate's skills against the job role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="bg-muted/30 p-4 rounded-lg">
                <CardHeader className="p-2 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2"><BarChart3 className="text-primary"/>Overall Fit Score</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-3xl font-bold text-primary">{results.overallFitScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={results.overallFitScore} className="h-3" />
                    <p className="text-xs text-muted-foreground pt-1">This score represents the AI's assessment of skill alignment.</p>
                </CardContent>
            </Card>
            
            <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><MessageSquareQuote className="h-5 w-5 text-primary"/>Assessment Summary:</h3>
                <p className="text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">{results.skillAssessmentSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSkillList("Matching Skills", results.matchingSkills, CheckSquare, "border-green-500 text-green-700 bg-green-50")}
              {renderSkillList("Missing Skills / Areas for Clarification", results.missingSkills, XSquare, "border-red-500 text-red-700 bg-red-50")}
            </div>

          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">This analysis is AI-generated and should be used as a supportive tool in your evaluation process.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
