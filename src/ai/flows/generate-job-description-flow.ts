
'use server';
/**
 * @fileOverview An AI agent for generating job descriptions.
 *
 * - generateJobDescription - A function that handles the job description generation process.
 * - GenerateJobDescriptionInput - The input type for the generateJobDescription function.
 * - GenerateJobDescriptionOutput - The return type for the generateJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobDescriptionInputSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters.").describe('The title of the job position.'),
  companyName: z.string().optional().describe('The name of the company.'),
  companyCulture: z.string().optional().describe('Brief description of the company culture, values, and mission.'),
  keyResponsibilities: z.string().optional().describe('Key responsibilities and daily tasks for the role. List format is good.'),
  requiredSkills: z.string().optional().describe('Essential skills, qualifications, and experience required. List format is good.'),
  benefits: z.string().optional().describe('Key benefits and perks offered with the position.'),
});
export type GenerateJobDescriptionInput = z.infer<typeof GenerateJobDescriptionInputSchema>;

const GenerateJobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('The fully generated job description text.'),
});
export type GenerateJobDescriptionOutput = z.infer<typeof GenerateJobDescriptionOutputSchema>;

export async function generateJobDescription(input: GenerateJobDescriptionInput): Promise<GenerateJobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobDescriptionPrompt',
  input: {schema: GenerateJobDescriptionInputSchema},
  output: {schema: GenerateJobDescriptionOutputSchema},
  prompt: `You are an expert HR copywriter and recruiter. Generate a comprehensive, engaging, and professional job description for the following role.

Job Title: {{{jobTitle}}}
{{#if companyName}}Company Name: {{{companyName}}}{{/if}}
{{#if companyCulture}}
Company Culture & Values:
{{{companyCulture}}}
{{/if}}
{{#if keyResponsibilities}}
Key Responsibilities:
{{{keyResponsibilities}}}
{{/if}}
{{#if requiredSkills}}
Required Skills & Qualifications:
{{{requiredSkills}}}
{{/if}}
{{#if benefits}}
Benefits & Perks:
{{{benefits}}}
{{/if}}

Please craft a job description that is clear, concise, and attractive to potential candidates. Ensure it includes:
- A brief company overview (if company name or culture is provided).
- A summary of the role.
- Detailed responsibilities.
- Required skills and qualifications.
- Preferred skills (if applicable, infer from input).
- Benefits (if provided).
- A call to action.

Format the output as a single block of text suitable for a job posting. Use appropriate headings and bullet points for readability where necessary.
`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: GenerateJobDescriptionInputSchema,
    outputSchema: GenerateJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
