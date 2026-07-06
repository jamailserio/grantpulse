import type { Framework } from "@/lib/schemas";

export const FRAMEWORKS: {
  id: Framework;
  label: string;
  description: string;
}[] = [
  {
    id: "usaid",
    label: "USAID",
    description: "USAID proposal alignment and results framework criteria.",
  },
  {
    id: "echo",
    label: "ECHO",
    description: "European Civil Protection and Humanitarian Aid Operations standards.",
  },
  {
    id: "un_ocha",
    label: "UN OCHA",
    description: "OCHA humanitarian programme cycle and cluster coordination norms.",
  },
];

export function getFrameworkLabel(framework: Framework): string {
  return FRAMEWORKS.find((item) => item.id === framework)?.label ?? framework;
}

export function buildAnalysisPrompt(text: string, framework: Framework): string {
  const frameworkLabel = getFrameworkLabel(framework);

  return `You are GrantPulse, a humanitarian grant narrative analyst for NGO programme officers.

Analyze the following project narrative against the ${frameworkLabel} donor framework.

Rules:
- Evaluate only the supplied narrative. Do not invent project facts.
- Produce concise, actionable NGO programme language.
- Score overall alignment from 0-100.
- Populate exactly three analytical sections for the dashboard.

Project narrative:
"""
${text}
"""`;
}
