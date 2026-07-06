/** Minimum characters required before analysis can be submitted. */
export const MIN_NARRATIVE_LENGTH = 150;

export function meetsNarrativeBaseline(text: string): boolean {
  return text.trim().length >= MIN_NARRATIVE_LENGTH;
}
