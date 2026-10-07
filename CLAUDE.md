@AGENTS.md

# Claude Code — extra notes

The shared rules are in `AGENTS.md` (imported above). This part is only for Claude Code. All project facts from the old version of this file (stack, folders, categories, sources, coding standards, free-tier limits, phase protocol) now live in `AGENTS.md`.

- **Browser:** Playwright uses this project's own profile (see `../_shared/playbooks/browser.md`). When a site asks for a login, stop and ask Saba to log in in that window.
- **MCP servers:** this repo has no `.mcp.json`. The workspace's Vercel MCP can read the `dev-news` project (deployments, logs, domains). It is read-only; changes go through the Vercel dashboard (BROWSER).
- **OpenSpec commands** (in `.claude/commands/opsx/`). OpenSpec means: write a spec for a change first, then build it.
  - `/opsx:propose`: start a new change. It creates `openspec/changes/<name>/` with a proposal, design, specs and tasks.
  - `/opsx:apply`: build the tasks of a change.
  - `/opsx:archive`: finish a change and move it to `openspec/changes/archive/`.
  - `/opsx:explore`: think an idea or a problem through before you build.
- **OpenSpec skills** (in `.claude/skills/`): `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore`. They do the same jobs as the commands above.
- **Permissions:** `.claude/settings.json` (committed) lets Claude run Bash and the file tools without asking.
- **`.claude/settings.local.json`** is a local file on this machine only. **Never commit it.** It holds a token, and it is not in `.gitignore` yet, while the repo is public (see `STATUS.md`, open problem 3).
