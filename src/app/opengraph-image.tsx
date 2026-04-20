import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
          padding: "80px 96px",
          color: "#2a2622",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6b5f54",
            fontFamily: "monospace",
          }}
        >
          <span>{dateLabel}</span>
          <span>
            Issue №{Math.floor(
              (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
                (1000 * 60 * 60 * 24)
            )}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 180,
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: -6,
              fontFamily: "serif",
            }}
          >
            DevNews
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              fontStyle: "italic",
              color: "#6b5f54",
              fontFamily: "serif",
              maxWidth: 800,
            }}
          >
            A daily briefing of AI developments for people who build software.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Double-rule rendered as two stacked thin lines — satori
              doesn't support `border: double`, but two solid borders
              with a 3px gap is visually identical. */}
          <div style={{ height: 1, backgroundColor: "#2a2622" }} />
          <div style={{ height: 3 }} />
          <div style={{ height: 1, backgroundColor: "#2a2622" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 20,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6b5f54",
              fontFamily: "monospace",
            }}
          >
            <span>Summaries first · drill-down on demand</span>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#b74a28",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
