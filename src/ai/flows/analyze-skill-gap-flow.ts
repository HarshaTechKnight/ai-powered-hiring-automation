
'use server';
/**
 * @fileOverview An AI agent for analyzing skill gaps between a resume and a job description.
 *
 * - analyzeSkillGap - A function that handles the skill gap analysis.
 * - AnalyzeSkillGapInput - The input type for the analyzeSkillGap function.
 * - AnalyzeSkillGapOutput - The return type for the analyzeSkillGap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkillGapInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The candidate's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters.").describe('The job description to compare against the resume.'),
});
export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

const AnalyzeSkillGapOutputSchema = z.object({
  matchingSkills: z.array(z.string()).describe("Skills explicitly mentioned in both the resume and job description."),
  missingSkills: z.array(z.string()).describe("Skills required by the job description that are not clearly evident in the resume."),
  skillAssessmentSummary: z.string().describe("A brief summary of the candidate's skill alignment with the role, highlighting strengths and areas for development."),
  overallFitScore: z.number().min(0).max(100).describe("A percentage score (0-100) representing the candidate's overall skill fit for the role based on the provided documents."),
});
export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;

export async function analyzeSkillGap(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  return analyzeSkillGapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkillGapPrompt',
  input: {schema: AnalyzeSkillGapInputSchema},
  output: {schema: AnalyzeSkillGapOutputSchema},
  prompt: `You are an expert HR analyst specializing in skill gap analysis.
Compare the provided resume against the job description.

Job Description:
{{{jobDescription}}}

Candidate Resume:
{{media url=resumeDataUri}}

Analyze the candidate's skills and experience from the resume and identify how well they align with the requirements in the job description.
Provide:
1.  A list of 'matchingSkills': skills clearly present in the resume that are relevant to the job description.
2.  A list of 'missingSkills': key skills or qualifications mentioned in the job description that are not apparent in the resume.
3.  A 'skillAssessmentSummary': a concise narrative explaining the candidate's strengths and weaknesses in relation to the role's skill requirements.
4.  An 'overallFitScore': a numerical score from 0 to 100 indicating the perceived skill fit.

Focus solely on the content of the resume and job description for your analysis.
`,
});

const analyzeSkillGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapFlow',
    inputSchema: AnalyzeSkillGapInputSchema,
    outputSchema: AnalyzeSkillGapOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
