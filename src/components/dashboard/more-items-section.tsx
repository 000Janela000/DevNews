"use client";

import { ChevronDown } from "lucide-react";
import { ItemList } from "./item-list";
import type { ItemRow } from "@/lib/db";

interface MoreItemsSectionProps {
  items: ItemRow[];
}

export function MoreItemsSection({ items }: MoreItemsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 border-t border-border pt-6">
        <ChevronDown className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">
          More Items
        </h2>
        <span className="text-xs text-muted-foreground/50">
          {items.length} items
        </span>
      </div>

      <ItemList items={items} />
    </section>
  );
}
