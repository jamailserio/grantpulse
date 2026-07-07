import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { text, framework } = await req.json();

    if (!text || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Text content is too short.' }), { status: 400 });
    }

    const systemPrompt = `
      You are an expert institutional grant compliance auditor.
      Rigorously evaluate the project narrative against the selected donor framework: "${framework ? framework.toUpperCase() : 'USAID'}".
      Provide an aggregate score (0-100) and specific improvement item arrays for each dimension.
    `;

    const result = await streamObject({
      model: openai('gpt-4o-mini'), 
      system: systemPrompt,
      prompt: `Analyze this proposal narrative:\n\n${text}`,
      schema: z.object({
        overallScore: z.number(),
        frameworkAlignment: z.array(z.string()),
        narrativeStrengths: z.array(z.string()),
        improvementAreas: z.array(z.string())
      }),
    });

    // ✨ FIXED: Reverting to the correct type-safe method for streamObject
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Router Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
