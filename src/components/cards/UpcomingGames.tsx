import type { ScheduleGame } from "@/lib/mlb/types";
import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import TeamLogo from "@/components/shared/TeamLogo";
import styles from "@/styles/scoreboard.module.css";

interface UpcomingGamesProps {
  games: ScheduleGame[];
}

export default function UpcomingGames({ games }: UpcomingGamesProps) {
  const display = games.slice(0, 4);

  return (
    <ScoreboardSurface className={styles.cardPanel}>
      <div className={styles.panelTitle}>UPCOMING</div>
      <div className={styles.gamesList}>
        {display.length > 0 && (
          <div className={styles.nextLabel}>NEXT GAME</div>
        )}
        {display.map((g) => (
          <div key={g.gamePk} className={styles.gameRow}>
            <div className={styles.matchup}>
              <TeamLogo team={g.away} />
              <span className={styles.teamAbbr}>{g.away.abbreviation}</span>
              <span className={styles.atLabel}>at</span>
              <TeamLogo team={g.home} />
              <span className={styles.teamAbbr}>{g.home.abbreviation}</span>
            </div>
            <div className={styles.gameDateBlock}>
              <span className={styles.gameDate}>
                {new Date(g.date + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className={styles.gameTime}>{g.time}</span>
            </div>
          </div>
        ))}
      </div>
    </ScoreboardSurface>
  );
}
