
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillGapAnalysisForm } from "@/components/skill-gap-analyzer/skill-gap-analysis-form";
import { BarChartHorizontalBig } from "lucide-react"; // Or UsersRound, Puzzle

export default function SkillGapAnalyzerPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center gap-2 mb-6">
        <BarChartHorizontalBig className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Candidate Skill Gap Analyzer</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analyze Candidate's Skill Fit</CardTitle>
          <CardDescription>
            Upload a candidate's resume and provide the job description. Our AI will analyze the skill alignment, identify gaps, and provide an overall fit score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkillGapAnalysisForm />
        </CardContent>
      </Card>
    </div>
  );
}
