import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/dashboard/header";

export const metadata = {
  title: "Colophon",
  description: "The design and engineering decisions behind DevNews.",
};

export default function ColophonPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pt-10 pb-32 sm:pt-16">
        <Link
          href="/dashboard"
          className="smallcaps inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" strokeWidth={1.5} />
          Back to briefing
        </Link>

        <article className="mt-10 sm:mt-12">
          <div className="smallcaps text-muted-foreground">
            About · Design &amp; engineering notes
          </div>

          <h1 className="display mt-3 font-serif text-3xl font-medium text-foreground sm:text-[52px]">
            Colophon
          </h1>

          <p className="prose-body mt-6 font-serif text-lg italic leading-[1.5] text-muted-foreground">
            DevNews is a daily briefing of AI developments for people who
            build software. The design treats the product as an edition, not
            a dashboard — because the work of an engineer is reading, and
            reading deserves typography.
          </p>

          <div className="mt-10 h-px w-full bg-border" />

          <Section heading="Typography">
            <p>
              The reading surface is set in{" "}
              <a
                href="https://fonts.google.com/specimen/Fraunces"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Fraunces
              </a>
              , a variable serif by Phaedra Charles, Flavia Zimbardi, and
              Undercase Type. Its <code className="font-mono">opsz</code> axis
              is tuned to 12 for body copy and 144 for display headlines —
              actual optical-sizing, not a cosmetic scale. Headings also pick
              up the <code className="font-mono">SOFT</code> and{" "}
              <code className="font-mono">WONK</code> axes for character.
            </p>
            <p>
              Metadata, timestamps, and source labels are set in{" "}
              <a
                href="https://vercel.com/font"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Geist Mono
              </a>{" "}
              with tabular numerals enforced, so counters never jitter when
              values change. Labels use small caps with a 0.14em tracking —
              the typographic equivalent of a kicker above a story.
            </p>
            <p>
              Text wrapping leans on newer CSS:{" "}
              <code className="font-mono">text-wrap: balance</code> prevents
              awkward widows on every heading,{" "}
              <code className="font-mono">text-wrap: pretty</code> tightens
              paragraph bottoms, and{" "}
              <code className="font-mono">hanging-punctuation: first last</code>{" "}
              lets quotes and opening characters sit in the margin — a detail
              almost no site bothers with.
            </p>
          </Section>

          <Section heading="Color">
            <p>
              The default theme is a warm paper —{" "}
              <code className="font-mono">oklch(0.985 0.005 85)</code> — not
              pure white, because white halates under extended reading.
              Contrast is tuned to APCA Lc 75+ on body copy, which exceeds
              WCAG AAA while actually holding up to the{" "}
              <a
                href="https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                APCA
              </a>{" "}
              perceptual standard.
            </p>
            <p>
              The dark theme is graphite with a slight cool cast — also not
              pure black, for the same halation reason. The accent is
              terracotta in light, amber in dark. Neither is the reflexive
              blue of every template.
            </p>
            <p>
              Category indicators (models, tools, practices, industry,
              research) are each a distinct hue held at the same{" "}
              <code className="font-mono">oklch</code> lightness so no single
              category visually dominates the briefing.
            </p>
          </Section>

          <Section heading="Layout">
            <p>
              The dashboard opens with a publication masthead: date, issue
              number (day-of-year, auto-incrementing), wordmark, and a
              kicker. The thin-and-double rule below it is the convention
              every printed newspaper uses to separate nameplate from
              contents. The editorial frame was the intent.
            </p>
            <p>
              Reading columns are capped at 66 characters in Fraunces at
              body size — the midpoint of the range{" "}
              <a
                href="https://baymard.com/blog/line-length-readability"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Baymard
              </a>{" "}
              recommends for sustained reading. The article detail view is a
              single column with a drop-cap on the first letter.
            </p>
            <p>
              Every spacing value resolves to a multiple of 4px.
              Typographic sizes follow a 1.25 (major-third) modular scale
              anchored at 17px: <span className="tabular">11 · 13 · 15 · 17 · 21 · 26 · 33 · 42 · 52 · 65</span>. No
              magic pixel numbers.
            </p>
          </Section>

          <Section heading="Motion">
            <p>
              Page transitions use the browser-native View Transitions API —
              no animation library, no bundle cost. Chromium and Safari
              get a 180ms fade-and-lift; Firefox gets a clean cut. The
              sticky header is transparent at the top of the page and fades
              in as you scroll, driven by CSS{" "}
              <code className="font-mono">animation-timeline: scroll()</code>{" "}
              — again, no JavaScript.
            </p>
            <p>
              Interaction timings run on Linear&apos;s motion curve —{" "}
              <code className="font-mono">cubic-bezier(0.2, 0, 0, 1)</code> —
              which reads as snappier than the default ease. Everything
              respects{" "}
              <code className="font-mono">prefers-reduced-motion</code> and
              collapses to instant on first match.
            </p>
          </Section>

          <Section heading="Keyboard">
            <p>
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                ⌘ K
              </kbd>{" "}
              opens a command palette (cmdk): fuzzy search across every
              article in the feed, plus navigation and actions. Typing two
              characters debounces a search against the database.
            </p>
            <p>
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                ?
              </kbd>{" "}
              reveals every shortcut.{" "}
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                G
              </kbd>{" "}
              primes a Gmail-style chord for section jumps —{" "}
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                G D
              </kbd>{" "}
              to dashboard,{" "}
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                G W
              </kbd>{" "}
              to weekly digest, and so on.{" "}
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                J
              </kbd>{" "}
              and{" "}
              <kbd className="smallcaps rounded-sm border border-border px-1.5 py-0.5">
                K
              </kbd>{" "}
              advance through the feed one article at a time, Superhuman
              style.
            </p>
          </Section>

          <Section heading="The pipeline behind the page">
            <p>
              Every six hours a scheduled job fetches RSS and API sources
              (Anthropic, OpenAI, DeepMind, HuggingFace, Vercel, Cursor,
              HackerNews, dev.to, curated GitHub releases), normalises and
              deduplicates them across a 72-hour title-similarity window,
              and stores the survivors in Postgres.
            </p>
            <p>
              An LLM layer then writes one-or-two-sentence summaries
              against a strict prompt that bans virtue phrases like{" "}
              <em>&ldquo;valuable resource&rdquo;</em> or{" "}
              <em>&ldquo;no immediate action required&rdquo;</em>. A
              post-generation regex filter drops any output that slips through
              anyway — the summary must name a concrete entity and a concrete
              change or the item is marked off-topic.
            </p>
            <p>
              Three independent inference providers carry the summarisation
              load: Groq (Llama 3.3 70B), Cerebras (Qwen3 235B MoE), and
              Gemini 2.5 Flash as last-resort fallback. A silent-failure
              detector watches the fetch log and warns when a source has
              returned zero items for five consecutive runs.
            </p>
          </Section>

          <Section heading="Stack">
            <ul className="space-y-1.5 list-none pl-0">
              <StackItem label="Framework" value="Next.js 16 (App Router, React 19)" />
              <StackItem label="Styling" value="Tailwind CSS v4" />
              <StackItem label="UI primitives" value="@base-ui/react, cmdk, sonner, lucide-react" />
              <StackItem label="Theme" value="next-themes (class strategy, system-aware)" />
              <StackItem label="Database" value="Supabase Postgres (transaction pooler)" />
              <StackItem label="ORM" value="Drizzle ORM" />
              <StackItem label="Validation" value="Zod" />
              <StackItem label="LLM providers" value="Groq · Cerebras · Gemini" />
              <StackItem label="Scheduler" value="GitHub Actions cron" />
              <StackItem label="Hosting" value="Vercel (auto-deploy from main)" />
            </ul>
          </Section>

          <Section heading="References that shaped this">
            <p>
              <a
                href="https://stratechery.com"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Stratechery
              </a>{" "}
              for the single-column essay discipline.{" "}
              <a
                href="https://linear.app/now/how-we-redesigned-the-linear-ui"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Linear
              </a>{" "}
              for the keyboard-first contract.{" "}
              <a
                href="https://every.to"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Every
              </a>{" "}
              for the masthead.{" "}
              <a
                href="https://practicaltypography.com"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Butterick&apos;s Practical Typography
              </a>{" "}
              for most of the type rules.{" "}
              <a
                href="https://readwise.io/read"
                target="_blank"
                rel="noopener"
                className="underline decoration-border hover:decoration-accent"
              >
                Readwise Reader
              </a>{" "}
              for the reading-as-a-product mindset.
            </p>
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
    <section className="mt-12">
      <h2 className="smallcaps text-accent">{heading}</h2>
      <div className="prose-body mt-4 space-y-4 font-serif text-base leading-[1.65] text-foreground/90">
        {children}
      </div>
    </section>
  );
}

function StackItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="smallcaps shrink-0 basis-32 text-muted-foreground">
        {label}
      </span>
      <span className="text-foreground">{value}</span>
    </li>
  );
}
