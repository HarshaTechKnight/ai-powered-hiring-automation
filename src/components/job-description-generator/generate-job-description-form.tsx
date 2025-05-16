
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
import { performJobDescriptionGeneration } from "@/app/actions";
import type { GenerateJobDescriptionOutput } from "@/ai/flows/generate-job-description-flow";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2, Clipboard, ClipboardCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters."),
  companyName: z.string().optional(),
  companyCulture: z.string().optional(),
  keyResponsibilities: z.string().optional(),
  requiredSkills: z.string().optional(),
  benefits: z.string().optional(),
});

type GenerateJobDescriptionFormValues = z.infer<typeof formSchema>;

export function GenerateJobDescriptionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerateJobDescriptionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateJobDescriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      companyCulture: "",
      keyResponsibilities: "",
      requiredSkills: "",
      benefits: "",
    },
  });

  async function onSubmit(values: GenerateJobDescriptionFormValues) {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setCopied(false);

    try {
      const generationResults = await performJobDescriptionGeneration(values);
      setResults(generationResults);
      toast({
        title: "Job Description Generated",
        description: "AI has crafted a job description for you.",
      });
    } catch (e: any) {
      console.error("Generation failed:", e);
      setError(e.message || "An unexpected error occurred during job description generation.");
      toast({
        title: "Generation Failed",
        description: e.message || "Could not generate the job description.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (results?.jobDescription) {
      navigator.clipboard.writeText(results.jobDescription);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior Software Engineer" {...field} />
                </FormControl>
                <FormDescription>The primary title for the job role.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Acme Corp" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyCulture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Culture/Values (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your company's mission, values, and work environment..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keyResponsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Responsibilities (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List key tasks and duties, e.g.,\n- Develop new features\n- Collaborate with teams..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                 <FormDescription>Provide a list or description of the main responsibilities.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requiredSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Skills & Qualifications (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List essential skills, experience, and education, e.g.,\n- 5+ years in JavaScript\n- BSc in Computer Science..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>What are the must-have qualifications for this role?</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits & Perks (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List attractive benefits, e.g.,\n- Health insurance\n- Remote work options..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Job Description"
            )}
          </Button>
        </form>
      </Form>

      {error && (
         <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Generated Job Description
                </CardTitle>
                <CardDescription>Review and copy the AI-generated job description below.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy job description">
                {copied ? <ClipboardCheck className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={results.jobDescription}
              readOnly
              className="min-h-[300px] bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Generated Job Description"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

