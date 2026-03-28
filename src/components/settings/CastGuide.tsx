"use client";

import styles from "@/styles/scoreboard.module.css";

interface CastGuideProps {
  onClose: () => void;
}

export default function CastGuide({ onClose }: CastGuideProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className={styles.boardSurface}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, width: "100%", padding: "28px 32px" }}
      >
        <div className={styles.waterStreaks} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontFamily: "Impact, 'Arial Narrow', sans-serif",
              fontSize: 20,
              letterSpacing: 3,
              color: "var(--sb-text-color)",
              marginBottom: 20,
              borderBottom: "2px solid var(--sb-line-color)",
              paddingBottom: 12,
            }}
          >
            STREAM TO YOUR TV
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* AirPlay */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={iconStyle}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(232,232,228,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                  <polygon points="12 15 17 21 7 21 12 15" />
                </svg>
              </div>
              <div>
                <div style={labelStyle}>AirPlay (Mac / iPhone)</div>
                <div style={descStyle}>
                  Click the Screen Mirroring icon in Control Center or menu bar.
                  Select your Apple TV or AirPlay-compatible smart TV.
                </div>
              </div>
            </div>

            {/* Chromecast */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={iconStyle}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(232,232,228,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                  <line x1="2" y1="20" x2="2.01" y2="20" />
                </svg>
              </div>
              <div>
                <div style={labelStyle}>Chromecast (Chrome Browser)</div>
                <div style={descStyle}>
                  In Chrome, click the three-dot menu &rarr; &ldquo;Cast&rdquo;.
                  Select your Chromecast or Android TV device. Choose &ldquo;Cast tab&rdquo;.
                </div>
              </div>
            </div>

            {/* Roku */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={iconStyle}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(232,232,228,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <div style={labelStyle}>Roku / Fire TV</div>
                <div style={descStyle}>
                  Enable Screen Mirroring in Settings &rarr; System.
                  On your phone or computer, start screen mirroring and select the Roku/Fire TV.
                  Or open the TV&rsquo;s web browser and navigate to this page.
                </div>
              </div>
            </div>

            {/* HDMI */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={iconStyle}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(232,232,228,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="10" rx="1" />
                  <path d="M6 7V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
              <div>
                <div style={labelStyle}>HDMI Cable</div>
                <div style={descStyle}>
                  The simplest option. Connect your laptop to your TV via HDMI,
                  go fullscreen, and you&rsquo;re set.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              fontFamily: "Georgia, serif",
              fontSize: 11,
              color: "rgba(232,232,228,0.25)",
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            TIP: USE FULLSCREEN MODE BEFORE CASTING FOR THE BEST EXPERIENCE
          </div>
        </div>
      </div>
    </div>
  );
}

const iconStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Impact, 'Arial Narrow', sans-serif",
  fontSize: 15,
  letterSpacing: 2,
  color: "var(--sb-text-color)",
  marginBottom: 4,
};

const descStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: 12,
  lineHeight: 1.5,
  color: "rgba(232,232,228,0.4)",
};
