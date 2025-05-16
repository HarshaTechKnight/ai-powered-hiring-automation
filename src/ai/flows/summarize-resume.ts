// 'use server';

/**
 * @fileOverview Summarizes key information from resumes (skills, experience, education) and weights criteria based on recruiter input.
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
  weightingCriteria: z
    .string()
    .describe(
      'The weighting criteria provided by the recruiter, as a plain text string.'
    ),
});
export type SummarizeResumeInput = z.infer<typeof SummarizeResumeInputSchema>;

const SummarizeResumeOutputSchema = z.object({
  summary: z.string().describe('A summary of the resume content.'),
  weightedScore: z.number().describe('A score of the resume based on the weighting criteria.'),
});
export type SummarizeResumeOutput = z.infer<typeof SummarizeResumeOutputSchema>;

export async function summarizeResume(input: SummarizeResumeInput): Promise<SummarizeResumeOutput> {
  return summarizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResumePrompt',
  input: {schema: SummarizeResumeInputSchema},
  output: {schema: SummarizeResumeOutputSchema},
  prompt: `You are an AI resume summarization expert.

You will summarize the resume and extract key information (skills, experience, education) and weight criteria based on the recruiter's input. You will then calculate the weighted score of the resume based on the weighting criteria.

Use the following as the primary source of information about the resume.

Resume: {{media url=resumeDataUri}}

Weighting Criteria: {{{weightingCriteria}}}

Summary:

Weighted Score:`, // Ensure the prompt ends with the fields you want the model to populate
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
