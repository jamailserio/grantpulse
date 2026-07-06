import { z } from "zod";
import { MIN_NARRATIVE_LENGTH } from "@/lib/constants";

export const frameworkSchema = z.enum(["usaid", "echo", "un_ocha"]);
export type Framework = z.infer<typeof frameworkSchema>;

export const analyzeRequestSchema = z.object({
  text: z
    .string()
    .min(
      MIN_NARRATIVE_LENGTH,
      `Narrative must be at least ${MIN_NARRATIVE_LENGTH} characters.`,
    ),
  framework: frameworkSchema,
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const analysisSectionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  items: z.array(z.string()),
});

export const analysisResultSchema = z.object({
  frameworkAlignment: analysisSectionSchema,
  narrativeStrengths: analysisSectionSchema,
  improvementAreas: analysisSectionSchema,
  overallScore: z.number().min(0).max(100),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
