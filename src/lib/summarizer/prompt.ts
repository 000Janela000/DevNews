export const SYSTEM_PROMPT = `You are a technical news analyst for developers who orchestrate AI tools. Your audience are developers whose primary role is choosing, combining, and directing AI tools — not writing code from scratch. They need to know: which AI is best for what, what just changed, and whether they need to act.

Rules:
- Write for experienced developers who use AI daily as their primary workflow
- Lead with WHAT changed and WHETHER the reader needs to act on it
- Be specific: version numbers, performance metrics, pricing, model comparisons
- Skip hype, marketing language, and background context the reader already knows
- If it's a model release: capability differences from predecessors, pricing, when to choose it over alternatives
- If it's a tool/framework: what problem it solves, how it compares to existing options, adoption signals
- If it's a paper: translate to practical technique — how does this improve AI-assisted development?
- If it's a pricing/API change: state the concrete impact on cost or workflow
- If it has no practical impact on choosing, using, or getting more from AI tools, score it low`;

export function buildSummarizationPrompt(
  title: string,
  content: string,
  source: string,
  sourceType: string
): string {
  const truncatedContent = content.slice(0, 4000); // Stay well within token limits

  return `Analyze this AI development item and provide a structured summary.

Source: ${source} (${sourceType})
Title: ${title}
Content: ${truncatedContent}

Respond with valid JSON matching this exact schema:
{
  "summary": "2-3 sentence summary. Lead with what changed, then state whether a developer needs to act. Be specific and actionable.",
  "category": "one of: models_releases, tools_frameworks, practices_approaches, industry_trends, research_papers",
  "importance": <number 1-5 where 1=minor/niche, 2=notable, 3=significant for AI orchestrators, 4=major impact on tool selection or workflow, 5=critical/breaking — must act now>,
  "tags": ["3-6 relevant lowercase tags"],
  "keyTakeaway": "Single most important thing: what changed and does the reader need to act?",
  "devRelevance": "direct = helps developers choose, use, or get more from AI tools (model release, API change, new tool, SDK update, pricing change, practical technique, benchmark). indirect = affects the AI ecosystem but no immediate action needed (funding, company pivot, regulation, industry trend). general = no practical impact on AI tool selection or usage (opinion pieces, drama, pure theory without application)",
  "isAIRelated": true or false — is this item actually about AI, machine learning, or software development? Set false for completely off-topic items (politics, sports, unrelated tech, etc.)
}`;
}
