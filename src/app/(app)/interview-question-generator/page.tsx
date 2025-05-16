
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateInterviewQuestionsForm } from "@/components/interview-question-generator/generate-interview-questions-form";
import { HelpCircle } from "lucide-react"; // Or ListChecks, MessageSquareQuestion

export default function InterviewQuestionGeneratorPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Question Generator</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Custom Interview Questions</CardTitle>
          <CardDescription>
            Provide a job description, and our AI will generate relevant interview questions to help you assess candidates effectively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenerateInterviewQuestionsForm />
        </CardContent>
      </Card>
    </div>
  );
}
