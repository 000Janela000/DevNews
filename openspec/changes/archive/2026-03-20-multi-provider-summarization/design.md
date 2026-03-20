## Context

The summarizer module (`src/lib/summarizer/`) currently has three files:
- `client.ts` — Gemini SDK singleton, rate limit constants
- `prompt.ts` — system prompt and prompt builder
- `summarize.ts` — single-item and batch summarization logic with Zod validation

The module is tightly coupled to Gemini: `client.ts` returns a `GoogleGenAI` instance, and `summarize.ts` calls `client.models.generateContent()` directly.

Groq uses an OpenAI-compatible API (`groq-sdk`), which has a different interface (`chat.completions.create()`). The design must abstract over both providers without over-engineering.

## Goals / Non-Goals

**Goals:**
- Replace Gemini flash-lite with Groq as primary summarizer
- Add Gemini 2.5 Flash as fallback when Groq fails
- Abstract provider details behind a common interface
- Retune the prompt for orchestrator relevance
- Remove the 5-item cap and process all unsummarized items per run
- Keep the existing Zod validation and fallback summary logic unchanged

**Non-Goals:**
- Building a generic LLM abstraction layer (only need 2 providers)
- Streaming responses (batch processing, no UI)
- Caching or deduplication of summarization requests
- Changing the database schema or scoring system

## Decisions

### 1. Provider abstraction: simple function interface, not a class hierarchy

Each provider exports a single function: `(prompt: string, systemPrompt: string) => Promise<string>`. This returns raw JSON text. The existing Zod validation in `summarize.ts` handles parsing and validation regardless of provider.

**Why not a class/interface:** Only 2 providers, both called the same way (send prompt, get text back). A class hierarchy adds indirection for no benefit. If a third provider is ever added, refactoring a function to an interface is trivial.

**Alternatives considered:**
- LangChain / Vercel AI SDK: too heavy, adds large dependency for a simple use case
- OpenAI-compatible adapter for both: Gemini doesn't support this natively

### 2. Fallback strategy: try/catch per-item, not per-batch

Each item attempts Groq first. If Groq fails (rate limit, network, bad response), that specific item falls back to Gemini. If Gemini also fails, the existing local fallback (first 2 sentences) is used.

**Why per-item:** A batch-level fallback would abandon Groq entirely after one failure. Per-item is more resilient — a transient Groq error doesn't waste the entire Gemini budget.

### 3. Rate limiting: provider-specific delays

- Groq: 6K tokens/min free tier → ~4 second delay between requests (conservative)
- Gemini: 10 RPM → ~6.5 second delay between requests
- No global rate tracking across providers (unnecessary — they have independent quotas)

### 4. Prompt: single prompt, provider-agnostic

The same system prompt and user prompt are sent to both providers. Both Groq (Llama 3.3 70B) and Gemini 2.5 Flash support JSON mode. The prompt explicitly requests JSON output with the schema embedded.

### 5. MAX_ITEMS removal: process all, with a safety cap

Remove the `MAX_ITEMS = 5` constant. Replace with a generous safety cap of 200 per run to prevent runaway processing if the database has a backlog. Under normal operation, each run processes 30-80 items (6-hour ingest window).

## Risks / Trade-offs

**[Groq free tier changes]** → Groq could reduce free tier limits at any time. Mitigation: Gemini fallback ensures the pipeline never stops. The provider abstraction makes swapping providers trivial.

**[Llama 3.3 70B JSON reliability]** → Open-source models are sometimes less reliable at structured JSON output than Gemini. Mitigation: Zod validation catches malformed responses; local fallback handles the rest. Test thoroughly before shipping.

**[Rate limit exhaustion mid-batch]** → If Groq rate limit is hit partway through a batch, remaining items fall back to Gemini, which may also hit its limit. Mitigation: the 200-item safety cap and conservative delays make this unlikely. If both providers are exhausted, local fallback still produces basic summaries.

**[New dependency (groq-sdk)]** → Adds ~200KB to node_modules. Acceptable for the throughput gain.
