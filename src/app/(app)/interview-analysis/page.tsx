
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewAnalysisClientForm } from "@/components/interview-analysis/interview-analysis-form";
import { Mic2 } from "lucide-react";

export default function InterviewAnalysisPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <Mic2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Analysis</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analyze New Interview</CardTitle>
          <CardDescription>
            Upload interview audio, provide the transcript, job description, and evaluation metrics for AI-powered insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewAnalysisClientForm />
        </CardContent>
      </Card>
    </div>
  );
}
