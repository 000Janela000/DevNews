import { sql, desc, and, eq, gte, lte, or, ilike } from "drizzle-orm";
import { getDb } from "./client";
import { items, userState } from "./schema";

export async function getItemsByDateRange(start: Date, end: Date) {
  const db = getDb();
  return db
    .select()
    .from(items)
    .where(and(gte(items.publishedAt, start), lte(items.publishedAt, end)))
    .orderBy(desc(items.publishedAt));
}

export async function getItemsBySource(source: string, limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(items)
    .where(eq(items.source, source))
    .orderBy(desc(items.publishedAt))
    .limit(limit);
}

export async function searchItems(query: string, limit = 50) {
  const db = getDb();
  const pattern = `%${query}%`;
  return db
    .select()
    .from(items)
    .where(or(ilike(items.title, pattern), ilike(items.content, pattern)))
    .orderBy(desc(items.publishedAt))
    .limit(limit);
}

export async function getUnsummarizedItems(limit = 50) {
  const db = getDb();
  // Priority: RSS official blogs > GitHub releases > HN > Reddit > DevTo > GitHub search > ArXiv
  return db
    .select()
    .from(items)
    .where(sql`${items.summary} IS NULL`)
    .orderBy(
      sql`CASE ${items.sourceType}
        WHEN 'rss' THEN 1
        WHEN 'github' THEN 2
        WHEN 'hackernews' THEN 3
        WHEN 'reddit' THEN 4
        WHEN 'arxiv' THEN 5
        ELSE 3
      END`,
      desc(items.publishedAt)
    )
    .limit(limit);
}

export async function getRecentItems(limit = 20, maxAgeHours = 48) {
  const db = getDb();
  const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  return db
    .select()
    .from(items)
    .where(gte(items.publishedAt, cutoff))
    .orderBy(
      sql`${items.significanceScore} DESC NULLS LAST`,
      desc(items.publishedAt)
    )
    .limit(limit);
}

export async function getTrendingItems(limit = 10) {
  const db = getDb();
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  return db
    .select()
    .from(items)
    .where(gte(items.publishedAt, twoDaysAgo))
    .orderBy(
      sql`${items.significanceScore} DESC NULLS LAST`,
      desc(items.publishedAt)
    )
    .limit(limit);
}

export async function getWeeklyTopItems(limit = 30) {
  const db = getDb();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return db
    .select()
    .from(items)
    .where(gte(items.publishedAt, oneWeekAgo))
    .orderBy(
      sql`${items.significanceScore} DESC NULLS LAST`,
      desc(items.publishedAt)
    )
    .limit(limit);
}

export async function getWeeklyCountsByCategory() {
  const db = getDb();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return db
    .select({
      category: items.category,
      count: sql<number>`count(*)::int`,
    })
    .from(items)
    .where(gte(items.publishedAt, oneWeekAgo))
    .groupBy(items.category);
}

export async function getItemById(id: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .limit(1);
  return result[0] ?? null;
}

/**
 * Returns titles + normalized URLs for items published in the last N hours.
 * Used by the fetch pipeline to dedup new items against recent DB entries
 * (catches the same story re-posted in a later fetch cycle).
 */
export async function getRecentTitles(hoursAgo = 72) {
  const db = getDb();
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return db
    .select({
      title: items.title,
      urlNormalized: items.urlNormalized,
    })
    .from(items)
    .where(gte(items.publishedAt, cutoff));
}

export async function getItemCounts() {
  const db = getDb();
  const result = await db
    .select({
      category: items.category,
      count: sql<number>`count(*)::int`,
    })
    .from(items)
    .groupBy(items.category);
  return result;
}

export async function getRecentItemsExcludingRead(
  userId: string,
  limit = 200,
  maxAgeHours = 48
) {
  const db = getDb();
  const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  return db
    .select()
    .from(items)
    .where(
      and(
        gte(items.publishedAt, cutoff),
        sql`NOT EXISTS (
          SELECT 1 FROM ${userState}
          WHERE ${userState.userId} = ${userId}
          AND ${userState.itemId} = ${items.id}
          AND ${userState.action} = 'read'
        )`
      )
    )
    .orderBy(
      sql`${items.significanceScore} DESC NULLS LAST`,
      desc(items.publishedAt)
    )
    .limit(limit);
}
