import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "#2b5341",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            fontStyle: "italic",
            fontSize: 80,
            color: "#e2dfd6",
            letterSpacing: -2,
          }}
        >
          RS
        </span>
      </div>
    ),
    { ...size }
  );
}
