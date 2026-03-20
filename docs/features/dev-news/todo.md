# DevNews — Todo

> Small fixes, tweaks, and polish. Not features — those go in roadmap.md.

## Pipeline

- [ ] Fix auto-discovery persistence: promoted repo candidates reset to hardcoded watchlist on deploy. Startup should query `repoCandidates` table for `promoted = 1` and restore the runtime watchlist.
- [ ] Update `RATE_LIMIT` in `src/lib/summarizer/client.ts`: model name and limits are stale (references flash-lite with 20 RPD instead of flash with 250 RPD).
- [ ] Add error details to search API: currently catches all errors but returns generic 503 without logging the actual error.
- [ ] GitHub Actions budget: current cadence (full every 6h + light every 2h) exceeds 2000 min/month. Consider reducing light pipeline to every 3 hours.

## Scoring

- [ ] Significance scores updated per-item in a loop (`updateSignificanceScores`). Should use a single bulk UPDATE for performance.
- [ ] `upsertItems` reports all rows as "inserted" — doesn't distinguish actual inserts from updates.

## Frontend

- [ ] Dashboard search uses client-side filtering over 200 preloaded items. The server-side `/api/search` endpoint exists but isn't connected to the UI search input.
- [ ] Content on item detail page strips HTML with regex (`content.replace(/<[^>]*>/g, "")`). Fragile — consider a proper HTML-to-text library.
- [ ] No loading state between page navigations (server components re-render on each route change).

## Data Quality

- [ ] No indication in DB when content is truncated (all sources cap at 10KB). Items with truncated content look complete.
- [ ] Disabled sources (Meta AI, Mistral) should be periodically re-checked to see if their RSS feeds start working.
