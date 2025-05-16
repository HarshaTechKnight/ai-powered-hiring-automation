
"use client";

import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useCandidates } from "@/contexts/candidate-context";
import type { Candidate } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarClock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  candidateId: z.string().min(1, "Candidate selection is required."),
  interviewDate: z.date({ required_error: "Interview date is required." }),
  interviewTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  interviewer: z.string().min(2, "Interviewer name must be at least 2 characters."),
  interviewType: z.enum(['Phone Screen', 'Video Call', 'In-Person'], { required_error: "Interview type is required." }),
  interviewLocationLink: z.string().min(5, "Location/Link must be at least 5 characters."),
});

type InterviewSchedulingFormValues = z.infer<typeof formSchema>;

interface InterviewSchedulingFormProps {
  candidate?: Candidate | null; // Pre-selected candidate
  onScheduleComplete?: (candidateId: string) => void;
}

export function InterviewSchedulingClientForm({ candidate: preselectedCandidate, onScheduleComplete }: InterviewSchedulingFormProps) {
  const { candidates, updateCandidate, getCandidateById, loading: candidatesLoading } = useCandidates();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const availableCandidates = candidates.filter(c => 
    c.status === 'Resume Screened' || 
    c.status === 'Interview Scheduling' ||
    c.status === 'Interview Scheduled' // Allow re-scheduling
  );

  const form = useForm<InterviewSchedulingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateId: preselectedCandidate?.id || "",
      interviewDate: preselectedCandidate?.interviewDate ? new Date(preselectedCandidate.interviewDate) : undefined,
      interviewTime: preselectedCandidate?.interviewDate 
        ? new Date(preselectedCandidate.interviewDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) 
        : "",
      interviewer: preselectedCandidate?.interviewer || "",
      interviewType: preselectedCandidate?.interviewType || undefined,
      interviewLocationLink: preselectedCandidate?.interviewLocationLink || "",
    },
  });

  useEffect(() => {
    if (preselectedCandidate) {
      form.reset({
        candidateId: preselectedCandidate.id,
        interviewDate: preselectedCandidate.interviewDate ? new Date(preselectedCandidate.interviewDate) : undefined,
        interviewTime: preselectedCandidate.interviewDate 
          ? new Date(preselectedCandidate.interviewDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) 
          : "",
        interviewer: preselectedCandidate.interviewer || "",
        interviewType: preselectedCandidate.interviewType || undefined,
        interviewLocationLink: preselectedCandidate.interviewLocationLink || "",
      });
    }
  }, [preselectedCandidate, form]);


  async function onSubmit(values: InterviewSchedulingFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const targetCandidate = getCandidateById(values.candidateId);
      if (!targetCandidate) {
        throw new Error("Selected candidate not found.");
      }

      const [hours, minutes] = values.interviewTime.split(':').map(Number);
      const combinedDateTime = new Date(
        values.interviewDate.getFullYear(),
        values.interviewDate.getMonth(),
        values.interviewDate.getDate(),
        hours,
        minutes
      );
      const isoDateTimeString = combinedDateTime.toISOString();

      updateCandidate(values.candidateId, {
        status: 'Interview Scheduled',
        interviewDate: isoDateTimeString,
        interviewer: values.interviewer,
        interviewType: values.interviewType,
        interviewLocationLink: values.interviewLocationLink,
      });

      toast({
        title: "Interview Scheduled",
        description: `Interview for ${targetCandidate.name} has been scheduled successfully.`,
      });
      
      if (onScheduleComplete) {
        onScheduleComplete(values.candidateId);
      } else {
        // Reset form if not navigating away (e.g. on general scheduling page)
         form.reset({
          candidateId: "",
          interviewDate: undefined,
          interviewTime: "",
          interviewer: "",
          interviewType: undefined,
          interviewLocationLink: "",
        });
      }
    } catch (e: any) {
      console.error("Scheduling failed:", e);
      setError(e.message || "An unexpected error occurred during scheduling.");
      toast({
        title: "Scheduling Failed",
        description: e.message || "Could not schedule the interview.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (candidatesLoading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!preselectedCandidate && (
            <FormField
              control={form.control}
              name="candidateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Candidate</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a candidate to schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCandidates.length > 0 ? availableCandidates.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name} ({c.email}) - {c.status}</SelectItem>
                      )) : <SelectItem value="no-candidate" disabled>No candidates available for scheduling</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormDescription>Only candidates in 'Resume Screened' or 'Interview Scheduling' status are shown.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="interviewDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Interview Date</FormLabel>
                  <DatePicker 
                    date={field.value} 
                    setDate={field.onChange} 
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interviewTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="interviewer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interviewer Name(s)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe, John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interviewType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                    <SelectItem value="Video Call">Video Call</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interviewLocationLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location / Meeting Link</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Conference Room A / https://meet.example.com/interview" {...field} />
                </FormControl>
                <FormDescription>Enter physical address for in-person or meeting URL for video/phone.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading || ( !preselectedCandidate && availableCandidates.length === 0)} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Interview"
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Scheduling Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
