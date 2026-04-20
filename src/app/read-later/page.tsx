import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Masthead } from "@/components/masthead";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
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
      <Masthead section="read-later" />

      <main className="mx-auto max-w-3xl px-4 pb-32">
        <div className="smallcaps mb-1 flex items-baseline justify-between text-muted-foreground">
          <span>Your reading queue</span>
          <span className="font-mono tabular">{items.length} items</span>
        </div>

        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
          Articles waiting for a longer read.
        </h2>

        <div className="mt-2 h-px w-full bg-border" />

        {items.length === 0 ? (
          <div className="py-24 text-center font-serif italic text-muted-foreground">
            Your queue is empty — tap the clock icon on any article to park it
            here.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="py-6 first:pt-0 last:pb-0">
                <Link href={`/item/${item.id}`} className="block">
                  <div className="smallcaps flex flex-wrap items-center gap-x-2.5 gap-y-1 text-muted-foreground">
                    <span
                      aria-hidden
                      className={`inline-block size-[7px] rounded-full ${
                        CATEGORY_COLOR[item.category as Category]
                      }`}
                    />
                    <span>
                      {
                        CATEGORY_LABELS[item.category as Category]?.split(
                          " "
                        )[0]
                      }
                    </span>
                    <span aria-hidden>·</span>
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
                      Added{" "}
                      {formatDistanceToNow(new Date(item.actionDate), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>

                  <h3 className="mt-2 font-serif text-[21px] font-medium leading-[1.2] tracking-tight text-foreground">
                    {item.title}
                  </h3>

                  {item.summary ? (
                    <p className="prose-body mt-2 text-[15px] text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}
                </Link>

                <div className="mt-3 flex items-center justify-between">
                  <span className="smallcaps text-muted-foreground">
                    Originally published{" "}
                    <span className="font-mono tabular">
                      {format(new Date(item.publishedAt), "MMM d, yyyy")}
                    </span>
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="smallcaps inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Original
                    <ExternalLink className="size-3" strokeWidth={1.5} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
