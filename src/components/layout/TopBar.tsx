"use client";

import type { MlbTeam } from "@/lib/mlb/types";
import TeamLogo from "@/components/shared/TeamLogo";
import styles from "@/styles/scoreboard.module.css";

interface TopBarProps {
  team: MlbTeam;
  onSettingsClick: () => void;
  onFullscreenClick?: () => void;
  isFullscreen?: boolean;
  onCastClick?: () => void;
  onSoundToggle?: () => void;
  isSoundOn?: boolean;
}

const stroke = "rgba(232,232,228,0.3)";

export default function TopBar({
  team,
  onSettingsClick,
  onFullscreenClick,
  isFullscreen,
  onCastClick,
  onSoundToggle,
  isSoundOn,
}: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.teamBadge}>
        <TeamLogo team={team} size={32} />
        <span className={styles.teamLabel}>{team.name.toUpperCase()}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Sound toggle */}
        {onSoundToggle && (
          <button
            className={styles.settingsBtn}
            onClick={onSoundToggle}
            title={isSoundOn ? "Mute ballpark sounds" : "Ballpark sounds"}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
              {isSoundOn ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="23" y1="9" x2="17" y2="15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="17" y1="9" x2="23" y2="15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        )}

        {/* Cast to TV */}
        {onCastClick && (
          <button className={styles.settingsBtn} onClick={onCastClick} title="Stream to TV">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke={stroke} strokeWidth="1.5" />
              <line x1="8" y1="21" x2="16" y2="21" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12" y2="21" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Fullscreen */}
        {onFullscreenClick && (
          <button
            className={styles.settingsBtn}
            onClick={onFullscreenClick}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
              {isFullscreen ? (
                <>
                  <polyline points="4 14 8 14 8 18" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="20 10 16 10 16 6" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="14 4 14 8 18 8" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="10 20 10 16 6 16" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <polyline points="15 3 21 3 21 9" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="9 21 3 21 3 15" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="21 3 14 10" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="3 21 10 14" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </svg>
          </button>
        )}

        {/* Settings (baseball) */}
        <button className={styles.settingsBtn} onClick={onSettingsClick} title="Settings">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(232,232,228,0.12)" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(232,232,228,0.06)" strokeWidth="1" />
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
      </div>
    </div>
  );
}
