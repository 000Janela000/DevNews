# AI Dev Tracker

A real-time dashboard tracking AI developments relevant to software development. Summaries-first, drill-down on demand, multi-source aggregation.

## Tech Stack (Optimized for AI-Driven Development)

- **Framework**: Next.js 15 (App Router, TypeScript strict)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (components live in `src/components/ui/`, fully editable)
- **ORM**: Drizzle ORM (type-safe, SQL-like, predictable)
- **Validation**: Zod (single source of truth for types + runtime validation)
- **Database**: Supabase PostgreSQL (free tier, 500MB)
- **Data Fetching**: RSS feeds + public APIs (GitHub, HackerNews, ArXiv, dev.to)
- **Summarization**: Google Gemini free tier (15 RPM, 1M tokens/day)
- **Automation**: GitHub Actions (cron every 6 hours)
- **Hosting**: Vercel free tier
- **Icons**: lucide-react
- **Dates**: date-fns

### Why this stack for AI-driven dev
- **shadcn/ui**: Components are in the codebase, not node_modules - AI can read and edit them
- **Drizzle**: SQL-like syntax = predictable code generation, type-safe queries
- **Zod**: Define schema once, derive TypeScript types + validation from it
- **TypeScript strict**: Compiler catches AI mistakes before runtime

## Architecture

```
src/
  app/              # Next.js App Router pages
    api/            # API routes (data fetching, summarization)
    dashboard/      # Main dashboard page
    item/[id]/      # Detail view for individual items
  components/       # Reusable UI components
  lib/              # Utilities, API clients, types
    sources/        # Individual source adapters (RSS, GitHub, HN, etc.)
    summarizer/     # LLM summarization logic
    types/          # TypeScript type definitions
  config/           # Source configuration, categories
scripts/            # GitHub Actions scripts for data pipeline
.github/workflows/  # CI/CD and cron jobs
```

## Data Categories

1. **Models & Releases** - New AI models, version updates, benchmarks
2. **Tools & Frameworks** - Dev tools, libraries, SDKs, IDE integrations
3. **Practices & Approaches** - Prompt engineering, RAG, fine-tuning, agents
4. **Industry & Trends** - Funding, acquisitions, adoption trends, pricing changes
5. **Research & Papers** - Key papers with practical implications

## Core Data Sources

- **Blogs/RSS**: Anthropic, OpenAI, Google AI, Meta AI, Microsoft AI, HuggingFace, Vercel AI
- **Aggregators**: HackerNews (AI-filtered), ArXiv (cs.AI, cs.CL), dev.to (AI tag)
- **Repos**: GitHub trending (AI/ML), major tool changelogs
- **Benchmarks**: LMSYS Chatbot Arena, Open LLM Leaderboard

## Rules

### Phase Execution Protocol

This project is built in phases. **An agent executes ONE phase at a time.**

After completing each phase:
1. **Sync the plan**: Update PLAN.md - mark the completed phase as done
2. **Re-analyze remaining phases**: Review all upcoming phases in context of what was just built
3. **Assess relevance**: Determine if remaining phases are still necessary and correctly scoped
4. **Re-phase if needed**: If the plan needs adjustment (merge phases, split phases, reorder, add new phases, remove obsolete ones), update PLAN.md with the revised plan
5. **Document changes**: If the plan was modified, add a brief note explaining why

### Coding Standards

- Use TypeScript strict mode - no `any` types
- Server Components by default, Client Components only when needed (interactivity)
- Extract reusable logic into `src/lib/`
- Source adapters must implement a common interface (`DataSource`)
- All data items must conform to the `TrackedItem` type
- Keep components small and focused
- Use Tailwind utility classes directly - no custom CSS unless absolutely necessary
- Prefer `fetch` with Next.js caching over third-party HTTP clients
- Environment variables for all API keys and external URLs
- Error boundaries around external data fetching

### Free Tier Constraints

- Never exceed Supabase free tier limits (500MB storage, 50K MAU)
- GitHub Actions workflows must be efficient (2000 min/month budget)
- Gemini API calls must be batched and rate-limited (15 RPM)
- Vercel serverless function timeout: 10s on free tier
- All external data must be cached aggressively

## OpenSpec Integration

This project uses OpenSpec for spec-driven development.
- Use `/opsx:propose` for new features
- Use `/opsx:apply` to implement from specs
- Use `/opsx:archive` to finalize completed work
- Specs live in `openspec/specs/`, active changes in `openspec/changes/`
