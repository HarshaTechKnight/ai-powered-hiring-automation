
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateJobDescriptionForm } from "@/components/job-description-generator/generate-job-description-form";
import { FileSignature } from "lucide-react";

export default function JobDescriptionGeneratorPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <FileSignature className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Job Description Generator</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create a New Job Description</CardTitle>
          <CardDescription>
            Provide details about the role, and our AI will help you craft a compelling job description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenerateJobDescriptionForm />
        </CardContent>
      </Card>
    </div>
  );
}

