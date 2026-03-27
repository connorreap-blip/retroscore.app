"use client";

import type { MlbTeam } from "@/lib/mlb/types";
import TeamLogo from "@/components/shared/TeamLogo";
import styles from "@/styles/scoreboard.module.css";

interface TopBarProps {
  team: MlbTeam;
  onSettingsClick: () => void;
}

export default function TopBar({ team, onSettingsClick }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.teamBadge}>
        <TeamLogo team={team} size={32} />
        <span className={styles.teamLabel}>{team.name.toUpperCase()}</span>
      </div>
      <button className={styles.settingsBtn} onClick={onSettingsClick} title="Settings">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(232,232,228,0.12)" strokeWidth="3"/>
          <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(232,232,228,0.06)" strokeWidth="1"/>
          <path d="M 32 18 Q 22 30, 26 50 Q 30 70, 32 82" fill="none" stroke="rgba(232,232,228,0.12)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="28" y1="24" x2="34" y2="27" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="25" y1="32" x2="31" y2="34" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="24" y1="40" x2="30" y2="41" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="24" y1="48" x2="30" y2="49" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="25" y1="56" x2="30" y2="57" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="26" y1="64" x2="31" y2="65" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="28" y1="72" x2="34" y2="73" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 68 18 Q 78 30, 74 50 Q 70 70, 68 82" fill="none" stroke="rgba(232,232,228,0.12)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="66" y1="24" x2="72" y2="27" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="69" y1="32" x2="75" y2="34" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="70" y1="40" x2="76" y2="41" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="70" y1="48" x2="76" y2="49" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="69" y1="56" x2="76" y2="57" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="69" y1="64" x2="75" y2="65" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="66" y1="72" x2="72" y2="73" stroke="rgba(232,232,228,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
