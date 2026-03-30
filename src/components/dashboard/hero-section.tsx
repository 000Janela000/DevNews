"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { CATEGORY_BADGE_COLORS } from "./category-tabs";
import type { ItemRow } from "@/lib/db";

function getSourceLabel(source: string): string {
  if (source.startsWith("github-release:")) return source.replace("github-release:", "") + " Release";
  if (source.startsWith("reddit:")) return "r/" + source.replace("reddit:", "");
  const labels: Record<string, string> = {
    "rss:anthropic": "Anthropic", "rss:openai": "OpenAI", "rss:deepmind": "DeepMind",
    "rss:huggingface": "HF", "rss:vercel": "Vercel", "rss:the-decoder": "The Decoder",
    hackernews: "HN", github: "GitHub", devto: "Dev.to",
  };
  return labels[source] ?? source.replace("rss:", "");
}

function getSourceColor(sourceType: string): string {
  const colors: Record<string, string> = {
    rss: "bg-blue-500/10 text-blue-400",
    hackernews: "bg-orange-500/10 text-orange-400",
    reddit: "bg-orange-600/10 text-orange-300",
    github: "bg-gray-500/10 text-gray-300",
    arxiv: "bg-red-500/10 text-red-400",
  };
  return colors[sourceType] ?? "bg-muted text-muted-foreground";
}

interface HeroSectionProps {
  items: ItemRow[];
}

export function HeroSection({ items }: HeroSectionProps) {
  const topItems = [...items]
    .sort((a, b) => {
      const scoreDiff = (b.significanceScore ?? 0) - (a.significanceScore ?? 0);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 5);

  if (topItems.length === 0) return null;

  const [featured, ...rest] = topItems;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Top Stories</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Featured Card */}
        <Link
          href={`/item/${featured.id}`}
          className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/50"
          aria-label={featured.title}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className={`rounded-full border-0 px-2 py-0.5 text-[10px] ${CATEGORY_BADGE_COLORS[featured.category as Category]}`}>
              {CATEGORY_LABELS[featured.category as Category]}
            </Badge>
            <Badge className={`rounded-full border-0 px-2 py-0.5 text-[10px] ${getSourceColor(featured.sourceType)}`}>
              {getSourceLabel(featured.source)}
            </Badge>
            {featured.importance && featured.importance >= 4 && (
              <Badge className="rounded-full border-0 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                High Impact
              </Badge>
            )}
          </div>
          <h3 className="mb-2 text-[15px] font-medium leading-snug tracking-tight">
            {featured.title}
          </h3>
          {featured.summary && (
            <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
              {featured.summary}
            </p>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(featured.publishedAt), { addSuffix: true })}
          </p>
          <ExternalLink className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        {/* Secondary Cards */}
        <div className="grid gap-2">
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              className="group relative flex items-start justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:border-muted-foreground/50"
              aria-label={item.title}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge className={`rounded-full border-0 px-1.5 py-0.5 text-[10px] ${getSourceColor(item.sourceType)}`}>
                    {getSourceLabel(item.source)}
                  </Badge>
                  {item.importance && item.importance >= 4 && (
                    <Badge className="rounded-full border-0 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">
                      High Impact
                    </Badge>
                  )}
                </div>
                <h3 className="line-clamp-2 pr-6 text-[13px] font-medium leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                </p>
              </div>
              <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
