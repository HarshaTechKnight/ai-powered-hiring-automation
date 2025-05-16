
"use server";

import { summarizeResume as summarizeResumeFlow, type SummarizeResumeInput, type SummarizeResumeOutput } from "@/ai/flows/summarize-resume";
import { analyzeInterview as analyzeInterviewFlow, type AnalyzeInterviewInput, type AnalyzeInterviewOutput } from "@/ai/flows/analyze-interview";
import { generateJobDescription as generateJobDescriptionFlow, type GenerateJobDescriptionInput, type GenerateJobDescriptionOutput } from "@/ai/flows/generate-job-description-flow";
import { generateInterviewQuestions as generateInterviewQuestionsFlow, type GenerateInterviewQuestionsInput, type GenerateInterviewQuestionsOutput } from "@/ai/flows/generate-interview-questions-flow";
import { analyzeSkillGap as analyzeSkillGapFlow, type AnalyzeSkillGapInput, type AnalyzeSkillGapOutput } from "@/ai/flows/analyze-skill-gap-flow";

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

export async function performInterviewQuestionGeneration(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  try {
    const result = await generateInterviewQuestionsFlow(input);
    return result;
  } catch (error) {
    console.error("Error in performInterviewQuestionGeneration:", error);
    throw new Error("AI Interview Question Generation failed. Please check logs.");
  }
}

export async function performSkillGapAnalysis(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  try {
    const result = await analyzeSkillGapFlow(input);
    return result;
  } catch (error) {
    console.error("Error in performSkillGapAnalysis:", error);
    throw new Error("AI Skill Gap Analysis failed. Please check logs.");
  }
}
