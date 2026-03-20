# DevNews — Todo

> Small fixes, tweaks, and polish. Not features — those go in roadmap.md.

## Pipeline

- [x] Fix auto-discovery persistence: promoted repo candidates now restored from DB at pipeline startup.
- [x] ~~Update `RATE_LIMIT` in `src/lib/summarizer/client.ts`~~: resolved — replaced by multi-provider system.
- [x] Add error details to search API: now logs actual error before returning 503.
- [x] GitHub Actions budget: light pipeline reduced from every 2h to every 3h (~1920 min/month).
- [x] Disabled source re-checking: added `scripts/check-sources.ts` to verify disabled and enabled RSS feeds.

## Scoring

- [x] Significance scores: per-item loop is acceptable at current scale (<500 items). No change needed.
- [x] `upsertItems`: now properly distinguishes inserts from updates by checking existing URLs before upsert.

## Frontend

- [x] Server-side search wired to UI: debounced API call merges server results with client-side filter.
- [x] HTML stripping: replaced inline regex with `src/lib/html.ts` utility that handles entities and line breaks.
- [x] Loading states: added `loading.tsx` for dashboard, item detail, and digest pages.
- [x] Content truncation: detail page shows "Content truncated" note when content hit the 10KB cap.

## Data Quality

- [x] All items addressed.
