# DevNews — User Experience

## Browsing (No Auth Required)

### Daily Briefing (Main View)

The dashboard shows a curated set of items totaling approximately 20 minutes of reading time.

- Items ordered by significance score (highest first)
- Each item shows: source badge, category badge, title, AI summary (2-3 sentences), time since published, engagement signals (stars, comments)
- "High Impact" badge on items with importance 4+
- Reading time estimate shown per item
- Estimated total reading time for the current briefing shown at top

### Filtering

- **Category tabs**: All, Models & Releases, Tools & Frameworks, Practices & Approaches, Industry & Trends, Research & Papers
- **Time range**: Today, This Week, This Month, All Time
- **Scope**: Dev Focus (direct relevance only), Dev + Industry (direct + indirect), Everything
- **Search**: Filter by keyword across title, content, and summary

### Top Stories (Hero Section)

The top 5 items by significance score displayed prominently. One featured card with full summary, four secondary cards with titles.

### Story Clusters

When the same event is covered by multiple sources, items are grouped. The card shows:
- Synthesis summary combining all source perspectives
- "N sources" badge
- Clicking opens all individual source articles

### Item Detail Page

Full view of a single item:
- AI summary in a highlighted box
- Full content (HTML stripped to text)
- Metadata: publication date, stars, comments, language
- Action buttons: Open Original, HN Discussion (if applicable), PDF (if ArXiv)
- Tags
- Related items in same category (up to 4)

### Weekly Digest

A dedicated page grouping the week's top 30 items by category. Shows quick stats per category and estimated total count.

### Search API

Server-side search available at `/api/search?q=term`. Searches title and content. Minimum 2 characters. Returns up to 50 results.

## Authenticated Features

Auth is only required when a user wants to use persistent features. The site is fully browsable without logging in.

### Mark as Read

- Marks an item as read
- Read items leave the briefing on next visit
- Prevents the same content from reappearing

### Read Later

- Saves an item to a personal "Read Later" queue
- Permanent — stays until the user reads it, even months later
- Separate view to browse Read Later items

### Save

- Saves an item to a permanent "Saved" collection
- For reference material the user wants to revisit
- Separate view to browse Saved items

## Health Indicator

Always visible in the dashboard header:

| Status | Meaning | Visual |
|--------|---------|--------|
| Green | Last successful fetch < 4 hours ago | Green dot |
| Yellow | Last successful fetch 4-12 hours ago | Yellow dot |
| Red | Last successful fetch 12+ hours ago | Red dot + warning banner |

"Updated X ago" timestamp always visible next to the indicator.

### Manual Refresh

- A refresh button appears when status is yellow or red
- Pressing it triggers the light pipeline (fast sources, ~3 minutes)
- Button enters "Refreshing..." locked state after press
- Stays locked until new data arrives and status turns green
- No auth required — state machine prevents abuse (button inactive when data is fresh)
