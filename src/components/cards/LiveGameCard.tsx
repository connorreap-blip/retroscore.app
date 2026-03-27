import type { GameScore } from "@/lib/mlb/types";
import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import TeamLogo from "@/components/shared/TeamLogo";
import styles from "@/styles/scoreboard.module.css";

interface LiveGameCardProps {
  game: GameScore;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function LiveGameCard({ game }: LiveGameCardProps) {
  return (
    <ScoreboardSurface className={styles.liveCard}>
      <div className={styles.liveCardInner}>
        {/* Away team (top) */}
        <div className={styles.liveTeamRow}>
          <TeamLogo team={game.away.team} size={24} />
          <div className={styles.ltName}>{game.away.team.abbreviation}</div>
          <div className={styles.ltRuns}>{game.away.runs}</div>
        </div>
        {/* Home team (bottom) */}
        <div className={styles.liveTeamRow}>
          <TeamLogo team={game.home.team} size={24} />
          <div className={styles.ltName}>{game.home.team.abbreviation}</div>
          <div className={styles.ltRuns}>{game.home.runs}</div>
        </div>
        {/* Inning indicator */}
        <div className={styles.inningStrip}>
          {game.status === "Final" ? (
            <span className={styles.innFinal}>Final</span>
          ) : game.status === "Live" ? (
            <>
              <span
                className={`${styles.innArrow} ${
                  game.inningHalf === "Top" ? styles.innArrowTop : styles.innArrowBot
                }`}
              />
              <span className={styles.innLabel}>{ordinal(game.inning)}</span>
            </>
          ) : (
            <span className={styles.innLabel}>{game.detailedState}</span>
          )}
        </div>
      </div>
    </ScoreboardSurface>
  );
}
