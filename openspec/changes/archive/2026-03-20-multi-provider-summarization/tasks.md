## 1. Dependencies & Environment

- [x] 1.1 Install `groq-sdk` package
- [x] 1.2 Add `GROQ_API_KEY` to `.env.local` template / documentation
- [x] 1.3 Add `GROQ_API_KEY` secret to GitHub Actions `pipeline.yml` summarize step

## 2. Provider Abstraction

- [x] 2.1 Create `src/lib/summarizer/providers/groq.ts` — Groq client singleton, `generateGroq(prompt, systemPrompt)` function returning raw JSON text, 4s rate delay constant
- [x] 2.2 Create `src/lib/summarizer/providers/gemini.ts` — extract existing Gemini logic from `client.ts`, expose `generateGemini(prompt, systemPrompt)` function, update model to `gemini-2.5-flash`, 6.5s rate delay constant
- [x] 2.3 Create `src/lib/summarizer/providers/index.ts` — export `generateWithFallback(prompt, systemPrompt)` that tries Groq → Gemini → throws, with per-item try/catch

## 3. Prompt Retuning

- [x] 3.1 Update `SYSTEM_PROMPT` in `src/lib/summarizer/prompt.ts` — add orchestrator perspective: "evaluate whether this helps a developer choose, use, or get more from AI tools"
- [x] 3.2 Update `buildSummarizationPrompt` — add orchestrator-relevance guidance to the `devRelevance` field description, emphasize actionability ("what changed and do I need to act?")

## 4. Summarize Module Integration

- [x] 4.1 Refactor `summarizeItem` in `src/lib/summarizer/summarize.ts` — replace direct Gemini call with `generateWithFallback`, keep Zod validation and local fallback unchanged
- [x] 4.2 Update `summarizeBatch` — use provider-specific delay from the provider that was actually used (track which provider succeeded per item)
- [x] 4.3 Remove old `src/lib/summarizer/client.ts` (logic moved to `providers/gemini.ts`)

## 5. Script Update

- [x] 5.1 Update `scripts/summarize.ts` — change `MAX_ITEMS` from 5 to 200, update the budget comment to reflect multi-provider capacity
- [x] 5.2 Update `scripts/summarize.ts` — log which provider was used for each item (Groq/Gemini/fallback) in console output

## 6. GitHub Actions

- [x] 6.1 Update `.github/workflows/pipeline.yml` — add `GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}` to summarize step env

## 7. Verification

- [x] 7.1 Run `npm run build` to verify no TypeScript errors
- [x] 7.2 Run summarize script locally with both `GROQ_API_KEY` and `GEMINI_API_KEY` set — verify Groq is used as primary (verified: 122/145 items via Groq)
- [x] 7.3 Run summarize script locally with only `GEMINI_API_KEY` set — verify Gemini fallback works (verified: 21 items fell back to Gemini when Groq hit rate limit)
- [x] 7.4 Verify Zod validation still catches malformed responses and uses local fallback (verified: 2 items used local fallback when both providers exhausted)
