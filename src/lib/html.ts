const CONTENT_CAP = 10_000;

/** Check if content was likely truncated at ingestion (capped at 10KB) */
export function isContentTruncated(content: string | null): boolean {
  return content !== null && content.length >= CONTENT_CAP;
}

/** Strip HTML tags and decode common entities, then trim to maxLength */
export function stripHtml(html: string, maxLength = 500): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}
