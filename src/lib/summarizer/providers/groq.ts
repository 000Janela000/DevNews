import Groq from "groq-sdk";

let _client: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    _client = new Groq({ apiKey });
  }
  return _client;
}

export const GROQ_RATE_DELAY_MS = 4_000; // ~15 RPM, safely under 6K tokens/min

export async function generateGroq(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const client = getGroqClient();
  if (!client) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Groq returned empty response");
  }

  return text;
}
