import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CENSUS - Daily US Census Data Quiz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "monospace",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(to right, #7c3aed, #06b6d4)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: "0.25em",
              color: "#111827",
            }}
          >
            CENSUS
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#6b7280",
              letterSpacing: "0.05em",
            }}
          >
            Daily US Census Data Quiz
          </div>

          {/* Emoji squares row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
            }}
          >
            {["#ef4444", "#ef4444", "#eab308", "#eab308", "#22c55e"].map(
              (color, i) => (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: color,
                  }}
                />
              )
            )}
          </div>

          <div
            style={{
              fontSize: 22,
              color: "#9ca3af",
              marginTop: 8,
            }}
          >
            How well do you know America?
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
