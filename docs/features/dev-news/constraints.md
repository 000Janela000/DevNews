# DevNews — Constraints

## Free Tier Budgets

Every service must operate within its free tier. No paid upgrades.

| Service | Free Tier Limit | Current Usage |
|---------|----------------|---------------|
| **Supabase PostgreSQL** | 500MB storage, 50K MAU | 90-day pruning keeps data under limit |
| **Groq API** (primary summarizer) | ~500K tokens/day, 6K tokens/min (Llama 3.3 70B) | Primary summarization provider |
| **Gemini API** (fallback summarizer) | 250 RPD, 10 RPM (2.5 Flash) | Fallback only — used when Groq fails |
| **GitHub Actions** | 2000 minutes/month | Full pipeline: ~10 min x 4/day = 40 min. Light: ~3 min x 12/day = 36 min. Total: ~76 min/day, ~2280/month. Tight. |
| **Vercel** | 10s serverless timeout, 100GB bandwidth | Dashboard is server-rendered, force-dynamic |
| **GitHub API** | 5000 req/hour (authenticated), 60/hour (unauthenticated) | ~100 requests per full pipeline run |

## GitHub Actions Budget Warning

At current cadence (full every 6h + light every 2h), monthly usage is ~2280 minutes — slightly over the 2000-minute budget. Options:
- Reduce light pipeline to every 3 hours (saves ~360 min/month)
- Reduce full pipeline to every 8 hours (saves ~300 min/month)
- Use npm cache to speed up runs (reduces per-run time)

## Vercel Timeout Constraint

Vercel free tier has a 10-second serverless function timeout. This means:
- The manual refresh button cannot run the pipeline directly — it must trigger GitHub Actions
- Database queries must be fast — no complex joins or full-table scans
- The dashboard loads 200 items in one query — this must remain performant

## Summarization Budget

With Groq as primary (~500K tokens/day) and Gemini as fallback (250 RPD):
- Each summarization request uses ~1-2K tokens (input + output)
- Daily capacity: ~250-500 items via Groq + 250 via Gemini fallback
- This comfortably exceeds daily ingest (~50-150 items across all sources)

## Storage Budget

With 90-day pruning:
- ~50-150 items/day x 90 days = ~4,500-13,500 items at any time
- Average item size: ~5-10KB (content + metadata)
- Estimated DB size: 50-135MB — well within 500MB limit
- Fetch logs add minimal overhead (~100 bytes per entry)
