# DevNews — Status

> Read this at the start of every session. Update it at the end.
> Rule: if it matters next session, write it here. Never put secret values here; write only where they live.
> Last updated: **2026-10-08**

## Where we are
- **Live:** https://dev-news-blond.vercel.app (`/` redirects to `/dashboard`). **Broken right now:** every visitor sees "Database not connected" (checked 2026-10-08).
- **Stage:** dormant. The last commit and the last deploy were on 2026-04-20. Saba dropped it from the portfolio on 2026-04-20.
- **Hosting / deploy:** Vercel project `dev-news` (Hobby plan). A push to `main` deploys to production. The database and logins use Supabase (free plan).
- **Scheduled pipelines:** all 3 are **off** since about 2026-06-20. GitHub turned them off by itself after 60 days with no repo activity. So they spend no money and no AI quota now. Details: `AGENTS.md`, "Scheduled pipelines".
- **Plans and history:** `PLAN.md` is the original 9-phase build plan (all done by 2026-03-19). Product docs: `docs/features/dev-news/`. Specs: `openspec/`.

## Open problems (most important first)
1. **The live site has no database.**
   - What we see: `/dashboard` says "Database not connected. Set DATABASE_URL and run npm run db:push." `/api/health` answers 503. The Supabase project's web address no longer exists in public DNS (Cloudflare and Google DNS both answer "no such name", checked 2026-10-08).
   - Likely cause, step by step: the last push was on 2026-04-20. 60 days later, GitHub turned off the scheduled jobs. Then nothing wrote to the database. Supabase pauses a free project after about 1 week with little database activity. **This is a guess, not checked.** Saba must look in the Supabase dashboard: is the project paused or deleted? Supabase emails the owner when it pauses a project, so that email gives the date.
   - Supabase's docs (checked 2026-10-08) say a paused free project can be restored for **1 year** after the pause (Supabase Studio → the project → "Resume project"). If it was paused in late June 2026, that leaves time until about June 2027.
   - Why it matters: every visitor sees an error instead of news.
2. **All 3 scheduled pipelines are off** (`disabled_inactivity`). There is no new news since 2026-06-19. That is fine while the project sleeps. They need a working database before they can run again.
3. **A token sits in a plain file that could get committed.**
   - `.claude/settings.local.json` holds an `NPM_TOKEN` value (in its `env` block). The value is not copied here.
   - The file is untracked and was never committed (checked 2026-10-08). But it is **not in `.gitignore`**, and the repo is **public**. One `git add -A` would publish the token.
   - It also syncs to the Mac through Syncthing. The workspace rule says credentials don't belong in the synced folder.
   - DevNews doesn't publish npm packages, so the token is probably a leftover.
   - Fix: HUMAN decides, then AUTO: move the token to a user env var (or delete it), add `.claude/settings.local.json` to `.gitignore`, and revoke the token on npmjs.com if nothing needs it.
4. **Link previews are broken.**
   - The `og:image` and `twitter:image` tags (the picture shown when someone shares a link) point to `https://dev-news.vercel.app/opengraph-image…`. That is a different address, and it answers 404. The real image works at `https://dev-news-blond.vercel.app/opengraph-image`.
   - Cause: `NEXT_PUBLIC_SITE_URL` is not set in Vercel, and the fallback address in `src/app/layout.tsx` (line 23) is wrong.
   - Fix: set `NEXT_PUBLIC_SITE_URL` in Vercel (BROWSER), or correct the fallback in the code.
5. **Search basics are missing.**
   - No `robots.txt` (404), no `sitemap.xml` (404), no canonical tag (the tag that tells Google the one true address of a page).
   - `/` is a temporary (307) redirect to `/dashboard`. Google treats a 307 as "not moved for good". A permanent redirect (308), or showing the briefing at `/`, is better.
   - See "Full setup" below.
6. **No error tracking (Sentry), no analytics, no uptime check, and no tests.**
7. **Small drift in docs and code** (no harm today):
   - `README.md` is still the default create-next-app text.
   - `.env.example` says Cerebras runs Llama 3.3 70B. The code uses Qwen3 235B.
   - `.env.example` lists `SUPABASE_SERVICE_ROLE_KEY`, but no code reads it.
   - `.env.example` and `src/app/api/refresh/route.ts` still use the old repo name `000Janela000/dev-news`. GitHub forwards old names, so it should work. Not tested.
   - GitHub Actions use Node 22; Vercel uses Node 24.
   - `PLAN.md` marks every phase done, but its task boxes were never ticked.
   - 2 OpenSpec changes are still open in `openspec/changes/`: `data-foundation` (built, but never ticked or archived) and `feed-alignment` (4 tasks open: fill in missing scores, build check, re-run scoring, re-summarize a sample).

## Next steps
- **HUMAN — Saba decides: keep, pause the cron pipelines, or archive.**
  - **Keep:** Saba restores the Supabase project (HUMAN). Then an agent checks `/api/health` and the dashboard, turns the 3 workflows back on (`gh workflow enable <file> -R 000Janela000/DevNews`), fixes problems 3–5, and works through "Full setup" below (AUTO). Note: the first cleanup run deletes every item older than 14 days, so all the old June data goes.
  - **Pause:** the workflows are already off, so nothing more is needed for them. But the site keeps showing the database error. Either restore the database so the site shows the old news, or take the site offline in the Vercel dashboard (BROWSER).
  - **Archive:** download a Supabase backup if wanted, then delete the Supabase project. Revoke the AI keys and `GH_PAT`. Remove the Vercel project. Archive the GitHub repo (`gh repo archive 000Janela000/DevNews` makes it read-only). Update the registry. Each of these steps needs Saba's "yes" first.
- **Whatever the choice:** fix open problem 3 (the token file), after Saba's "yes".
- **AUTO:** update the DevNews row in `../_shared/registry/projects.md`: `AGENTS.md` ✅, `STATUS.md` ✅ (done 2026-10-08).

## Full setup when this project becomes active
Do these in order, and only after Saba picks "keep" and the database works again. Markers: **AUTO** = an agent alone · **BROWSER** = an agent in Playwright after Saba logs in · **HUMAN** = Saba (see `../_shared/README.md`).

1. **HUMAN: own domain or not?** (`../_shared/standards/new-domain.md`)
   - **Own domain:** Saba buys it. Then run `/domain-setup <domain>`: Cloudflare DNS (AUTO), add the domain in Vercel (BROWSER), 2 CNAME records set to DNS-only (AUTO), AI-crawler settings that allow search bots (AUTO), `hello@` email routing and DMARC (`new-domain.md` steps 5–6). Skip Resend: the app sends no email. After that: redirect `dev-news-blond.vercel.app` to the new domain, set `NEXT_PUBLIC_SITE_URL` to it, and update the GitHub homepage link (`gh repo edit 000Janela000/DevNews --homepage https://<domain>`).
   - **No domain:** stay on `dev-news-blond.vercel.app`. Set `NEXT_PUBLIC_SITE_URL` to that address in Vercel (BROWSER). Skip the DNS and email steps.
2. **HUMAN: Vercel plan.** Hobby (free) is for non-commercial use only. If DevNews ever earns money (ads, sponsors, affiliate links, a paid tier), it needs Pro. See "Rules" in `../_shared/standards/web-basics.md`.
3. **AUTO (code change): search basics.** A news site needs these, so Google finds new articles fast. See `../_shared/standards/web-basics.md` and step 8 of `../_shared/standards/new-domain.md`.
   - `src/app/robots.ts`: allow search bots, point to the sitemap, keep `/login`, `/saved`, `/read-later` and `/api/` out.
   - `src/app/sitemap.ts`: `/dashboard`, `/digest`, `/colophon`, and every `/item/[id]` from the database, with the real `lastmod` date.
   - A canonical tag on every page (`alternates.canonical` in the page metadata).
   - Fix the `metadataBase` fallback in `src/app/layout.tsx` (open problem 4).
   - Make `/` → `/dashboard` permanent (308), or show the briefing at `/`.
   - Mark personal pages `noindex` (tells Google not to list them): `/login`, `/saved`, `/read-later`.
   - Check the 404 page and the link-preview tags with the final address.
4. **BROWSER + AUTO: Cloudflare Web Analytics** (`new-domain.md` step 9).
   - BROWSER: Cloudflare dashboard → Web Analytics → Add a site → type the hostname → pick the option for a site that is not on Cloudflare → "Enable with JS Snippet installation".
   - AUTO: paste the snippet into `src/app/layout.tsx` (with `next/script`). Vercel hosts the site, so Cloudflare can't add the script by itself. The site sets no Content-Security-Policy today, so nothing else needs to change.
5. **Google Search Console** (`new-domain.md` step 11). The tool: `node ../_shared/tools/google.mjs`.
   - **With an own domain (AUTO):** `verify-token <domain>` → add that TXT record at the domain root in Cloudflare → `verify <domain>` → `add-owner <domain> ssjanelidze@gmail.com` → `sc-add <domain>` → `sitemap <domain> https://<domain>/sitemap.xml`.
   - **On `dev-news-blond.vercel.app`:** a Domain property is impossible, because we don't control the DNS of `vercel.app`. Use a **URL-prefix property** for `https://dev-news-blond.vercel.app/` with the **HTML-file check**: Google gives a small file (like `google1234abcd.html`); put it in `public/`, deploy, then verify.
     - Note: `google.mjs` today only does Domain properties (DNS TXT check). It needs a small addition first: the `FILE` check method, the `SITE` site type, and the full URL as the Search Console site id. Or do this step as BROWSER in Search Console.
   - **BROWSER, once:** open the property as Saba and click **"Verify your ownership"**. Without this click, the property exists only for the service account (the robot Google account that `google.mjs` uses).
   - **BROWSER:** request indexing for the home page and `/dashboard`: type the URL into "Inspect any URL", click "Request indexing", wait about a minute.
   - **AUTO, 3–7 days later:** check the sitemap status and whether the home page is indexed (`new-domain.md` step 14).
6. **BROWSER: Sentry** (error tracking) for the web app. Run `npx @sentry/wizard@latest -i nextjs`; it opens a browser login. Set `tunnelRoute` (so ad blockers don't drop error reports). Keep `tracesSampleRate` low (0.1). Put `SENTRY_AUTH_TOKEN` in the Vercel env. Use one Sentry project for the site. See "Sentry set-up per stack" in `../_shared/standards/web-basics.md`.
7. **AUTO: uptime check for the cron pipelines.** The real danger here is quiet: the site stays up, but the news stops. That is exactly what happened in June 2026.
   - Today `/api/health` answers 200 even when the data is "stale" (older than 12 hours). It answers 503 only when the database fails.
   - AUTO (code change): make `/api/health` answer 503 when the status is `stale`.
   - Then point an uptime check at `https://<address>/api/health`. One check then catches both a dead database and stopped pipelines.
   - HUMAN: Sentry's free plan has only **1** uptime monitor for the whole workspace, so Saba picks which site gets it. If DevNews doesn't get it, use Grafana Cloud synthetic checks (the override named in `web-basics.md`).
   - Remember: in a public repo, GitHub turns schedules off after 60 days with no repo activity. Any commit resets that clock.
8. **AUTO: speed baseline** (`new-domain.md` step 13). Run `node ../_shared/tools/google.mjs psi https://dev-news-blond.vercel.app/dashboard` (mobile, median of 3 runs). Also run it on `/colophon` and on one `/item/<id>`. Save the scores in this file. Do this only after the database works; otherwise you measure the error page.
9. **AUTO: update the registry:** `../_shared/registry/projects.md` (and `domains.md` if a domain was added). Then run `/workspace-audit`.

Not needed here: `brain/` (no marketing yet), Resend (the app sends no email), Google Business Profile (no physical place), `private/` (nothing personal in this repo).

## Waiting on someone outside
- Nothing.

## Log (newest first)
- **2026-10-08:** light setup (agent docs) added. New `AGENTS.md` and `STATUS.md`. `CLAUDE.md` now imports `AGENTS.md` and keeps only Claude notes; its project facts moved to `AGENTS.md`, with the AI-provider facts fixed to match the code (Groq → Cerebras → Gemini). The check also found: the live site has no database, the cron jobs are off since 2026-06-20, an `NPM_TOKEN` sits in `.claude/settings.local.json`, and the link-preview images are broken. No code was changed.
- **2026-06-19 / 06-20:** last scheduled runs, all successful. After that, GitHub turned the schedules off.
- **2026-04-20:** last commit and deploy (`fix(ui): server component crash …`). Dropped from Saba's portfolio.
- **2026-03-18 → 2026-04-20:** built in 9 phases (`PLAN.md`), then multi-provider AI summaries, feed-quality work and a full UI redesign (see `git log`).
