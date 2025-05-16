
'use server';
/**
 * @fileOverview An AI agent for generating interview questions.
 *
 * - generateInterviewQuestions - A function that handles interview question generation.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters.").describe('The job description for which to generate interview questions.'),
  numberOfQuestions: z.number().min(3).max(20).optional().default(5).describe('The desired number of interview questions to generate.'),
  questionTypes: z.array(z.string()).optional().describe('Optional list of question types to focus on (e.g., "behavioral", "technical", "situational").'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of generated interview questions.'),
  suggestedFocusAreas: z.array(z.string()).optional().describe('Areas the questions aim to cover, based on the job description.')
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert HR professional and hiring manager. Based on the provided job description, generate a list of insightful interview questions.

Job Description:
{{{jobDescription}}}

Please generate {{{numberOfQuestions}}} questions.
{{#if questionTypes}}
Focus on the following types of questions: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{/if}}

Aim for questions that help assess a candidate's skills, experience, problem-solving abilities, and cultural fit as relevant to the job description.
Also, provide a list of suggested focus areas that these questions cover.
`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
