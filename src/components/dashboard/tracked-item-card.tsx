"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { ItemActions } from "./item-actions";
import type { UserAction } from "@/lib/db/user-state";

const CATEGORY_COLOR: Record<Category, string> = {
  models_releases: "bg-[var(--cat-models)]",
  tools_frameworks: "bg-[var(--cat-tools)]",
  practices_approaches: "bg-[var(--cat-practices)]",
  industry_trends: "bg-[var(--cat-industry)]",
  research_papers: "bg-[var(--cat-research)]",
};

function getSourceLabel(source: string): string {
  if (source.startsWith("github-release:"))
    return source.replace("github-release:", "");
  if (source.startsWith("reddit:"))
    return "r/" + source.replace("reddit:", "");
  const labels: Record<string, string> = {
    "rss:anthropic": "Anthropic",
    "rss:anthropic-engineering": "Anthropic Eng",
    "rss:openai": "OpenAI",
    "rss:deepmind": "DeepMind",
    "rss:huggingface": "HuggingFace",
    "rss:vercel": "Vercel",
    "rss:cursor": "Cursor",
    "rss:the-decoder": "The Decoder",
    "rss:ai-news": "AI News",
    "rss:marktechpost": "MarkTechPost",
    "rss:venturebeat-ai": "VentureBeat",
    "rss:microsoft-research": "MSR",
    hackernews: "Hacker News",
    github: "GitHub",
    devto: "Dev.to",
  };
  return labels[source] ?? source.replace("rss:", "");
}

interface TrackedItemCardProps {
  id: string;
  title: string;
  summary?: string | null;
  source: string;
  category: Category;
  url: string;
  publishedAt: Date;
  importance?: number | null;
  readingTimeMin?: number;
  clusterSize?: number;
  userStates?: UserAction[];
}

export function TrackedItemCard({
  id,
  title,
  summary,
  source,
  category,
  url,
  publishedAt,
  importance,
  clusterSize,
  userStates,
}: TrackedItemCardProps) {
  const isHighImpact = importance != null && importance >= 4;

  return (
    <article className="group relative py-4 first:pt-0 last:pb-0">
      <Link
        href={`/item/${id}`}
        aria-label={title}
        className="block rounded-sm"
      >
        {/* Title first — the thing you're reading for */}
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            title={category}
            className={cn(
              "mt-[9px] inline-block size-[6px] shrink-0 rounded-full",
              CATEGORY_COLOR[category]
            )}
          />
          <h2 className="flex-1 text-[17px] font-semibold leading-[1.35] tracking-[-0.005em] text-foreground">
            {title}
            {isHighImpact ? (
              <span className="ml-2 inline-block align-middle text-[11px] font-medium text-accent">
                ★
              </span>
            ) : null}
          </h2>
        </div>

        {summary ? (
          <p className="mt-1.5 line-clamp-2 pl-[14px] text-[14px] leading-[1.55] text-foreground/75">
            {summary}
          </p>
        ) : null}

        <div className="meta mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 pl-[14px]">
          <span>{getSourceLabel(source)}</span>
          <span aria-hidden>·</span>
          <time
            dateTime={new Date(publishedAt).toISOString()}
            className="font-mono tabular"
          >
            {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
          </time>
          {clusterSize && clusterSize > 1 ? (
            <>
              <span aria-hidden>·</span>
              <span>{clusterSize} sources</span>
            </>
          ) : null}
        </div>
      </Link>

      {/* Actions — reveal on hover/focus, but always visible on touch */}
      <div
        className={cn(
          "absolute right-0 top-4 flex items-center gap-1 rounded-sm",
          "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
          "[@media(hover:none)]:opacity-100"
        )}
      >
        <ItemActions itemId={id} initialStates={userStates} compact />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Open original: ${title}`}
        >
          <ExternalLink className="size-3.5" strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}
