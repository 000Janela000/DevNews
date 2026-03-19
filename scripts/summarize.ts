/**
 * Summarization Script
 *
 * Fetches unsummarized items from the database and generates AI summaries.
 * Run with: npx tsx --tsconfig tsconfig.json scripts/summarize.ts
 */

import { getUnsummarizedItems, updateItemSummary } from "@/lib/db";
import { summarizeBatch } from "@/lib/summarizer";

const MAX_ITEMS = 50; // Stay within Gemini free tier limits per run

async function main() {
  console.log(`\n[Summarizer] Fetching up to ${MAX_ITEMS} unsummarized items...`);

  const items = await getUnsummarizedItems(MAX_ITEMS);
  if (items.length === 0) {
    console.log("[Summarizer] No unsummarized items found. Done.");
    return;
  }

  console.log(`[Summarizer] Found ${items.length} items to summarize.\n`);

  const stats = await summarizeBatch(
    items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      source: item.source,
      sourceType: item.sourceType,
    })),
    async (itemId, result) => {
      await updateItemSummary(
        itemId,
        result.summary,
        result.category,
        result.importance,
        result.tags
      );
    }
  );

  console.log(`\n[Summarizer] Complete:`);
  console.log(`  Processed: ${stats.processed}`);
  console.log(`  Succeeded: ${stats.succeeded}`);
  console.log(`  Failed: ${stats.failed}`);
}

main().catch((error) => {
  console.error("[Summarizer] Fatal error:", error);
  process.exit(1);
});
