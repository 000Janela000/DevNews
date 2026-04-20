"use client";

import { TrackedItemCard } from "./tracked-item-card";
import type { ItemRow } from "@/lib/db";
import type { Category } from "@/lib/types";
import type { UserAction } from "@/lib/db/user-state";
import { useUserStates } from "@/hooks/use-user-states";
import { useMemo } from "react";

interface BriefingItem extends ItemRow {
  readingTimeMin: number;
}

interface BriefingSectionProps {
  items: BriefingItem[];
  totalMinutes: number;
}

export function BriefingSection({ items, totalMinutes }: BriefingSectionProps) {
  const itemIds = useMemo(() => items.map((i) => i.id), [items]);
  const { states: userStates } = useUserStates(itemIds);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No new items right now.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-4">
      <div className="meta flex items-center justify-between pb-2">
        <span>
          {items.length} item{items.length === 1 ? "" : "s"} · ~{totalMinutes}{" "}
          min
        </span>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => (
          <TrackedItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            summary={item.summary}
            source={item.source}
            category={item.category as Category}
            url={item.url}
            publishedAt={item.publishedAt}
            importance={item.importance}
            readingTimeMin={item.readingTimeMin}
            clusterSize={
              "clusterSize" in item ? (item.clusterSize as number) : undefined
            }
            userStates={userStates[item.id] as UserAction[] | undefined}
          />
        ))}
      </div>
    </section>
  );
}
