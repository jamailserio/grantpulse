import { z } from 'zod';

// Define the exact runtime data schema required by our system spec
const analysisSchema = z.object({
  score: z.number().min(0).max(100),
  strategicFit: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
  indicatorCompliance: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
  wordingToneRealism: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
});

// Helper validation function matching our API's input limits
function validateProposalInput(text: string | null | undefined) {
  if (!text || text.trim().length < 10) {
    return false;
  }
  return true;
}

describe('GrantPulse Phase 3 Core Validation Tests', () => {
  
  // Test 1: Verifies that short or empty proposal inputs are rejected safely
  test('Test 1: Reject text inputs that are empty or under 10 characters', () => {
    const emptyInput = "";
    const shortInput = "Too short";
    
    expect(validateProposalInput(emptyInput)).toBe(false);
    expect(validateProposalInput(shortInput)).toBe(false);
  });

  // Test 2: Verifies that a valid proposal text passes the validation step
  test('Test 2: Accept valid text structures that meet or exceed minimum length', () => {
    const validProposalText = "This is a comprehensive project narrative draft for CARE International emergency food security operations.";
    expect(validateProposalInput(validProposalText)).toBe(true);
  });

  // Test 3: Verifies that the structured AI response strictly adheres to our core schema
  test('Test 3: Enforce rigid structural integrity on incoming AI JSON formats', () => {
    const mockAIResponse = {
      score: 85,
      strategicFit: [{ issue: "Missing local partner names", suggestion: "Explicitly state the municipal teams." }],
      indicatorCompliance: [],
      wordingToneRealism: [{ issue: "Passive delivery", suggestion: "Use active impact verbs." }]
    };

    const parseResult = analysisSchema.safeParse(mockAIResponse);
    expect(parseResult.success).toBe(true);
  });
});