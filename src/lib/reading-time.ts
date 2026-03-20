const WORDS_PER_MINUTE = 200;

export const BRIEFING_BUDGET_MINUTES = 20;

/** Estimate reading time in minutes from text. Minimum 1 minute. */
export function estimateReadingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
