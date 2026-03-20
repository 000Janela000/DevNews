# DevNews — Todo

> Small fixes, tweaks, and polish. Not features — those go in roadmap.md.

## Pipeline

- [x] Fix auto-discovery persistence: promoted repo candidates now restored from DB at pipeline startup via `restorePromotedCandidates()`.
- [x] ~~Update `RATE_LIMIT` in `src/lib/summarizer/client.ts`~~: resolved — `client.ts` deleted, replaced by multi-provider system.
- [x] Add error details to search API: now logs actual error before returning 503.
- [x] GitHub Actions budget: light pipeline reduced from every 2h to every 3h. New budget: ~40 + 24 = 64 min/day = ~1920 min/month (under 2000).

## Scoring

- [ ] Significance scores updated per-item in a loop (`updateSignificanceScores`). Acceptable at current scale (<500 items). Revisit if item count grows significantly.
- [ ] `upsertItems` reports all rows as "inserted" — doesn't distinguish actual inserts from updates. Low impact, cosmetic.

## Frontend

- [ ] Dashboard search uses client-side filtering over preloaded items. The server-side `/api/search` endpoint exists but isn't connected to the UI search input. Consider wiring it for queries that exceed the loaded set.
- [ ] Content on item detail page strips HTML with regex (`content.replace(/<[^>]*>/g, "")`). Fragile — consider a proper HTML-to-text library.
- [ ] No loading state between page navigations (server components re-render on each route change).

## Data Quality

- [ ] No indication in DB when content is truncated (all sources cap at 10KB). Items with truncated content look complete.
- [ ] Disabled sources (Meta AI, Mistral) should be periodically re-checked to see if their RSS feeds start working.
