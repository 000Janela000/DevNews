import { sql } from "drizzle-orm";
import { nanoid } from "@/lib/id";
import { getDb } from "@/lib/db/client";
import { repoCandidates } from "@/lib/db/schema";
import { RELEASE_WATCHLIST } from "@/lib/sources/github-releases";

const PROMOTION_THRESHOLD = 3; // Appear 3+ times → auto-promote

/** Restore previously promoted candidates to the runtime watchlist */
export async function restorePromotedCandidates(): Promise<string[]> {
  const db = getDb();
  const promoted = await db
    .select({ repoName: repoCandidates.repoName })
    .from(repoCandidates)
    .where(sql`${repoCandidates.promoted} = 1`);

  const restored: string[] = [];
  for (const { repoName } of promoted) {
    if (!RELEASE_WATCHLIST.includes(repoName)) {
      RELEASE_WATCHLIST.push(repoName);
      restored.push(repoName);
    }
  }
  return restored;
}

/** Track a repo as a candidate for the release watchlist */
export async function trackCandidate(
  repoUrl: string,
  repoName: string
): Promise<void> {
  // Skip if already on the watchlist
  if (RELEASE_WATCHLIST.includes(repoName)) return;

  const db = getDb();

  // Try to increment existing candidate
  const existing = await db
    .select()
    .from(repoCandidates)
    .where(sql`${repoCandidates.repoName} = ${repoName}`)
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(repoCandidates)
      .set({
        timesSeen: sql`${repoCandidates.timesSeen} + 1`,
        lastSeen: sql`now()`,
      })
      .where(sql`${repoCandidates.id} = ${existing[0].id}`);
  } else {
    await db.insert(repoCandidates).values({
      id: nanoid(),
      repoUrl,
      repoName,
      timesSeen: 1,
    });
  }
}

/** Check for candidates ready to be promoted to the watchlist */
export async function promoteEligibleCandidates(): Promise<string[]> {
  const db = getDb();

  const eligible = await db
    .select()
    .from(repoCandidates)
    .where(
      sql`${repoCandidates.timesSeen} >= ${PROMOTION_THRESHOLD} AND ${repoCandidates.promoted} = 0`
    );

  const promoted: string[] = [];

  for (const candidate of eligible) {
    // Add to watchlist (runtime only — won't persist across deploys,
    // but the candidate table tracks promotion status)
    if (!RELEASE_WATCHLIST.includes(candidate.repoName)) {
      RELEASE_WATCHLIST.push(candidate.repoName);
    }

    await db
      .update(repoCandidates)
      .set({
        promoted: 1,
        promotedAt: sql`now()`,
      })
      .where(sql`${repoCandidates.id} = ${candidate.id}`);

    promoted.push(candidate.repoName);
    console.log(
      `[Discovery] Promoted ${candidate.repoName} to release watchlist (seen ${candidate.timesSeen} times)`
    );
  }

  return promoted;
}
