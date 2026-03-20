# DevNews — Roadmap

> Last updated: 2026-03-20

## Planned

### Summarization & AI

**Multi-Provider Summarization** — Approved
Switch from Gemini 2.5 Flash-Lite (20 RPD) to a multi-provider setup: Groq (Llama 3.3 70B) as primary, Gemini 2.5 Flash as fallback. Increases daily summarization capacity from ~20 items to 500+. Eliminates the core bottleneck where most ingested content never received an AI summary.

**Orchestrator-Focused Summarization Prompt** — Approved
Retune the summarization prompt to evaluate items through an orchestrator lens: "Does this help a developer choose, use, or get more from AI tools?" Research papers should be scored as high relevance if they improve practical AI usage skills (prompting, AI-assisted testing, AI-assisted design). Generic research without practical application should score lower.

### User Experience

**Time-Budgeted Daily Briefing** — Approved
Transform the main dashboard from "show everything" to a curated ~20-minute reading session. Items ranked by significance score. Reading time estimated per item. Total briefing time shown at top. Users see the most important content first and can scroll past the 20-minute mark for more.

**Read State Tracking** — Approved
Track which items each user has read. Unread items persist across sessions — they never disappear until explicitly marked as read. New items appear alongside existing unread items. Prevents FOMO and ensures nothing is missed.

**Read Later & Save Collections** — Approved
Two permanent bookmark types:
- Read Later: personal queue for "not now but don't lose this." Stays forever until read.
- Saved: permanent reference collection for valuable content to revisit.
Both have dedicated views for browsing.

**Progressive Auth** — Approved
Site is fully browsable without login. Auth prompt only appears when a user tries to Save or Read Later. No login wall, no signup friction for casual browsing.

### Content Quality

**Story Clustering** — Approved
Group articles from multiple sources covering the same event into a single story card. Show "N sources" badge. Generate a synthesis summary combining all source perspectives. Reduces redundancy in the briefing — one story slot instead of three for the same event.

### Operations

**Dashboard Health Indicator** — Approved
Show pipeline health directly in the UI:
- Green/yellow/red dot based on last fetch age (thresholds: 4h, 12h)
- "Updated X ago" timestamp always visible
- Stale data warning banner when red

**Manual Refresh Button** — Approved
Button appears when health is yellow or red. Triggers light pipeline via GitHub Actions workflow_dispatch. Enters "Refreshing..." locked state after press. Stays locked until fresh data arrives. No auth needed — state machine prevents abuse.

---

## Completed

(None yet — first audit)

---

## Dropped

**Per-User Personalization** — Dropped 2026-03-20
Per-user preference learning, recommendation algorithms, engagement-based ranking. Too complex for current stage. Global curation serves the target audience (developers as AI orchestrators).

**Benchmark/Leaderboard Tracking** — Deferred 2026-03-20
Automated tracking of model benchmarks and performance leaderboards. Not a priority for primary user. Benchmark changes surface through regular news sources.

---

## Competitive Intelligence

Key findings from competitive analysis (2026-03-20):

- **DevNews is the only free, open-source, AI-focused, developer-specific dashboard with AI summarization.** No competitor matches all attributes.
- **Ben's Bites** (news.bensbites.com) is the closest structural competitor: newsletter + web aggregator with voting. But no AI summaries, no developer-specific filtering, no source diversity metrics.
- **daily.dev** is the UX gold standard for developer news (personalized algorithm, 1M+ users) but covers all dev topics broadly, not AI-specific.
- **NBot AI** is the most threatening new entrant: conversational AI feed, audio briefings, natural language topic tracking. But generic (any topic), not purpose-built for AI developers.
- **Feedly Leo** is the closest paid competitor ($12/month): AI filtering + summarization + multi-source. DevNews being free is a clear advantage.
- **Newsletter fatigue is real**: average AI professional subscribes to 4.2 newsletters but reads 2.1. DevNews's dashboard-first (pull, not push) model is inherently better for fatigue.
- **Aggregator graveyard effect** (Baekdal): hundreds of aggregators have failed because they aggregated more instead of curating better. DevNews's scoring + summarization + briefing model moves it toward curation.

Sources:
- [TLDR AI](https://tldr.tech/ai) — 1.25M subscribers, human-written summaries
- [The Rundown AI](https://www.therundown.ai/) — 2M subscribers, C-suite focused
- [Ben's Bites](https://news.bensbites.com/) — newsletter + web aggregator
- [daily.dev](https://daily.dev/) — browser extension, 1M+ developers
- [Feedly Leo](https://feedly.com/ai) — $12/month AI-powered RSS
- [NBot AI](https://nbot.ai/) — conversational AI news agent
- [AlphaSignal](https://alphasignal.ai/) — technical AI newsletter for engineers
- [HuggingFace Daily Papers](https://huggingface.co/papers) — absorbed Papers With Code
- [Why Aggregators Fail (Baekdal)](https://baekdal.com/newsletter/why-do-news-aggregator-apps-keep-failing/)

## Audit History

- 2026-03-20: Full product audit. Analyzed codebase (all source files), observability, and 10+ competitors. 7 major decisions: multi-provider summarization, dashboard health indicator, time-budgeted briefing, progressive auth, story clustering, global curation, orchestrator-focused content filter. Dropped per-user personalization and benchmark tracking.
