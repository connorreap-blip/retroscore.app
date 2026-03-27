import type { GameScore } from "@/lib/mlb/types";
import NumberPlate from "./NumberPlate";
import styles from "@/styles/scoreboard.module.css";

interface LinescoreProps {
  game: GameScore;
}

const MAX_INNINGS = 10;

export default function Linescore({ game }: LinescoreProps) {
  const innings = Array.from({ length: MAX_INNINGS }, (_, i) => {
    const inn = game.innings.find((x) => x.num === i + 1);
    return { num: i + 1, away: inn?.away, home: inn?.home };
  });

  const currentInning = game.inning || 0;

  return (
    <div className={styles.linescore}>
      {/* Header row */}
      <div className={styles.headerEmpty}>P</div>
      {innings.map((inn) => (
        <div key={`h-${inn.num}`} className={styles.header}>
          {inn.num}
        </div>
      ))}
      <div className={styles.dividerSpacer} />
      <div className={styles.headerRhe}>R</div>
      <div className={styles.headerRhe}>H</div>
      <div className={styles.headerRhe}>E</div>

      {/* Away team row */}
      <div className={styles.teamNameCell}>{game.away.team.abbreviation}</div>
      {innings.map((inn) => (
        <NumberPlate
          key={`a-${inn.num}`}
          value={inn.away?.runs}
          isEmpty={inn.num > currentInning || (inn.num === currentInning && game.inningHalf === "Top" && !inn.away)}
        />
      ))}
      <div className={styles.colDivider} />
      <NumberPlate value={game.away.runs} isRhe />
      <NumberPlate value={game.away.hits} isRhe />
      <NumberPlate value={game.away.errors} isRhe />

      {/* Separator */}
      <div className={styles.teamSeparator} />

      {/* Home team row */}
      <div className={styles.teamNameCell}>{game.home.team.abbreviation}</div>
      {innings.map((inn) => (
        <NumberPlate
          key={`h-${inn.num}`}
          value={inn.home?.runs}
          isEmpty={inn.num > currentInning || (inn.num === currentInning && game.inningHalf === "Top") || (inn.num === currentInning && !inn.home)}
        />
      ))}
      <div className={styles.colDivider} />
      <NumberPlate value={game.home.runs} isRhe />
      <NumberPlate value={game.home.hits} isRhe />
      <NumberPlate value={game.home.errors} isRhe />
    </div>
  );
}
