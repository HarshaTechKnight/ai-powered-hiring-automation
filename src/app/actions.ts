
"use server";

import { summarizeResume as summarizeResumeFlow, type SummarizeResumeInput, type SummarizeResumeOutput } from "@/ai/flows/summarize-resume";
import { analyzeInterview as analyzeInterviewFlow, type AnalyzeInterviewInput, type AnalyzeInterviewOutput } from "@/ai/flows/analyze-interview";
import { generateJobDescription as generateJobDescriptionFlow, type GenerateJobDescriptionInput, type GenerateJobDescriptionOutput } from "@/ai/flows/generate-job-description-flow";

export async function performResumeScreening(input: SummarizeResumeInput): Promise<SummarizeResumeOutput> {
  try {
    const result = await summarizeResumeFlow(input);
    return result;
  } catch (error) {
    console.error("Error in performResumeScreening:", error);
    throw new Error("AI Resume Screening failed. Please check logs.");
  }
}

export async function performInterviewAnalysis(input: AnalyzeInterviewInput): Promise<AnalyzeInterviewOutput> {
  try {
    const result = await analyzeInterviewFlow(input);
    return result;
  } catch (error) {
    console.error("Error in performInterviewAnalysis:", error);
    throw new Error("AI Interview Analysis failed. Please check logs.");
  }
}

export async function performJobDescriptionGeneration(input: GenerateJobDescriptionInput): Promise<GenerateJobDescriptionOutput> {
  try {
    const result = await generateJobDescriptionFlow(input);
    return result;
  } catch (error) {
    console.error("Error in performJobDescriptionGeneration:", error);
    throw new Error("AI Job Description Generation failed. Please check logs.");
  }
}
