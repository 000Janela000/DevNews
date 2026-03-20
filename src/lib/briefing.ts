import type { ItemRow } from "@/lib/db";
import { estimateReadingTime, BRIEFING_BUDGET_MINUTES } from "./reading-time";

export interface BriefingResult {
  briefingItems: (ItemRow & { readingTimeMin: number })[];
  remainingItems: ItemRow[];
  totalMinutes: number;
}

/**
 * Select top-scored items with summaries that fit within the reading time budget.
 * Items are assumed to already be sorted by significance score (desc).
 */
export function selectBriefingItems(items: ItemRow[]): BriefingResult {
  const briefingItems: (ItemRow & { readingTimeMin: number })[] = [];
  const remainingItems: ItemRow[] = [];
  let totalMinutes = 0;
  let budgetFilled = false;

  for (const item of items) {
    if (budgetFilled || !item.summary) {
      remainingItems.push(item);
      continue;
    }

    const readingTimeMin = estimateReadingTime(item.summary);

    if (totalMinutes + readingTimeMin <= BRIEFING_BUDGET_MINUTES) {
      briefingItems.push({ ...item, readingTimeMin });
      totalMinutes += readingTimeMin;
    } else {
      budgetFilled = true;
      remainingItems.push(item);
    }
  }

  return { briefingItems, remainingItems, totalMinutes };
}
