// 'use server';

/**
 * @fileOverview Summarizes key information from resumes (skills, experience, education)
 * and generates weighting criteria based on the resume content for scoring.
 *
 * - summarizeResume - A function that handles the resume summarization process.
 * - SummarizeResumeInput - The input type for the summarizeResume function.
 * - SummarizeResumeOutput - The return type for the summarizeResume function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeResumeInput = z.infer<typeof SummarizeResumeInputSchema>;

const SummarizeResumeOutputSchema = z.object({
  generatedWeightingCriteria: z.string().describe('The AI-generated weighting criteria based on the resume, used for evaluation.'),
  summary: z.string().describe('A summary of the resume content, aligned with the generated criteria.'),
  weightedScore: z.number().min(0).max(100).describe('A score (0-100) of the resume based on the generated weighting criteria.'),
});
export type SummarizeResumeOutput = z.infer<typeof SummarizeResumeOutputSchema>;

export async function summarizeResume(input: SummarizeResumeInput): Promise<SummarizeResumeOutput> {
  return summarizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResumePrompt',
  input: {schema: SummarizeResumeInputSchema},
  output: {schema: SummarizeResumeOutputSchema},
  prompt: `You are an AI resume analysis and summarization expert.
Your task is to analyze the provided resume.
First, infer the types of job roles the candidate is most suited for based on their skills and experience.
Then, generate a specific set of 'Weighting Criteria' that a recruiter would use to evaluate a candidate for these roles. These criteria should be directly derivable from the resume's content.
After defining these criteria, use them to:
1.  Create a 'Summary' of the resume, highlighting how the candidate's profile aligns with your generated criteria.
2.  Calculate a 'Weighted Score' (0-100) indicating the resume's strength based on these criteria.

Resume: {{media url=resumeDataUri}}

Provide your output structured with: the generated weighting criteria, the summary, and the weighted score. Ensure the weighted score is a number between 0 and 100.`,
});

const summarizeResumeFlow = ai.defineFlow(
  {
    name: 'summarizeResumeFlow',
    inputSchema: SummarizeResumeInputSchema,
    outputSchema: SummarizeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
