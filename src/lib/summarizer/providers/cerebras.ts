const CEREBRAS_ENDPOINT = "https://api.cerebras.ai/v1/chat/completions";

// Qwen3 235B (MoE, 22B active) — the strongest instruction-follower available
// on Cerebras's free tier for this account. Larger than Groq's Llama 3.3 70B.
export const CEREBRAS_MODEL = "qwen-3-235b-a22b-instruct-2507";
// Cerebras free tier: 30 RPM AND 60K TPM. Our calls are ~6K tokens each
// (long system prompt + 4K content + JSON output), so the TPM cap bites
// first: 60000 / 6000 ≈ 10 calls/min → 6500ms/call with headroom.
export const CEREBRAS_RATE_DELAY_MS = 6_500;

interface CerebrasChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

export async function generateCerebras(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error("CEREBRAS_API_KEY not configured");
  }

  const res = await fetch(CEREBRAS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: CEREBRAS_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as CerebrasChatResponse;
      detail = body.error?.message ?? JSON.stringify(body);
    } catch {
      detail = await res.text();
    }
    throw new Error(`Cerebras ${res.status}: ${detail.slice(0, 200)}`);
  }

  const body = (await res.json()) as CerebrasChatResponse;
  const text = body.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Cerebras returned empty response");
  }

  return text;
}
