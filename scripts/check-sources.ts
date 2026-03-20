/**
 * Check disabled RSS sources to see if they've started working.
 * Run manually: npx tsx --tsconfig tsconfig.json scripts/check-sources.ts
 */

import { SOURCE_REGISTRY } from "@/config/sources";

const TIMEOUT_MS = 10_000;

async function checkFeed(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "DevNews/1.0" },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { ok: false, status: res.status };
    }

    const text = await res.text();
    // Basic XML check
    if (text.includes("<rss") || text.includes("<feed") || text.includes("<atom")) {
      return { ok: true, status: res.status };
    }
    return { ok: false, error: "Response is not valid RSS/Atom XML" };
  } catch (error) {
    clearTimeout(timeout);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  console.log("\n=== Source Health Check ===\n");

  const disabledSources = SOURCE_REGISTRY.filter((s) => !s.enabled && s.url);
  const enabledRss = SOURCE_REGISTRY.filter((s) => s.enabled && s.type === "rss" && s.url);

  console.log("--- Disabled Sources (checking if they work now) ---\n");
  for (const source of disabledSources) {
    const result = await checkFeed(source.url!);
    const status = result.ok ? "NOW WORKING" : `still broken (${result.error ?? result.status})`;
    console.log(`  ${result.ok ? "✓" : "✗"} ${source.name}: ${status}`);
  }

  console.log("\n--- Enabled RSS Sources (verifying health) ---\n");
  for (const source of enabledRss) {
    const result = await checkFeed(source.url!);
    const status = result.ok ? "healthy" : `BROKEN (${result.error ?? result.status})`;
    console.log(`  ${result.ok ? "✓" : "✗"} ${source.name}: ${status}`);
  }

  console.log("\n=== Done ===\n");
}

main().catch(console.error);
