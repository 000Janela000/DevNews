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
          backgroundColor: "#f7f5ef",
          padding: "72px 88px",
          color: "#3a3430",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 15,
            color: "#7a6e62",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#4a6da0",
              }}
            />
            <span>{category}</span>
            <span>·</span>
            <span>{source}</span>
          </div>
          <span>DevNews</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: -1.2,
              fontFamily: "sans-serif",
            }}
          >
            {title.length > 150 ? title.slice(0, 147) + "…" : title}
          </div>
          {summary && !summary.startsWith("[Off-topic]") ? (
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.5,
                color: "#7a6e62",
                fontFamily: "sans-serif",
              }}
            >
              {summary.length > 220 ? summary.slice(0, 217) + "…" : summary}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 1, backgroundColor: "#3a3430" }} />
          <div
            style={{
              paddingTop: 14,
              fontSize: 14,
              color: "#7a6e62",
              fontFamily: "sans-serif",
            }}
          >
            dev-news.vercel.app
          </div>
        </div>
      </div>
    ),
    size
  );
}
