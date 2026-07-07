import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { text, framework } = await req.json();

    if (!text || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Text content is too short.' }), { status: 400 });
    }

    const systemPrompt = `
      You are an expert institutional grant compliance auditor.
      Analyze the proposal text against the donor framework: "${framework || 'USAID'}".
      You MUST respond with a single, raw JSON object. Do not include markdown formatting or backticks.
      
      JSON Structure:
      {
        "overallScore": 85,
        "frameworkAlignment": ["Issue 1", "Issue 2"],
        "narrativeStrengths": ["Strength 1"],
        "improvementAreas": ["Area 1"]
      }
    `;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: `Analyze this proposal narrative:\n\n${text}`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
  }
}
