import styles from "@/styles/scoreboard.module.css";

interface IndicatorLightsProps {
  label: string;
  count: number;
  max: number;
  color: "ball" | "strike";
}

export default function IndicatorLights({ label, count, max, color }: IndicatorLightsProps) {
  return (
    <div className={styles.lightsGroup}>
      <span className={styles.statLabel}>{label}</span>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={styles.lightHousing}>
          <div
            className={`${styles.light} ${
              i < count
                ? color === "ball"
                  ? styles.lightBallOn
                  : styles.lightStrikeOn
                : styles.lightOff
            }`}
          />
        </div>
      ))}
    </div>
  );
}
