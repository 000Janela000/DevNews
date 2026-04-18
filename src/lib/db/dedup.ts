import normalizeUrl from "normalize-url";
import type { NewTrackedItem } from "@/lib/types";

export function normalizeItemUrl(url: string): string {
  try {
    return normalizeUrl(url, {
      stripProtocol: false,
      stripWWW: true,
      stripHash: true,
      removeQueryParameters: [
        /^utm_/i,
        "ref",
        "source",
        "fbclid",
        "gclid",
        "mc_cid",
        "mc_eid",
      ],
      removeTrailingSlash: true,
      sortQueryParameters: true,
    });
  } catch {
    // If normalize-url fails (invalid URL), return as-is
    return url;
  }
}

/** Tokenize a string into lowercase words (3+ chars) */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

/** Jaccard similarity between two sets */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersectionSize = 0;
  for (const item of a) {
    if (b.has(item)) intersectionSize++;
  }
  const unionSize = a.size + b.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

/** Check if two titles are similar enough to be considered duplicates */
export function isTitleDuplicate(
  title1: string,
  title2: string,
  threshold = 0.6
): boolean {
  return jaccardSimilarity(tokenize(title1), tokenize(title2)) > threshold;
}

export interface RecentTitle {
  title: string;
  urlNormalized: string;
}

/**
 * Deduplicate items by URL normalization and title similarity.
 *
 * `recentTitles` is an optional list of items already in the DB from the
 * last N hours. When provided, items whose title is ≥60% Jaccard-similar
 * to any recent DB title (and whose URL doesn't match — URL-match is
 * handled by upsertItems' onConflictDoUpdate) are dropped from the batch.
 * This catches the same story re-surfacing in a later fetch cycle via a
 * different source.
 */
export function deduplicateItems(
  items: NewTrackedItem[],
  recentTitles: RecentTitle[] = []
): {
  unique: NewTrackedItem[];
  duplicatesRemoved: number;
  crossCycleDuplicatesRemoved: number;
} {
  const seen = new Map<string, NewTrackedItem>();
  const titles: Array<{ normalized: string; title: string }> = [];
  const recentNormalizedUrls = new Set(
    recentTitles.map((r) => r.urlNormalized)
  );
  let duplicatesRemoved = 0;
  let crossCycleDuplicatesRemoved = 0;

  for (const item of items) {
    const normalized = normalizeItemUrl(item.url);
    const itemWithNorm = { ...item, urlNormalized: normalized };

    // Layer 1: URL dedup within batch
    if (seen.has(normalized)) {
      duplicatesRemoved++;
      const existing = seen.get(normalized)!;
      if ((item.content?.length ?? 0) > (existing.content?.length ?? 0)) {
        seen.set(normalized, itemWithNorm);
      }
      continue;
    }

    // Layer 2: Title similarity dedup within batch
    let isDup = false;
    for (const entry of titles) {
      if (isTitleDuplicate(item.title, entry.title)) {
        duplicatesRemoved++;
        isDup = true;
        const existing = seen.get(entry.normalized)!;
        if ((item.content?.length ?? 0) > (existing.content?.length ?? 0)) {
          seen.delete(entry.normalized);
          seen.set(normalized, itemWithNorm);
          entry.normalized = normalized;
          entry.title = item.title;
        }
        break;
      }
    }
    if (isDup) continue;

    // Layer 3: Cross-cycle title similarity against recent DB items.
    // Skip this check when URL matches — upsertItems handles that case.
    if (!recentNormalizedUrls.has(normalized)) {
      const matchesRecent = recentTitles.some((r) =>
        isTitleDuplicate(item.title, r.title)
      );
      if (matchesRecent) {
        crossCycleDuplicatesRemoved++;
        continue;
      }
    }

    seen.set(normalized, itemWithNorm);
    titles.push({ normalized, title: item.title });
  }

  return {
    unique: Array.from(seen.values()),
    duplicatesRemoved,
    crossCycleDuplicatesRemoved,
  };
}
