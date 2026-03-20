# DevNews — Boundaries

Things DevNews intentionally does NOT do, and why.

## No Per-User Personalization

Every user sees the same curated briefing, defined by global config weights. No per-user preference learning, no recommendation algorithm, no engagement tracking.

**Why:** Engineering complexity is too high for current stage. Global curation tuned to the primary user's needs (AI orchestrator perspective) serves the target audience well. Auth exists only for Save/Read Later — not for personalization.

**Revisit when:** User base grows enough that diverse needs make global curation insufficient.

## No Benchmark / Leaderboard Tracking

No automated tracking of model benchmarks (LMSYS Chatbot Arena, Open LLM Leaderboard) or comparative performance dashboards.

**Why:** Not a priority for the primary user's workflow. Benchmark changes surface through regular news coverage from sources like The Decoder and HackerNews.

**Revisit when:** The product starts serving a broader audience who may want at-a-glance model comparison.

## No Email Newsletter / Push Notifications

No email digest delivery, no push notifications, no mobile alerts.

**Why:** The product is dashboard-first (pull, not push). Newsletter delivery adds infrastructure complexity (email provider, subscriber management, unsubscribe compliance). The briefing model is designed for on-demand visits, not scheduled delivery.

**Revisit when:** User retention data suggests push would meaningfully improve engagement.

## No Twitter/X Integration

No ingestion from Twitter/X despite it being where many AI announcements break first.

**Why:** Twitter API requires a minimum $100/month paid tier. This violates the free-tier constraint. Workarounds (Nitter bridges, RSS converters) are unreliable and frequently break.

**Revisit when:** A reliable free Twitter-to-RSS bridge exists, or the project gets revenue.

## No Video Content (YouTube)

No ingestion from YouTube AI channels, demo videos, or tutorials.

**Why:** Video content cannot be meaningfully summarized in a text dashboard. Transcription would require additional AI budget. The 20-minute briefing is designed for reading, not watching.

**Revisit when:** Audio/podcast briefing features are added that could consume video transcripts.

## No Real-Time Updates

The dashboard does not update in real-time (no WebSocket, no SSE, no polling). Data refreshes when the user reloads the page.

**Why:** The briefing model is designed for discrete reading sessions, not continuous monitoring. Real-time adds infrastructure complexity (WebSocket server, connection management) for minimal value. The health indicator shows data freshness.

**Revisit when:** The product shifts toward breaking-news alerts or real-time collaboration.

## No Community Features

No comments, voting, discussion threads, or user-generated content.

**Why:** Community features require moderation, abuse prevention, and ongoing maintenance. The product is a curated feed, not a forum. HackerNews and Reddit serve the discussion function — DevNews links to those discussions.

**Revisit when:** A distinct community need emerges that existing platforms don't serve.

## No Multi-Language Support

All content and UI in English only.

**Why:** Target audience (developers working with AI) operates primarily in English. AI summarization quality degrades in other languages. No demand signal for localization.

**Revisit when:** Clear demand from a non-English developer community.
