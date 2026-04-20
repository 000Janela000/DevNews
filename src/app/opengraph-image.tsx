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
          backgroundColor: "#f7f5ef",
          padding: "80px 96px",
          color: "#3a3430",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#7a6e62",
            fontFamily: "sans-serif",
          }}
        >
          <span>{dateLabel}</span>
          <span>DevNews</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 92,
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: -3,
              fontFamily: "sans-serif",
            }}
          >
            The AI developer&apos;s briefing.
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.45,
              color: "#7a6e62",
              fontFamily: "sans-serif",
              maxWidth: 800,
            }}
          >
            A daily summary of what shipped, what changed, and why you care.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 1, backgroundColor: "#3a3430" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 16,
              fontSize: 14,
              color: "#7a6e62",
              fontFamily: "sans-serif",
            }}
          >
            <span>Summaries first. Drill-down on demand.</span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#4a6da0",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
