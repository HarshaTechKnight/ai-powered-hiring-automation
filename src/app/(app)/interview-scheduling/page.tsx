
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSchedulingClientForm } from "@/components/interview-scheduling/interview-scheduling-form";
import { CalendarClock } from "lucide-react";

export default function InterviewSchedulingPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <CalendarClock className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Interview Scheduling</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Schedule a New Interview</CardTitle>
          <CardDescription>
            Select a candidate and provide the interview details to schedule their interview.
            Candidates currently in 'Resume Screened' or 'Interview Scheduling' status are available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewSchedulingClientForm />
        </CardContent>
      </Card>
    </div>
  );
}
