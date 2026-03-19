# DevNews - Project Context

## Overview

A free, self-updating dashboard that tracks AI developments relevant to software development. Designed for developers who want to stay current with AI trends without reading dozens of blogs and newsletters.

## Tech Stack (AI-Driven Development Optimized)

- **Frontend**: Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4
- **UI**: shadcn/ui (editable components in src/components/ui/)
- **ORM**: Drizzle ORM (type-safe, SQL-like)
- **Validation**: Zod (schema-first types + validation)
- **Backend**: Next.js API routes + GitHub Actions cron jobs
- **Database**: Supabase PostgreSQL (free tier)
- **Summarization**: Google Gemini free tier API
- **Hosting**: Vercel free tier
- **Package Manager**: npm

## Architecture Principles

- Dashboard-first: summaries on the main view, details on drill-down
- Multi-source: no single source dependency, aggregate from 10+ sources
- Free-tier only: every service used must have a free tier sufficient for this project
- Automated: data pipeline runs on GitHub Actions cron, no manual intervention
- Cacheable: aggressive caching to stay within rate limits

## Domain

- **Target user**: Software developers tracking AI industry developments
- **Content focus**: Models, tools, frameworks, practices, trends - specifically as they relate to software development
- **NOT in scope**: General AI news (politics, ethics debates, sci-fi speculation)

## Conventions

- File naming: kebab-case for files, PascalCase for components
- Imports: use `@/*` alias for src directory
- Components: Server Components by default
- Data: all items conform to `TrackedItem` interface
- Sources: each source has an adapter implementing `DataSource` interface
