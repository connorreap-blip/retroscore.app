"use client";

/**
 * Full-screen overlay for the display mode.
 * Subtle radial vignette simulating ambient room lighting.
 * Adapts to theme.
 */
export default function DisplayOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        background:
          "radial-gradient(ellipse at center, transparent 50%, var(--board-bg) 150%)",
        opacity: 0.5,
      }}
    />
  );
}
