import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

// Optimize execution speeds using Vercel's global Edge Network runtime
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { text, framework } = await req.json();

    if (!text || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Text content is too short to evaluate.' }), { status: 400 });
    }

    // Custom non-profit prompt boundaries tailored directly to your criteria
    const systemPrompt = `
      You are an expert institutional grant compliance auditor for International NGOs like CARE International.
      Your job is to rigorously evaluate the user's project narrative against the selected donor framework: "${framework.toUpperCase()}".
      
      Provide an aggregate compliance score (0-100) and an array of actionable improvements.
      You must evaluate across exactly three criteria:
      1. Strategic Fit (Donor alignment & local capacity building)
      2. Indicator Compliance (Target metrics, gender-transformative markers)
      3. Wording/Tone Realism (Authoritative language, actionable commitments)
      
      CRITICAL: Adhere strictly to the requested JSON schema. Do not include raw conversational explanations.
    `;

    // Trigger modern token streaming parsing using Vercel AI SDK
    const result = await streamObject({
      model: openai('gpt-4o-mini'), 
      system: systemPrompt,
      prompt: `Analyze this proposal narrative:\n\n${text}`,
      schema: z.object({
        score: z.number().min(0).max(100),
        strategicFit: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
        indicatorCompliance: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
        wordingToneRealism: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
      }),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}