import { ImageResponse } from "next/og";
import { getItemById } from "@/lib/db/queries";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItemById(id);

  const title = item?.title ?? "DevNews";
  const summary = item?.summary ?? "A daily briefing of AI developments.";
  const category = item?.category
    ? CATEGORY_LABELS[item.category as Category]
    : "DevNews";
  const source = item?.source
    ? item.source.replace("rss:", "").replace("github-release:", "")
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf8f4",
          padding: "72px 88px",
          color: "#2a2622",
        }}
      >
        {/* Top meta strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6b5f54",
            fontFamily: "monospace",
          }}
        >
          <span>DevNews · {category}</span>
          <span>{source}</span>
        </div>

        {/* Title — the editorial centerpiece */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.1,
              fontWeight: 500,
              letterSpacing: -1.5,
              fontFamily: "serif",
            }}
          >
            {title.length > 140 ? title.slice(0, 137) + "…" : title}
          </div>
          {summary && !summary.startsWith("[Off-topic]") ? (
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.45,
                fontStyle: "italic",
                color: "#6b5f54",
                fontFamily: "serif",
              }}
            >
              {summary.length > 220 ? summary.slice(0, 217) + "…" : summary}
            </div>
          ) : null}
        </div>

        {/* Bottom wordmark + accent rule */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "2px solid #2a2622",
            paddingTop: 20,
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 42,
              fontWeight: 500,
              letterSpacing: -1,
            }}
          >
            DevNews
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#b74a28",
              marginBottom: 16,
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
