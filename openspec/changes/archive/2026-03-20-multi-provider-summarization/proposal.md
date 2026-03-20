## Why

The summarization pipeline is the core differentiator of DevNews — without AI summaries, it's just another link aggregator. Currently, the pipeline uses Gemini 2.5 Flash-Lite with a 20 requests/day free tier limit, processing only 5 items per cron run (4 runs/day = 20 items/day max). The pipeline ingests 50-150+ items daily from 18+ sources. The vast majority never receive a summary, category refinement, importance score, or dev-relevance tag. This undermines the product's core value proposition: curated, summarized AI news.

Additionally, the summarization prompt evaluates items generically ("is this AI related?") rather than through the lens of the target user: a developer who needs to stay current as an AI orchestrator — knowing which tools to use, what changed, and how it affects their workflow.

## What Changes

- Add Groq SDK integration as the primary summarization provider (Llama 3.3 70B, ~500K tokens/day free tier)
- Demote Gemini 2.5 Flash to fallback provider (250 RPD free tier, upgraded from flash-lite)
- Implement provider fallback chain: Groq → Gemini → local fallback (first 2 sentences)
- Remove the artificial `MAX_ITEMS = 5` cap in the summarize script — process all unsummarized items
- Retune the summarization prompt to evaluate orchestrator relevance: "Does this help a developer choose, use, or get more from AI tools?"
- Add `GROQ_API_KEY` environment variable support

## Capabilities

### New Capabilities
- `provider-chain`: Multi-provider summarization with automatic fallback (Groq → Gemini → local extraction)
- `orchestrator-prompt`: Summarization prompt tuned for developer-orchestrator relevance, evaluating practical impact on AI tool selection and usage

### Modified Capabilities

## Impact

- **Code**: `src/lib/summarizer/` (client, summarize, prompt), `scripts/summarize.ts`
- **Dependencies**: New npm package: `groq-sdk` (OpenAI-compatible SDK)
- **Environment**: New secret `GROQ_API_KEY` required in GitHub Actions and local `.env`
- **GitHub Actions**: `pipeline.yml` needs `GROQ_API_KEY` secret added to summarize step
- **Rate limits**: Groq free tier (~500K tokens/day, 6K tokens/min) replaces Gemini flash-lite (20 RPD) as primary budget
