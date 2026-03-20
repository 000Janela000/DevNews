# DevNews — System Behavior

## Data Pipeline

### Full Pipeline (every 6 hours)

Triggered by GitHub Actions cron at :17 past every 6th hour, or manually via workflow_dispatch.

1. Determine "since" date from last successful fetch (or 24h lookback if first run)
2. Fetch all 7 source types in parallel (Promise.allSettled — one failure doesn't block others)
3. Deduplicate: URL normalization + title similarity (Jaccard > 0.6)
4. Upsert to database in batches of 50 (on conflict: keep longer content, never overwrite existing summary)
5. Log fetch results per source (item count, duration, errors)
6. Recalculate significance scores for items from last 7 days
7. Check repo candidates for auto-promotion to release watchlist (seen 3+ times)
8. Prune items older than 90 days

Pipeline exits with error code 1 only if ALL sources fail.

### Light Pipeline (every 2 hours)

Triggered by GitHub Actions cron at :37 past every 2nd hour, or manually via workflow_dispatch.

- Fetches fast sources only: RSS feeds, Reddit, GitHub Releases, Dev.to
- 4-hour lookback window
- Same dedup and upsert logic as full pipeline
- No summarization step
- 3-minute timeout

### Manual Refresh Trigger

When a user presses the manual refresh button on the dashboard:

1. Dashboard sends request to server-side API route
2. API route triggers GitHub Actions light pipeline via workflow_dispatch API
3. Dashboard enters "Refreshing..." state
4. Pipeline runs (~3 minutes)
5. Next dashboard load detects fresh data, health turns green, button locks

## Summarization Pipeline

Runs after each full pipeline.

1. Fetch unsummarized items from database (ordered by most recent)
2. For each item, call AI provider:
   - Primary: Groq (Llama 3.3 70B)
   - Fallback: Gemini 2.5 Flash (if Groq fails or is rate-limited)
3. AI returns structured JSON: summary, category, importance (1-5), tags, devRelevance, isAIRelated
4. Validate response with Zod schema
5. If validation fails: fall back to extracting first 2 sentences as basic summary
6. Off-topic items: marked with importance 0, summary prefixed with "[Off-topic]"
7. Update item in database with summary, refined category, importance, tags, devRelevance

Rate limiting: delay between requests per provider's limits. Sequential processing.

## Story Clustering

When items are ingested, the system groups articles covering the same event:

- Cross-source matching using title similarity and URL overlap
- Clustered items presented as a single card in the briefing
- A synthesis summary is generated combining all source perspectives
- Individual source articles accessible from the cluster detail view

## Auto-Discovery

The system automatically discovers new repos for the GitHub Releases watchlist:

1. During GitHub trending search, each repo is tracked as a "candidate" in the database
2. Candidates have a `timesSeen` counter incremented each time they appear
3. When a candidate reaches 3+ appearances, it is "promoted" to the release watchlist
4. Promoted repos have their releases tracked going forward

Note: Promotion persists in the database, but the runtime watchlist resets on deploy. Startup should query promoted candidates to restore the list.

## Scoring Recalculation

Every full pipeline run recalculates significance scores for items from the last 7 days:

- Source trust weight (0-10): based on source authority
- Engagement score (0-10): from HN points, Reddit score, GitHub stars, comment counts
- Importance (2-10): AI-assigned importance scaled from 1-5 to 2-10
- Freshness multiplier (0.1-1.0): time decay from publication date

Items older than 7 days receive a 0.1 freshness multiplier (heavily discounted but not hidden).

## Data Pruning

Items older than 90 days are deleted from both the items and fetch_logs tables. This runs at the end of every full pipeline to keep the database within Supabase's 500MB free tier.
