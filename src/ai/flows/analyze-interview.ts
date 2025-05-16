// This file is machine-generated - edit with care!

'use server';
/**
 * @fileOverview An interview analysis AI agent.
 *
 * - analyzeInterview - A function that handles the interview analysis process.
 * - AnalyzeInterviewInput - The input type for the analyzeInterview function.
 * - AnalyzeInterviewOutput - The return type for the analyzeInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInterviewInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The recorded interview audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // updated description
    ),
  transcript: z.string().describe('The transcript of the interview.'),
  jobDescription: z.string().describe('The job description for the role.'),
  evaluationMetrics: z
    .string()
    .describe(
      'The evaluation metrics to use when analyzing the interview, such as communication skills, soft skills, and overall fit.'
    ),
});
export type AnalyzeInterviewInput = z.infer<typeof AnalyzeInterviewInputSchema>;

const AnalyzeInterviewOutputSchema = z.object({
  overallScore: z.number().describe('The overall score of the candidate.'),
  communicationSkillsScore: z
    .number()
    .describe('The score of the candidate for communication skills.'),
  softSkillsScore: z.number().describe('The score of the candidate for soft skills.'),
  overallFitScore: z
    .number()
    .describe('The score of the candidate for overall fit with the company.'),
  insights: z.string().describe('The insights from the interview analysis.'),
});
export type AnalyzeInterviewOutput = z.infer<typeof AnalyzeInterviewOutputSchema>;

export async function analyzeInterview(input: AnalyzeInterviewInput): Promise<AnalyzeInterviewOutput> {
  return analyzeInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInterviewPrompt',
  input: {schema: AnalyzeInterviewInputSchema},
  output: {schema: AnalyzeInterviewOutputSchema},
  prompt: `You are an expert hiring manager specializing in analyzing interviews.

  You will use the interview transcript, job description, and evaluation metrics to assess the candidate's soft skills, communication style, and overall fit.
  You will provide objective scores and insights to inform the hiring decision.

  Interview Transcript: {{{transcript}}}
  Job Description: {{{jobDescription}}}
  Evaluation Metrics: {{{evaluationMetrics}}}
  Audio: {{media url=audioDataUri}}
  Please provide the overall score, communication skills score, soft skills score, overall fit score, and insights from the interview analysis.
  `,
});

const analyzeInterviewFlow = ai.defineFlow(
  {
    name: 'analyzeInterviewFlow',
    inputSchema: AnalyzeInterviewInputSchema,
    outputSchema: AnalyzeInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
