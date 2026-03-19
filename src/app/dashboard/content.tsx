"use client";

import { ItemList } from "@/components/dashboard/item-list";
import type { ItemRow } from "@/lib/db";

interface DashboardContentProps {
  items: ItemRow[];
}

export function DashboardContent({ items }: DashboardContentProps) {
  return <ItemList items={items} />;
}
