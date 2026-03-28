"use client";

import type { GameScore } from "@/lib/mlb/types";
import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import TeamLogo from "@/components/shared/TeamLogo";
import styles from "@/styles/scoreboard.module.css";

interface LiveGameCardProps {
  game: GameScore;
  onClick?: (gamePk: number) => void;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function previewLabel(gameDate: string): string {
  const start = new Date(gameDate);
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  const diffMin = diffMs / 60_000;

  if (diffMin <= 0) return "Pre-Game";
  if (diffMin <= 90) return "Pre-Game";

  return start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

export default function LiveGameCard({ game, onClick }: LiveGameCardProps) {
  const isPreview = game.status === "Preview";
  const showRuns = game.status === "Live" || game.status === "Final";

  return (
    <ScoreboardSurface className={styles.liveCard}>
      <div
        className={styles.liveCardInner}
        onClick={onClick ? () => onClick(game.gamePk) : undefined}
        style={onClick ? { cursor: "pointer" } : undefined}
      >
        {/* Away team (top) */}
        <div className={styles.liveTeamRow}>
          <TeamLogo team={game.away.team} size={24} />
          <div className={styles.ltName}>{game.away.team.abbreviation}</div>
          {showRuns && <div className={styles.ltRuns}>{game.away.runs}</div>}
        </div>
        {/* Home team (bottom) */}
        <div className={styles.liveTeamRow}>
          <TeamLogo team={game.home.team} size={24} />
          <div className={styles.ltName}>{game.home.team.abbreviation}</div>
          {showRuns && <div className={styles.ltRuns}>{game.home.runs}</div>}
        </div>
        {/* Status indicator */}
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
            <span className={styles.innLabel}>{previewLabel(game.gameDate)}</span>
          )}
        </div>
      </div>
    </ScoreboardSurface>
  );
}
