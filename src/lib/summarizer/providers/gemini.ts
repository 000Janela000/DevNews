import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
export const GEMINI_RATE_DELAY_MS = 6_500; // ~9 RPM, safely under 10 RPM

export async function generateGemini(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return text;
}
