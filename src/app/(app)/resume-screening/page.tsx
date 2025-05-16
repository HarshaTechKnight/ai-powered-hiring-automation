
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeScreeningClientForm } from "@/components/resume-screening/resume-screening-form";
import { FileText } from "lucide-react";

export default function ResumeScreeningPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Screening</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Screen New Resume</CardTitle>
          <CardDescription>
            Upload a resume. The AI will analyze it, automatically generate relevant weighting criteria, and provide a summary and score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeScreeningClientForm />
        </CardContent>
      </Card>
    </div>
  );
}
