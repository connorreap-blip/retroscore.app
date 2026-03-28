import { ImageResponse } from "next/og";

export const alt = "RetroScore — Live MLB scoreboard for your TV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#1e3a2d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(43,83,65,0.6) 0%, transparent 70%)",
          }}
        />

        {/* Scoreboard frame hint */}
        <div
          style={{
            border: "4px solid rgba(215,210,195,0.25)",
            borderRadius: 8,
            padding: "40px 60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            background: "#2b5341",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {/* Brand */}
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: 72,
              color: "#e2dfd6",
              letterSpacing: -1,
            }}
          >
            RetroScore
          </span>

          {/* Tagline */}
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 24,
              color: "rgba(215,210,195,0.5)",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Live MLB Scoreboard for Your TV
          </span>

          {/* Mini scoreboard hint */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
            }}
          >
            {["R", "H", "E"].map((label) => (
              <div
                key={label}
                style={{
                  width: 44,
                  height: 44,
                  background: "#1c2b24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Impact, sans-serif",
                  fontSize: 22,
                  color: "#e2dfd6",
                  boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.7)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <span
          style={{
            position: "absolute",
            bottom: 24,
            fontFamily: "Georgia, serif",
            fontSize: 16,
            color: "rgba(215,210,195,0.3)",
            letterSpacing: 2,
          }}
        >
          retroscore.app
        </span>
      </div>
    ),
    { ...size }
  );
}
