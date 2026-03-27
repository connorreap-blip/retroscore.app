import styles from "@/styles/scoreboard.module.css";

interface ScoreboardSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScoreboardSurface({ children, className }: ScoreboardSurfaceProps) {
  return (
    <div className={`${styles.boardSurface} ${className ?? ""}`}>
      <div className={styles.waterStreaks} />
      {children}
    </div>
  );
}
