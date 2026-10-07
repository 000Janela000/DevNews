# DevNews — Agent Instructions

DevNews is a tech news site. It shows a daily "briefing" of AI news for people who build software. Scheduled jobs collect new articles from about 16 sources. An AI model writes a short summary of each one. The website shows them ranked by importance. The idea: summaries first, and you click through for the details ("drill-down on demand").

- **Live address:** https://dev-news-blond.vercel.app. The home page `/` only sends you on to `/dashboard` (a 307 redirect, from `src/app/page.tsx`).
- **State:** dormant since 2026-04-20, and the live site has no working database right now. Read `STATUS.md` first.

**This file is shared by every AI agent.** Claude Code reads it through `CLAUDE.md`. Codex reads it directly. Keep tool-specific notes out of here.

**Shared rules for all projects:** `../_shared/README.md`. Before social media, Codex, video or browser work, read the matching file in `../_shared/playbooks/`. 🔒 Locks there can't be overridden here.

---

## Start of every session
1. Read `STATUS.md`.
2. Run `git status`. It should be clean, or match what `STATUS.md` says. One untracked file is known: `.claude/settings.local.json`. Never commit it (see `STATUS.md`, open problem 3).
3. If `node_modules` is missing, run `npm install`. Dependencies don't sync between the PC and the Mac.

## End of every session
1. Update `STATUS.md` (log + open problems + next steps).
2. Commit in this repo's style (see "Rules").
3. **Ask Saba before pushing.** A push to `main` deploys the live site on Vercel. Docs-only pushes are fine.

## How it works
1. **Fetch.** `scripts/pipeline.ts` reads all sources. `scripts/pipeline-light.ts` reads only the fast ones. Both remove duplicates (`src/lib/db/dedup.ts`), score the items and save them in the database.
2. **Summarize.** `scripts/summarize.ts` asks an AI model for a short summary of each new item.
3. **Clean up.** `scripts/cleanup.ts` deletes items older than 14 days.
4. **Show.** The website reads the database and builds the briefing (`src/lib/briefing.ts`). `src/lib/clustering.ts` groups articles about the same story into one card.

### AI summaries: the real provider order (checked in the code, 2026-10-08)
`src/lib/summarizer/providers/index.ts` tries 3 providers in order. If one fails, it tries the next one.

| Order | Provider | Model in the code | Key names |
|---|---|---|---|
| 1 | Groq | `llama-3.3-70b-versatile` (Llama 3.3 70B) | `GROQ_API_KEY`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3` (more keys = more free daily quota) |
| 2 | Cerebras | `qwen-3-235b-a22b-instruct-2507` (Qwen3 235B) | `CEREBRAS_API_KEY` |
| 3 | Google Gemini (last resort) | `gemini-2.5-flash` | `GEMINI_API_KEY` |

If all 3 fail, the code throws "All providers failed".

Two older notes are wrong. The old `CLAUDE.md` said "Gemini only". That was the first version (March 2026); the code moved to this 3-provider chain later. The comment in `.env.example` says Cerebras runs Llama 3.3 70B; the code uses Qwen3 235B.

### Sources (from `src/config/sources.ts`, checked 2026-10-08)
- 20 sources are listed; 16 are switched on.
- **On:** blogs by RSS (a standard feed format that sites publish for new posts): Anthropic, Anthropic Engineering, OpenAI, DeepMind, Microsoft Research, Hugging Face, Vercel, Cursor, The Decoder, AI News, MarkTechPost, VentureBeat AI. Also Hacker News, Reddit, GitHub trending repos and GitHub releases.
- **Off:** Meta AI, Mistral, and both ArXiv feeds (research papers; turned off as too noisy).
- A dev.to adapter (a small module that fetches and cleans up one kind of source) is in `src/lib/sources/devto.ts`.
- The original plan also named Google AI and 2 benchmark sites (LMSYS Chatbot Arena, Open LLM Leaderboard). They are not in the source list today.

### Categories
Every item gets one of 5 categories (`src/lib/types/schema.ts`):
1. **Models & Releases:** new AI models, version updates, benchmarks.
2. **Tools & Frameworks:** dev tools, libraries, SDKs, editor plugins.
3. **Practices & Approaches:** prompt writing, RAG (giving a model your own documents to answer from), fine-tuning, agents.
4. **Industry & Trends:** funding, company purchases, adoption, price changes.
5. **Research & Papers:** papers with a practical use.

## Where things live
| Path | What it is |
|---|---|
| `src/app/` | Pages (Next.js App Router). `/dashboard` is the briefing. Also `/item/[id]` (one story), `/digest`, `/saved`, `/read-later`, `/colophon`, `/login`. |
| `src/app/api/` | API routes: `health` (is the data fresh?), `refresh` (starts the light pipeline on GitHub; needs `GH_PAT`; 30-minute cooldown), `search`, `user-state` (saved, read later, read). |
| `src/app/auth/` | Login callback and sign-out. Login is "Continue with GitHub" through Supabase Auth. Reading needs no login. Only Save and Read Later need one. |
| `src/proxy.ts` | Next.js 16 "proxy". This is the new name for middleware (code that runs before every request). It refreshes the Supabase login cookie. |
| `src/components/` | UI parts. `ui/` holds shadcn/ui components. They are copied into the repo, so you can edit them. |
| `src/config/sources.ts` | The list of news sources, and which are on. |
| `src/lib/sources/` | One adapter per source type: RSS, Hacker News, Reddit, GitHub, GitHub releases, ArXiv, dev.to. Plus `health.ts`, which spots feeds that quietly stopped working. |
| `src/lib/summarizer/` | AI summaries: the prompt (`prompt.ts`) and the provider chain (`providers/`). |
| `src/lib/scoring/` | Importance score: freshness, engagement, weights. |
| `src/lib/db/` | Database code: Drizzle schema (`schema.ts`), queries, writes, dedup, user state. |
| `src/lib/supabase/` | Supabase clients for login (browser, server, proxy). |
| `src/lib/types/` | Zod schemas and types: `TrackedItem`, `DataSource`, categories. |
| `scripts/` | Pipeline scripts. GitHub Actions runs them; you can also run them by hand. `check-sources.ts` tests the RSS feeds. |
| `.github/workflows/` | The 3 scheduled jobs (see "Scheduled pipelines"). |
| `drizzle.config.ts` | Drizzle Kit settings: schema path, and `DATABASE_URL` for the connection. |
| `docs/features/dev-news/` | Product docs: overview, user features, system, limits, what DevNews won't do, roadmap, todo. |
| `docs/v0-prompts.md` | Design prompts used for an earlier UI redesign. |
| `openspec/` | OpenSpec: spec-driven work (write a spec for a change first, then build it). `specs/` = current specs. `changes/` = changes still open. `changes/archive/` = finished ones. |
| `PLAN.md` | The original 9-phase build plan. All phases were done by 2026-03-19. Kept for history. |
| `STATUS.md` | Current state, open problems, next steps, log. |
| `.env.example` | Names of the env vars (settings and keys the app gets from outside the code). Real values live in `.env.local` (gitignored; never open or print it), in Vercel and in GitHub Actions secrets. |

## Tech stack (checked in `package.json`, 2026-10-08)
- **Next.js 16.1.7** (App Router), **React 19.2**, **TypeScript** in strict mode. (The old `CLAUDE.md` said Next.js 15; that was out of date.)
- Tailwind CSS v4, shadcn/ui, lucide-react icons, cmdk (the command palette), next-themes (dark mode), sonner (small pop-up messages).
- Drizzle ORM with the `postgres` driver. An ORM is a library that turns code into database queries.
- Supabase: PostgreSQL database and GitHub login.
- Zod 4 for data checks, date-fns for dates, rss-parser for feeds.
- `@vercel/og` makes the link-preview images (`opengraph-image.tsx`).
- Package manager: **npm** (`package-lock.json`).

Why this stack (from the original notes): shadcn/ui components live in the repo, so an AI can read and edit them. Drizzle code looks like SQL, so it is predictable. Zod defines a type once, for both TypeScript and runtime checks. Strict TypeScript catches mistakes before they run.

## Run, check, deploy
- `npm install`: once per machine. CI uses `npm ci`.
- `npm run dev`: local site at http://localhost:3000. It needs `.env.local`.
- `npm run build`: production build. `npm run start` runs that build.
- `npm run lint`: ESLint (a tool that finds code problems).
- Type check: `npx tsc --noEmit`. There is no npm script for it.
- **Tests: none.** There is no test suite. Before saying a code task is done, run `npm run lint` and `npm run build`, and say clearly that no tests exist.
- **Pipelines by hand** (they read `.env.local`):
  - `npm run pipeline` (all sources), `npm run pipeline:light` (fast sources), `npm run summarize` (AI summaries), `npm run cleanup` (delete old items).
  - `npm run pipeline:full` = pipeline + summarize. `npm run all` = pipeline + summarize + cleanup.
  - ⚠️ These write to the database in `DATABASE_URL`. Only one Supabase project is known, so treat it as the live database.
- Check the RSS feeds (read-only): `npx tsx --tsconfig tsconfig.json scripts/check-sources.ts`.
- **Database schema** (Drizzle Kit; needs `DATABASE_URL` set in the shell):
  - `npm run db:generate`: write migration files (files that describe a schema change).
  - `npm run db:push`: ⚠️ changes the live database schema. Ask Saba first.
  - `npm run db:studio`: browse the data.
- **Deploy:** the Vercel project `dev-news` is linked to GitHub. Every push to `main` deploys to production by itself. (Checked 2026-10-08: the last production deploys came from `main` commits. The last one was 2026-04-20.) There is no `vercel.json`. Never run the `vercel` command from the repo root without a named project (see "Deploy safety" in `../_shared/standards/repo-conventions.md`).

## Scheduled pipelines (GitHub Actions)
These 3 jobs keep the news fresh. Times are UTC. They run on GitHub's standard runners, which are free for public repos.

| Workflow file | Name | Schedule | What it does | Secrets it uses |
|---|---|---|---|---|
| `pipeline.yml` | Data Pipeline | Every 6 hours at :17 (`17 */6 * * *`) | Fetch all sources, then write AI summaries. Max 30 minutes. A manual run can set `skip_summarize` and `lookback_hours`. | `DATABASE_URL`, `GH_PAT` (passed in as `GITHUB_TOKEN`), `GROQ_API_KEY`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`, `CEREBRAS_API_KEY`, `GEMINI_API_KEY` |
| `pipeline-light.yml` | Light Pipeline (Fast Sources) | Every 3 hours at :37 (`37 */3 * * *`) | Fetch only the fast sources (RSS, Reddit, GitHub releases, dev.to). No AI. The site's refresh button (`/api/refresh`) starts this one too. | `DATABASE_URL` |
| `cleanup.yml` | Retention Cleanup | Daily at 02:07 | Delete items older than 14 days. A manual run can set `retention_days`. | `DATABASE_URL` |

**State on 2026-10-08: all 3 are OFF.** GitHub turned them off by itself (`disabled_inactivity`). In a public repo, GitHub stops scheduled jobs after 60 days with no repo activity. The last runs were on 2026-06-19 (both pipelines) and 2026-06-20 (cleanup). All succeeded. So right now they cost nothing and use no AI quota.

- Check: `gh workflow list -R 000Janela000/DevNews --all` and `gh run list -R 000Janela000/DevNews --limit 10`.
- Turn one back on: `gh workflow enable pipeline.yml -R 000Janela000/DevNews` (same for the other 2). Do this only after the database works again (see `STATUS.md`).
- ⚠️ When `cleanup.yml` runs again, it deletes every item older than 14 days. After a long pause, that is all the old data. That is fine for a news site, but know it before you turn it on.

## Accounts and secrets (names only, never values)
- **GitHub:** `000Janela000/DevNews`, **public**. The local git remote still uses the old name `000Janela000/dev-news.git`. GitHub forwards it, so it works. The repo's homepage link is already set to the live address.
- **Vercel:** project `dev-news`, team "Janela's projects", Hobby plan. The Vercel MCP can read it. Changes need the Vercel dashboard (BROWSER). See `../_shared/registry/accounts.md`.
- **Supabase:** one project, for the database and for GitHub login. Which Supabase login owns it is not written down yet.
- **Env var names in `.env.example`:**
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase address and public key (they are sent to the browser).
  - `SUPABASE_SERVICE_ROLE_KEY`: listed, but no code reads it (checked 2026-10-08).
  - `DATABASE_URL`: the Supabase "pooler" address (port 6543, transaction mode).
  - `GROQ_API_KEY`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`, `CEREBRAS_API_KEY`, `GEMINI_API_KEY`: AI providers.
  - `GITHUB_TOKEN`: optional; gives the GitHub source adapters more API quota.
  - `GH_PAT`: optional; a fine-grained GitHub token with `actions:write` on this repo. The refresh button needs it.
- **Read by the code but not in `.env.example`:** `NEXT_PUBLIC_SITE_URL` (the site's own address, used for link previews), `GITHUB_REPO` (default `000Janela000/dev-news`), `PIPELINE_LOOKBACK_HOURS`, `CLEANUP_RETENTION_DAYS`.
- **GitHub Actions secrets** (names, checked 2026-10-08): `DATABASE_URL`, `GH_PAT`, `GROQ_API_KEY`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`, `CEREBRAS_API_KEY`, `GEMINI_API_KEY`.

## Rules
- **Commits:** one subject line in the Conventional Commits style: `type(scope): summary` or `type: summary`. Types used here: `feat`, `fix`, `chore`, `docs`. Examples from the history:
  - `fix(ui): server component crash — remove onClick from saved/read-later/digest`
  - `feat: broaden source coverage + detect silently-dying feeds`

  Most past commits also have a body and a `Co-Authored-By:` trailer (an extra line at the end that names a co-author).
- **The repo is public.** Never commit `.env.local`, `.claude/settings.local.json`, keys or personal data.
- **One database.** Treat every pipeline or `db:` command as touching live data.
- **Stay on free tiers.** Ask Saba before anything that costs money.
- **Coding standards** (kept from the old `CLAUDE.md`):
  - TypeScript strict mode. No `any` types.
  - Server Components by default. Use Client Components only for interactivity.
  - Never pass an event handler (like `onClick`) inside a Server Component. That crashed production on 2026-04-20 (commit `18f0cc0`).
  - Put reusable logic in `src/lib/`.
  - Every source adapter implements the `DataSource` interface. Every item matches the `TrackedItem` type.
  - Keep components small and focused.
  - Use Tailwind classes directly. No custom CSS unless really needed.
  - Prefer `fetch` with Next.js caching over other HTTP libraries.
  - Every API key and outside URL comes from an env var.
  - Wrap outside data fetching in error boundaries (fallback UI shown when a part of the page fails).
- **Free-tier limits** (from the original plan, March 2026; not re-checked):
  - Supabase free: 500 MB database, 50,000 monthly active users.
  - Gemini 2.5 Flash: about 250 requests per day (from `.env.example`). The code waits 6.5 seconds between Gemini calls, so it stays under 10 per minute.
  - The old plan also listed a 2,000 minutes/month GitHub Actions budget and a 10-second Vercel function limit. The repo is public now, so GitHub's standard runners are free. Check Vercel's current limit before you rely on that number.
  - Cache outside data hard.
- **Phase protocol** (from the build phase): if work is planned in phases, do one phase at a time. After each phase, update `PLAN.md`, re-check the phases left, re-plan if needed, and write down why.
- **Plain, simple words** in all docs and notes.

## Overrides of the shared rules
None.

(The commit style differs from the workspace default for new repos: `feat`/`fix` instead of `feature`/`bugfix`, and trailers are allowed. But `../_shared/standards/repo-conventions.md` lets existing repos keep their own style, so this is not an override.)
