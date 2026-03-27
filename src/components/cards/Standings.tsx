import type { StandingsEntry } from "@/lib/mlb/types";
import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import styles from "@/styles/scoreboard.module.css";

interface StandingsProps {
  entries: StandingsEntry[];
  divisionName: string;
}

export default function Standings({ entries, divisionName }: StandingsProps) {
  return (
    <ScoreboardSurface className={styles.cardPanel}>
      <div className={styles.panelTitle}>{divisionName.toUpperCase()}</div>
      <div className={styles.standingsGrid}>
        <div className={styles.standingsHeader}>
          <span />
          <span>TEAM</span>
          <span>W</span>
          <span>L</span>
          <span>GB</span>
        </div>
        {entries.map((e) => (
          <div key={e.team.id} className={styles.standingsRow}>
            <div className={styles.rank}>{e.rank}</div>
            <div className={styles.stTeam}>{e.team.abbreviation}</div>
            <div className={styles.stNum}>{e.wins}</div>
            <div className={styles.stNum}>{e.losses}</div>
            <div className={styles.stGb}>{e.gamesBehind}</div>
          </div>
        ))}
      </div>
    </ScoreboardSurface>
  );
}
