# v0.dev Design Prompts — DevNews

## How to Use
1. Go to v0.dev → start a NEW chat
2. Paste the Context Message first
3. Paste each page prompt one at a time, in order
4. Use iteration prompts if results need adjustment
5. Use Design Mode (free) for visual tweaks
6. Download zip after each page for backup

## Context Message
```
I'm building "DevNews" — a real-time AI development news dashboard for software engineers. It's a Next.js 15 (App Router) app with shadcn/ui + Tailwind CSS v4 + lucide-react icons.

The app has these pages: Dashboard (main feed), Weekly Digest, Item Detail.

I'll give you each page one by one. Design them as a cohesive app — same theme, consistent components across all pages. Use a premium dark theme: near-black backgrounds (#0a0a0f base, #111118 cards), subtle blue-purple accent gradients for emphasis, soft borders (#1e1e2e), and crisp white/gray text hierarchy. Think Linear meets Bloomberg Terminal — information-dense but elegant, with clear visual hierarchy. The feel should be "professional developer tool" not "consumer news app". Dark mode only, no light variant.

Typography: Geist Sans for body, Geist Mono for code/metadata. Use tight letter-spacing on headings for a premium feel.

Ready? I'll start with the Dashboard — the main feed page.
```

## Page 1: Dashboard (generate first — establishes design language)
```
Design the main dashboard page for "DevNews" — an AI news aggregator for developers.

PRODUCT SURFACE

Layout:
- Full-width page, max-w-7xl centered, with a sticky top header bar
- Header: left-aligned logo (Activity icon from lucide + "DevNews" in semibold), right side has a "Weekly Digest" link with a Sparkles icon
- Below header: a stats ribbon showing 5 category counts in a horizontal row of compact stat cards (icon + number + label), plus a total count card on the left
- Below stats: a "Top Stories" hero section — 2-column grid on desktop. Left column: one featured large card (full summary visible, 3 lines). Right column: 4 compact cards stacked (title + source + time only)
- Below hero: filter bar, then the main feed

Filter Bar (critical — this is the primary interaction):
- Row 1: Category tabs — horizontally scrollable pills: "All", "Models & Releases" (Bot icon, blue), "Tools & Frameworks" (Wrench icon, emerald), "Practices" (Lightbulb icon, amber), "Industry" (TrendingUp icon, purple), "Research" (BookOpen icon, rose). Each tab shows an item count badge. Selected tab has primary background.
- Row 2 (flex, space-between):
  - Left group: Time filter ("Today" | "This Week" | "This Month" | "All Time") as compact text buttons + Scope filter ("Dev Focus" | "Dev + Industry" | "Everything") as a bordered toggle group with 11px text
  - Right: Search input with Search icon, 8px height, 256px width on desktop

Main Feed:
- Vertical list of item cards, 2px gap between cards
- Each card: rounded-lg border, bg-card, p-4, hover:border slightly brighter
  - Top row: category badge (colored, 10px text, rounded-full) + source badge (colored by source type) + optional "High Impact" yellow badge
  - Title: 14px font-medium, line-clamp-2, clickable (links to /item/[id])
  - Summary: 12px text-muted-foreground, line-clamp-2, max 200 chars, HTML stripped
  - Footer row: relative time ("2h ago") + optional star count (Star icon) + optional comment count (MessageSquare icon) + first 3 tags
  - Far right: ExternalLink icon, only visible on card hover (opacity-0 → opacity-100 transition)
- Bottom: "Showing X of Y items" muted center text

Empty State:
- Centered: Inbox icon (40px, very muted), "No items match your filters" text, subtext "Try adjusting category, time range, or search", all centered in a dashed-border rounded container with py-16

Loading State:
- 5 skeleton category pills at top
- 8 skeleton cards: each with 2 small skeleton pills (badges), one 75% width skeleton line (title), two 100% and 66% skeleton lines (summary), one 24-width skeleton (timestamp)

CONTEXT OF USE
- Used by software engineers, daily, on desktop (1440px+ primary). Mobile should work but desktop is primary.
- Users scan for 2-5 minutes to catch up on AI developments. Speed of scanning is critical.

CONSTRAINTS
- Dark mode only (class="dark" on html). Background: near-black (#0a0a0f or similar). Cards: slightly lighter (#111118). Borders: subtle (#1e1e2e).
- Accent colors: blue-500 for models, emerald-500 for tools, amber-500 for practices, purple-500 for industry, rose-500 for research. Use at 10% opacity for badge backgrounds.
- Responsive: 2-column hero grid on lg+, single column below. Stats ribbon: 6 columns on lg, 3 on sm, 2 on xs.
- Use shadcn/ui components: Badge, Button, Input, Skeleton, Card (but styled custom — just the rounded-lg border pattern)
- Use Tailwind CSS, lucide-react icons, Next.js "use client" where needed
- Accessibility: all interactive elements keyboard-focusable, sufficient contrast on muted text
- Touch targets: 44px minimum on mobile for filter buttons
- The cards should feel dense but breathable — not cramped, not spacious. Think Bloomberg Terminal density with Linear's polish.
```

## Page 2: Weekly Digest
```
Design the Weekly Digest page for "DevNews". Use the same header and theme from the Dashboard page.

PRODUCT SURFACE

Layout:
- Same sticky header as Dashboard
- Back link: "← Back to dashboard" in muted text below header
- Page title section: Sparkles icon (yellow-400) + "Weekly Digest" h1 (24px bold) + date range subtitle ("Mar 14 – Mar 20, 2026") with Calendar icon + total item count
- Below title: 5 compact stat cards in a row (one per category, matching Dashboard stat ribbon style)
- Main content: items grouped by category sections

Category Sections (5 sections, in order: Models, Tools, Practices, Industry, Research):
- Section header: category icon (muted) + uppercase category name (12px semibold tracking-wider muted) + count Badge
- Under each header: vertical list of item cards, compact format:
  - Each card: rounded-lg border bg-card p-3
  - Source badge + optional "High Impact" badge
  - Title (14px font-medium, clickable to /item/[id])
  - Summary text (12px muted, line-clamp-2) — only show if summary exists
  - Relative timestamp (11px very muted)
  - External link icon on hover (same pattern as Dashboard)
- 8px gap between sections

Empty State:
- "No items this week yet. Check back later." centered, muted

CONTEXT OF USE
- Users visit this once per week for a comprehensive summary
- Desktop primary, but should be readable on mobile (single column)
- This is the "catch-up" page — designed for 5-minute reading sessions

CONSTRAINTS
- Dark mode only, same theme as Dashboard
- Same category colors (blue, emerald, amber, purple, rose)
- Responsive: stat cards 5-column on lg, 2-column on mobile. Sections are always single-column.
- Use shadcn/ui Badge components, lucide-react icons
- Same typography and spacing system as Dashboard
- Max-w-4xl (narrower than Dashboard — focused reading experience)
```

## Page 3: Item Detail
```
Design the Item Detail page for "DevNews". Use the same header from Dashboard.

PRODUCT SURFACE

Layout:
- Same sticky header as Dashboard
- Back link: "← Back to dashboard" in muted text
- Max-w-4xl centered (narrower, reading-focused)

Content structure (top to bottom):
- Badge row: category badge (colored) + source badge + optional "High Impact" badge
- Title: h1, 24px bold, tight leading, tracking-tight
- Metadata row: Calendar icon + formatted date ("Mar 19, 2026") + relative time in parentheses ("2 days ago"), optional: Star icon + star count, MessageSquare icon + comment count, language tag
- Action buttons row: "Open Original" button (outline, sm, with ExternalLink icon), optional "HN Discussion" button, optional "PDF" button — all outline style
- AI Summary box: rounded-lg border with muted/30 background, p-4. Header: "AI SUMMARY" in 10px uppercase tracking-wider muted text. Body: 14px leading-relaxed summary text.
- Content section: full article text, 14px muted, whitespace-pre-wrap, max-w-none. HTML tags stripped.
- Tags section: Tag icon + row of secondary Badge components (12px each)
- Related items section: border-t separator, "Related in [Category Name]" header (14px semibold muted), then 4 compact linked cards. Each card: rounded-lg border p-3, title (14px medium), source + relative time (12px muted). Hover: bg-muted/50 transition.

Empty/Error States:
- If item not found: FileQuestion icon (48px muted) + "Page not found" + "Back to dashboard" button

CONTEXT OF USE
- Users drill down from Dashboard to read full details on a specific item
- Desktop primary but must be mobile-readable
- Users want: quick AI summary scan → decide if worth reading original → click external link

CONSTRAINTS
- Dark mode only, same theme
- AI Summary box should have a subtle visual distinction (slightly lighter background or faint left border accent matching the category color)
- Responsive: full width on mobile, max-w-4xl centered on desktop
- Related items: 4 items max, from same category, excluding current item
- Use shadcn/ui Badge and Button, lucide-react icons
- Same typography system, Geist Sans + Geist Mono for metadata
```

## Iteration Prompts

If the Dashboard feed feels too dense:
→ "Add 4px more vertical padding inside each feed card and increase the gap between cards from 2px to 4px. Keep the same information density."

If the hero section doesn't pop enough:
→ "Make the featured card in Top Stories slightly larger — add a faint gradient border (blue-500/20 to purple-500/20) and increase the summary to 4 lines. The featured card should clearly dominate."

If dark mode contrast is off:
→ "Increase card background to #13131f and border to #22223a. Make muted-foreground slightly brighter (oklch 0.6 instead of 0.556). The cards should be clearly distinguishable from the page background."

If mobile layout breaks:
→ "On mobile (<768px): collapse stats ribbon to 2 columns, hide scope filter toggle (default to Dev Focus), make search input full width below the time filter, stack hero cards vertically."

If typography feels generic:
→ "Use -0.02em letter-spacing on the page title and card titles. Use font-medium (500) for card titles, not font-semibold. Make timestamps use Geist Mono at 10px. This should feel like a developer tool, not a blog."
