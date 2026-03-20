# DevNews — Overview

## What It Is

A time-budgeted intelligence feed for developers transitioning into AI orchestrator roles. Aggregates AI news from multiple source types, summarizes with AI, scores by relevance, and presents a curated ~20-minute daily briefing.

## Core Concepts

### The Daily Briefing

The main view is not a firehose — it is a curated reading session.

- Target: ~20 minutes of content per session
- Items ranked by significance score (trust + engagement + importance x freshness)
- Unread items persist across visits — nothing is lost until the user marks it read
- New items appear on return; old unread items stay in place
- Reading time estimated per item (word count / 200 WPM)

### Content Philosophy

Every item is evaluated through one lens: **"Does this help a developer choose, use, or get more from AI tools?"**

High priority content:
- Model releases, capability changes, pricing shifts
- Tool and framework updates, SDK changes, new entrants
- Breaking changes and deprecations
- Practical AI usage techniques (prompting, testing, design with AI)
- Stack comparisons and recommendations

Low priority content:
- Pure academic research without practical application
- Industry gossip and funding rounds (unless they threaten a tool)
- Speculative think pieces
- AI ethics debates and policy discussions

### Scoring System

Each item receives a composite significance score (0-30):

| Component | Range | Source |
|-----------|-------|--------|
| Source trust | 0-10 | Hardcoded weights per source (official blogs highest) |
| Engagement | 0-10 | Community signals: HN points, Reddit score, GitHub stars |
| AI importance | 0-10 | Summarizer-assigned importance (1-5) scaled to 2-10 |
| Freshness | 0.1-1.0 | Time decay multiplier |

Formula: (trust + engagement + importance) x freshness

### Story Clustering

When multiple sources cover the same event, items are grouped into a single story card. The card shows a synthesis summary combining all perspectives, with a "N sources" badge. The detail view shows all individual source articles.

### Data Categories

| Category | What It Covers |
|----------|---------------|
| Models & Releases | New AI models, version updates, benchmarks, capability changes |
| Tools & Frameworks | Dev tools, libraries, SDKs, IDE integrations |
| Practices & Approaches | Prompt engineering, RAG, fine-tuning, agents, AI-assisted workflows |
| Industry & Trends | Pricing changes, acquisitions, adoption trends |
| Research & Papers | Papers with practical implications for developers |

### Data Sources

7 source types across 18+ configurations:

| Type | Sources | Trust Level |
|------|---------|-------------|
| RSS (Official blogs) | Anthropic, OpenAI, DeepMind, Microsoft, HuggingFace, Vercel | Highest (8-10) |
| RSS (News sites) | The Decoder, AI News, MarkTechPost, VentureBeat | Medium (5-7) |
| HackerNews | AI-filtered via Algolia (19 queries, min 20 points) | High (7) |
| Reddit | r/MachineLearning, r/LocalLLaMA, r/artificial | Medium (6) |
| GitHub Search | Trending AI repos (5 queries, min 10 stars) | Low (3) |
| GitHub Releases | Watchlist of 10 key repos + auto-discovered repos | High (9) |
| ArXiv | cs.AI, cs.CL categories (50 per category) | High (7) |
| Dev.to | AI-tagged articles (min 10 reactions) | Low (4) |

2 sources disabled due to broken RSS: Meta AI, Mistral.

### Summarization

Multi-provider AI summarization:

- Primary: Groq (Llama 3.3 70B) — ~500K tokens/day free tier
- Fallback: Google Gemini 2.5 Flash — 250 RPD free tier
- Each item receives: 2-3 sentence summary, category, importance (1-5), tags, dev relevance, orchestrator-relevance flag
- Off-topic items flagged with importance 0

### Deduplication

Two-layer dedup applied at ingestion:

1. URL normalization (strip tracking params, www, trailing slashes)
2. Title similarity (Jaccard coefficient > 0.6 on tokenized words)

When duplicates found, the version with more content is kept.

### Data Lifecycle

- Full pipeline: every 6 hours (all sources)
- Light pipeline: every 2 hours (RSS, Reddit, GitHub Releases, Dev.to)
- Summarization: runs after each full pipeline
- Pruning: items older than 90 days deleted (Supabase 500MB limit)
- Significance scores recalculated for items from last 7 days
