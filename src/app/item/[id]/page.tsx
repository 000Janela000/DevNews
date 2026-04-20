import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ItemActions } from "@/components/dashboard/item-actions";
import { Header } from "@/components/dashboard/header";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { getItemById, getItemsByDateRange } from "@/lib/db/queries";
import { clusterItems } from "@/lib/clustering";
import { stripHtml, isContentTruncated } from "@/lib/html";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_COLOR: Record<Category, string> = {
  models_releases: "bg-[var(--cat-models)]",
  tools_frameworks: "bg-[var(--cat-tools)]",
  practices_approaches: "bg-[var(--cat-practices)]",
  industry_trends: "bg-[var(--cat-industry)]",
  research_papers: "bg-[var(--cat-research)]",
};

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: Awaited<ReturnType<typeof getItemById>>;
  let clusterSources: Awaited<ReturnType<typeof getItemById>>[] = [];

  try {
    item = await getItemById(id);
    if (!item) notFound();

    const dayBefore = new Date(
      new Date(item.publishedAt).getTime() - 24 * 60 * 60 * 1000
    );
    const dayAfter = new Date(
      new Date(item.publishedAt).getTime() + 24 * 60 * 60 * 1000
    );
    const nearby = await getItemsByDateRange(dayBefore, dayAfter);
    const clustered = clusterItems(nearby);
    const myCluster = clustered.find((c) => c.clusterItemIds.includes(id));
    if (myCluster && myCluster.clusterSize > 1) {
      const otherIds = myCluster.clusterItemIds.filter((cid) => cid !== id);
      const others = await Promise.all(otherIds.map((cid) => getItemById(cid)));
      clusterSources = others.filter(Boolean) as NonNullable<typeof item>[];
    }
  } catch {
    notFound();
  }

  const metadata = (item.metadata ?? {}) as Record<string, unknown>;
  const hnUrl = metadata.hnUrl as string | undefined;
  const pdfUrl = metadata.pdfUrl as string | undefined;
  const sourceLabel = item.source
    .replace("rss:", "")
    .replace("github-release:", "");
  const contentText = item.content ? stripHtml(item.content, 10000) : "";
  const truncated = item.content ? isContentTruncated(item.content) : false;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 pt-8 pb-24">
        <Link
          href="/dashboard"
          className="meta inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <ArrowLeft className="size-3" strokeWidth={1.5} />
          Back
        </Link>

        <article className="mt-8">
          <div className="meta flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              aria-hidden
              className={`inline-block size-[6px] rounded-full ${CATEGORY_COLOR[item.category as Category]}`}
            />
            <span>{CATEGORY_LABELS[item.category as Category]}</span>
            <span aria-hidden>·</span>
            <span>{sourceLabel}</span>
            <span aria-hidden>·</span>
            <time
              dateTime={new Date(item.publishedAt).toISOString()}
              className="font-mono tabular"
            >
              {format(new Date(item.publishedAt), "MMM d, yyyy")}
            </time>
            {item.importance && item.importance >= 4 ? (
              <>
                <span aria-hidden>·</span>
                <span className="text-accent">high impact</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-3 text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-foreground">
            {item.title}
          </h1>

          {item.summary ? (
            <p className="prose-body mt-5 text-[16px] text-foreground/85">
              {item.summary}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-border py-3">
            <ItemActions itemId={item.id} compact={false} />
            <div className="ml-auto flex items-center gap-3 text-[12px]">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                Original
                <ExternalLink className="size-3" strokeWidth={1.5} />
              </a>
              {hnUrl ? (
                <a
                  href={hnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent"
                >
                  HN
                </a>
              ) : null}
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent"
                >
                  PDF
                </a>
              ) : null}
            </div>
          </div>

          {contentText ? (
            <div className="prose-body mt-8 whitespace-pre-wrap text-[15px] text-foreground/90">
              {contentText}
            </div>
          ) : null}

          {truncated ? (
            <p className="mt-5 text-[13px] text-muted-foreground">
              Truncated — open original for the full article.
            </p>
          ) : null}

          {item.tags && item.tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-1.5 border-t border-border pt-5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {clusterSources.length > 0 ? (
            <aside className="mt-10 border-t border-border pt-5">
              <div className="meta text-accent">
                also covered by {clusterSources.length} other source
                {clusterSources.length > 1 ? "s" : ""}
              </div>
              <ul className="mt-3 space-y-3">
                {clusterSources.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 py-1.5 hover:text-accent"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] leading-snug">{s.title}</p>
                        <p className="meta mt-0.5">
                          {s.source
                            .replace("rss:", "")
                            .replace("github-release:", "")}
                          {" · "}
                          <span className="font-mono tabular">
                            {formatDistanceToNow(new Date(s.publishedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </p>
                      </div>
                      <ExternalLink
                        className="size-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-accent"
                        strokeWidth={1.5}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </article>
      </main>
    </div>
  );
}
