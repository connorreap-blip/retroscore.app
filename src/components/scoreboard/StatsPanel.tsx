import type { GameScore } from "@/lib/mlb/types";
import IndicatorLights from "./IndicatorLights";
import styles from "@/styles/scoreboard.module.css";

interface StatsPanelProps {
  game: GameScore;
}

export default function StatsPanel({ game }: StatsPanelProps) {
  const isFinal = game.status === "Final";

  // Extract last name for compact display
  const batterDisplay = game.atBatName
    ? game.atBatName.split(" ").slice(-1)[0]
    : "—";

  return (
    <div className={styles.statsPanel}>
      {isFinal ? (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: "Impact, 'Arial Narrow', sans-serif",
            fontSize: 22,
            letterSpacing: 4,
            color: "var(--sb-text-color)",
            opacity: 0.7,
          }}
        >
          FINAL
        </div>
      ) : (
        <>
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>AT BAT</span>
            <div
              className={`${styles.plate} ${styles.largePlate}`}
              style={{ fontSize: 14, letterSpacing: 1, minWidth: 80 }}
            >
              {batterDisplay}
            </div>
          </div>
          <IndicatorLights label="BALL" count={game.count.balls} max={3} color="ball" />
          <IndicatorLights label="STRIKE" count={game.count.strikes} max={2} color="strike" />
          <IndicatorLights label="OUT" count={game.count.outs} max={2} color="strike" />
        </>
      )}
    </div>
  );
}
