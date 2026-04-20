import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { type Category } from "@/lib/types";
import { getUser } from "@/lib/supabase/user";
import { getUserItemsByAction } from "@/lib/db/user-state";

export const dynamic = "force-dynamic";

const CATEGORY_COLOR: Record<Category, string> = {
  models_releases: "bg-[var(--cat-models)]",
  tools_frameworks: "bg-[var(--cat-tools)]",
  practices_approaches: "bg-[var(--cat-practices)]",
  industry_trends: "bg-[var(--cat-industry)]",
  research_papers: "bg-[var(--cat-research)]",
};

export default async function ReadLaterPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/read-later");

  const items = await getUserItemsByAction(user.id, "read_later");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-24">
        <div className="meta flex items-center justify-between pb-2">
          <span>Read later</span>
          <span className="font-mono tabular">
            {items.length} item{items.length === 1 ? "" : "s"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Queue is empty. Use the clock icon on any article.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="relative py-4 first:pt-0 last:pb-0"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-0 top-4 z-10 inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
                  aria-label={`Open original: ${item.title}`}
                >
                  original
                  <ExternalLink className="size-3" strokeWidth={1.5} />
                </a>
                <Link
                  href={`/item/${item.id}`}
                  className="block pr-20"
                  aria-label={item.title}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className={`mt-[9px] inline-block size-[6px] shrink-0 rounded-full ${CATEGORY_COLOR[item.category as Category]}`}
                    />
                    <h2 className="flex-1 text-[17px] font-semibold leading-[1.35] text-foreground">
                      {item.title}
                    </h2>
                  </div>

                  {item.summary ? (
                    <p className="mt-1.5 line-clamp-2 pl-[14px] text-[14px] leading-[1.55] text-foreground/75">
                      {item.summary}
                    </p>
                  ) : null}

                  <div className="meta mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 pl-[14px]">
                    <span>
                      {item.source
                        .replace("rss:", "")
                        .replace("github-release:", "")}
                    </span>
                    <span aria-hidden>·</span>
                    <time
                      dateTime={new Date(item.actionDate).toISOString()}
                      className="font-mono tabular"
                    >
                      added{" "}
                      {formatDistanceToNow(new Date(item.actionDate), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
