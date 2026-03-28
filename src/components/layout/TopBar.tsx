"use client";

import styles from "@/styles/scoreboard.module.css";

interface TopBarProps {
  onSettingsClick: () => void;
  onFullscreenClick?: () => void;
  isFullscreen?: boolean;
  onCastClick?: () => void;
  onSoundToggle?: () => void;
  isSoundOn?: boolean;
}

const s = "rgba(232,232,228,0.3)";

export default function TopBar({
  onSettingsClick,
  onFullscreenClick,
  isFullscreen,
  onCastClick,
  onSoundToggle,
  isSoundOn,
}: TopBarProps) {
  return (
    <div className={styles.topBar}>
      {/* Left side: brand */}
      <div className={styles.teamLabel}>RETROSCORE</div>

      {/* Right side: baseball with hover menu */}
      <div className={styles.baseballMenu}>
        {/* Baseball icon (always visible) */}
        <button className={styles.baseballBtn} title="Menu">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(232,232,228,0.15)" strokeWidth="3" />
            <path d="M 32 18 Q 22 30, 26 50 Q 30 70, 32 82" fill="none" stroke="rgba(232,232,228,0.12)" strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="24" x2="34" y2="27" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="32" x2="31" y2="34" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="40" x2="30" y2="41" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="48" x2="30" y2="49" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="56" x2="30" y2="57" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="26" y1="64" x2="31" y2="65" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="28" y1="72" x2="34" y2="73" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 68 18 Q 78 30, 74 50 Q 70 70, 68 82" fill="none" stroke="rgba(232,232,228,0.12)" strokeWidth="2" strokeLinecap="round" />
            <line x1="66" y1="24" x2="72" y2="27" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="69" y1="32" x2="75" y2="34" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="70" y1="40" x2="76" y2="41" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="70" y1="48" x2="76" y2="49" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="69" y1="56" x2="76" y2="57" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="69" y1="64" x2="75" y2="65" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="66" y1="72" x2="72" y2="73" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Dropdown menu (appears on hover) */}
        <div className={styles.baseballDropdown}>
          {onSoundToggle && (
            <button className={styles.menuItem} onClick={onSoundToggle}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {isSoundOn ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
              <span>{isSoundOn ? "Mute" : "Sounds"}</span>
            </button>
          )}
          {onCastClick && (
            <button className={styles.menuItem} onClick={onCastClick}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Cast to TV</span>
            </button>
          )}
          {onFullscreenClick && (
            <button className={styles.menuItem} onClick={onFullscreenClick}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {isFullscreen ? (
                  <>
                    <polyline points="4 14 8 14 8 18" />
                    <polyline points="20 10 16 10 16 6" />
                  </>
                ) : (
                  <>
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                  </>
                )}
              </svg>
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
          )}
          <button className={styles.menuItem} onClick={onSettingsClick}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Change Team</span>
          </button>
        </div>
      </div>
    </div>
  );
}
