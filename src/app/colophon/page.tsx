import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/dashboard/header";

export const metadata = {
  title: "Colophon",
  description: "Design and engineering notes for DevNews.",
};

export default function ColophonPage() {
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
          <div className="meta">Notes</div>

          <h1 className="mt-1 text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-foreground">
            Colophon
          </h1>

          <p className="prose-body mt-5 text-[16px] text-foreground/85">
            DevNews is a daily briefing of AI developments for people who
            build software. The UI is designed to fade into the background so
            the content can carry the weight.
          </p>

          <Section heading="Type">
            <p>
              One family for everything readable: <strong>Inter</strong>, at
              body size 15px with a 1.55 line-height. <strong>Geist Mono</strong>{" "}
              handles timestamps, counts, and code fragments — with tabular
              numerals enforced, so numbers never jitter when values change.
            </p>
            <p>
              An earlier version of this site ran a variable serif (Fraunces)
              for titles and body. It looked distinctive, but turned the feed
              into a performance. Sans-serif is plainer and, in practice,
              easier to scan through twenty items at a glance.
            </p>
          </Section>

          <Section heading="Color">
            <p>
              Light default: a soft warm cream, not pure white — white halates
              under extended reading. Foreground is a warm near-black, not
              black. Muted text is a grey-brown warm enough to read for more
              than a minute at a time.
            </p>
            <p>
              Dark theme is a soft graphite with a slight cool cast, also not
              pure black. The accent is a dusty blue, used only for focus
              rings and the occasional importance marker — no fields of
              saturated colour anywhere.
            </p>
          </Section>

          <Section heading="Layout">
            <p>
              A single header band holds the wordmark, the date, the section
              tabs, and the small utility buttons. The feed starts
              immediately under it — no masthead, no hero section, no
              editorial flourishes. Content density takes priority over
              ceremony.
            </p>
            <p>
              Reading columns cap at ~64 characters in the default body size
              and a little wider on detail pages. Spacing follows a 4px
              baseline grid.
            </p>
          </Section>

          <Section heading="Keyboard">
            <p>
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                ⌘ k
              </kbd>{" "}
              opens a command palette that searches every article and lets you
              jump anywhere.{" "}
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                ?
              </kbd>{" "}
              lists every shortcut.{" "}
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                g
              </kbd>{" "}
              primes a two-letter chord —{" "}
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                g d
              </kbd>{" "}
              jumps to today,{" "}
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                g w
              </kbd>{" "}
              to the weekly view.{" "}
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                j
              </kbd>{" "}
              and{" "}
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[11px]">
                k
              </kbd>{" "}
              step through the feed.
            </p>
          </Section>

          <Section heading="The pipeline behind the page">
            <p>
              Every six hours a job fetches RSS and API sources (Anthropic,
              OpenAI, DeepMind, HuggingFace, Vercel, Cursor, HackerNews,
              dev.to, a curated set of GitHub releases), normalises and
              deduplicates them across a 72-hour window, and stores what
              survives in Postgres.
            </p>
            <p>
              An LLM then writes one- or two-sentence summaries against a
              strict prompt that bans generic phrases — things like
              &ldquo;valuable resource&rdquo; or &ldquo;no immediate action
              required&rdquo;. A post-generation filter drops anything that
              slips through. The summary must name a concrete entity and a
              concrete change, or the item is marked off-topic and excluded
              from the briefing.
            </p>
            <p>
              Three providers share the load: Groq (Llama 3.3 70B), Cerebras
              (Qwen3 235B), and Gemini as a final fallback. A silent-failure
              detector flags any source that returns zero items for five
              consecutive runs.
            </p>
          </Section>

          <Section heading="Stack">
            <ul className="space-y-1.5 text-[14px]">
              <StackItem label="Framework" value="Next.js 16, React 19" />
              <StackItem label="Styling" value="Tailwind CSS v4" />
              <StackItem label="UI" value="cmdk, sonner, lucide-react" />
              <StackItem label="Theme" value="next-themes" />
              <StackItem label="Database" value="Supabase Postgres (pooled)" />
              <StackItem label="ORM" value="Drizzle" />
              <StackItem label="LLM" value="Groq · Cerebras · Gemini" />
              <StackItem label="Schedule" value="GitHub Actions cron" />
              <StackItem label="Host" value="Vercel" />
            </ul>
          </Section>
        </article>
      </main>
    </div>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="meta text-foreground">{heading}</h2>
      <div className="prose-body mt-3 space-y-3 text-[14.5px] leading-[1.6] text-foreground/85">
        {children}
      </div>
    </section>
  );
}

function StackItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="meta shrink-0 basis-24">{label}</span>
      <span className="text-foreground">{value}</span>
    </li>
  );
}
