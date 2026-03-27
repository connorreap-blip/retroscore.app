import type { GameScore } from "@/lib/mlb/types";
import IndicatorLights from "./IndicatorLights";
import styles from "@/styles/scoreboard.module.css";

interface StatsPanelProps {
  game: GameScore;
}

export default function StatsPanel({ game }: StatsPanelProps) {
  return (
    <div className={styles.statsPanel}>
      <div className={styles.statGroup}>
        <span className={styles.statLabel}>AT BAT</span>
        <div className={`${styles.plate} ${styles.largePlate}`}>
          {game.atBatId ?? "—"}
        </div>
      </div>
      <IndicatorLights label="BALL" count={game.count.balls} max={3} color="ball" />
      <IndicatorLights label="STRIKE" count={game.count.strikes} max={2} color="strike" />
      <IndicatorLights label="OUT" count={game.count.outs} max={2} color="strike" />
    </div>
  );
}
