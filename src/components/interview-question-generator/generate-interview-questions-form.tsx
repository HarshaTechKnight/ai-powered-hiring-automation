
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { performInterviewQuestionGeneration } from "@/app/actions";
import type { GenerateInterviewQuestionsOutput } from "@/ai/flows/generate-interview-questions-flow";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2, ListChecks, Tags } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters."),
  numberOfQuestions: z.coerce.number().min(3).max(20).optional().default(5),
  // questionTypes: z.string().optional().describe("Comma-separated list of question types (e.g., behavioral, technical)"), // Simple for now
});

type GenerateInterviewQuestionsFormValues = z.infer<typeof formSchema>;

export function GenerateInterviewQuestionsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerateInterviewQuestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateInterviewQuestionsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      numberOfQuestions: 5,
      // questionTypes: "",
    },
  });

  async function onSubmit(values: GenerateInterviewQuestionsFormValues) {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
    //   const questionTypesArray = values.questionTypes?.split(',').map(qt => qt.trim()).filter(qt => qt.length > 0);
      const generationResults = await performInterviewQuestionGeneration({
        jobDescription: values.jobDescription,
        numberOfQuestions: values.numberOfQuestions,
        // questionTypes: questionTypesArray && questionTypesArray.length > 0 ? questionTypesArray : undefined,
      });
      setResults(generationResults);
      toast({
        title: "Interview Questions Generated",
        description: "AI has crafted interview questions for you.",
      });
    } catch (e: any) {
      console.error("Generation failed:", e);
      setError(e.message || "An unexpected error occurred during question generation.");
      toast({
        title: "Generation Failed",
        description: e.message || "Could not generate interview questions.",
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
                <FormDescription>The AI will use this to generate relevant interview questions.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Questions</FormLabel>
                <FormControl>
                  <Input type="number" min="3" max="20" {...field} />
                </FormControl>
                <FormDescription>How many questions would you like (3-20)?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="questionTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Types (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., behavioral, technical, situational" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list of question types to focus on.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Generate Questions"
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
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Generated Interview Questions
            </CardTitle>
            <CardDescription>Review the AI-generated interview questions below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.suggestedFocusAreas && results.suggestedFocusAreas.length > 0 && (
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Tags className="h-5 w-5 text-primary"/>Suggested Focus Areas:</h3>
                    <div className="flex flex-wrap gap-2">
                        {results.suggestedFocusAreas.map((area, index) => (
                            <Badge key={index} variant="secondary">{area}</Badge>
                        ))}
                    </div>
                </div>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Questions:</h3>
              {results.questions.length > 0 ? (
                <ul className="list-decimal list-inside space-y-2 pl-4 bg-muted p-4 rounded-md">
                  {results.questions.map((question, index) => (
                    <li key={index} className="text-muted-foreground">{question}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No questions were generated. Try adjusting your input.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
