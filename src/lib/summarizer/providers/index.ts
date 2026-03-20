import { generateGroq, GROQ_RATE_DELAY_MS } from "./groq";
import { generateGemini, GEMINI_RATE_DELAY_MS } from "./gemini";

export type ProviderName = "groq" | "gemini" | "fallback";

export interface GenerateResult {
  text: string;
  provider: ProviderName;
  rateDelayMs: number;
}

/**
 * Try Groq → Gemini → throw.
 * Returns the raw JSON text and which provider succeeded.
 */
export async function generateWithFallback(
  prompt: string,
  systemPrompt: string
): Promise<GenerateResult> {
  // Try Groq first
  try {
    const text = await generateGroq(prompt, systemPrompt);
    return { text, provider: "groq", rateDelayMs: GROQ_RATE_DELAY_MS };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "GROQ_API_KEY not configured") {
      console.log("[Provider] Groq not configured, trying Gemini...");
    } else {
      console.warn(`[Provider] Groq failed: ${msg}, falling back to Gemini...`);
    }
  }

  // Try Gemini as fallback
  try {
    const text = await generateGemini(prompt, systemPrompt);
    return { text, provider: "gemini", rateDelayMs: GEMINI_RATE_DELAY_MS };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "GEMINI_API_KEY not configured") {
      console.log("[Provider] Gemini not configured either.");
    } else {
      console.warn(`[Provider] Gemini failed: ${msg}`);
    }
  }

  // Both failed — caller handles local fallback
  throw new Error("All providers failed");
}
