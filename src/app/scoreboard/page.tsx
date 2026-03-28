"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTeamStore } from "@/stores/team-store";
import { useScoreboardStore } from "@/stores/scoreboard-store";
import { useScheduleStore } from "@/stores/schedule-store";
import { useStandingsStore } from "@/stores/standings-store";
import { useLeagueStore } from "@/stores/league-store";

import type { GameScore } from "@/lib/mlb/types";
import { fetchSchedule, fetchGameFeed, fetchTeamSchedule, fetchStandings } from "@/lib/mlb/api";
import {
  transformScheduleToScores,
  transformGameFeed,
  transformScheduleToUpcoming,
  transformStandings,
} from "@/lib/mlb/transforms";

import TopBar from "@/components/layout/TopBar";
import ViewToggle from "@/components/layout/ViewToggle";
import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import Linescore from "@/components/scoreboard/Linescore";
import StatsPanel from "@/components/scoreboard/StatsPanel";
import UpcomingGames from "@/components/cards/UpcomingGames";
import Standings from "@/components/cards/Standings";
import LiveGameCard from "@/components/cards/LiveGameCard";
import TeamPicker from "@/components/settings/TeamPicker";
import CastGuide from "@/components/settings/CastGuide";
import { ballparkAmbiance } from "@/lib/audio/ballpark-ambiance";
import { stadiumAnnouncer } from "@/lib/audio/stadium-announcer";

import styles from "@/styles/scoreboard.module.css";

export default function ScoreboardPage() {
  const selectedTeam = useTeamStore((s) => s.selectedTeam);
  const [activeView, setActiveView] = useState("my-team");
  const [showPicker, setShowPicker] = useState(false);

  // If no team selected, show picker
  if (!selectedTeam) {
    return <TeamPicker onClose={() => {}} />;
  }

  return (
    <ScoreboardInner
      selectedTeam={selectedTeam}
      activeView={activeView}
      setActiveView={setActiveView}
      showPicker={showPicker}
      setShowPicker={setShowPicker}
    />
  );
}

// Separate component so hooks aren't called conditionally
function ScoreboardInner({
  selectedTeam,
  activeView,
  setActiveView,
  showPicker,
  setShowPicker,
}: {
  selectedTeam: NonNullable<ReturnType<typeof useTeamStore.getState>["selectedTeam"]>;
  activeView: string;
  setActiveView: (v: string) => void;
  showPicker: boolean;
  setShowPicker: (v: boolean) => void;
}) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const currentYear = new Date().getFullYear();

  // ── Read from stores ──
  const game = useScoreboardStore((s) => s.game);
  const upcoming = useScheduleStore((s) => s.upcoming);
  const standings = useStandingsStore((s) => s.entries);
  const divisionName = useStandingsStore((s) => s.divisionName);
  const leagueGames = useLeagueStore((s) => s.games);

  // Track which game the user is focused on (null = auto-detect team game)
  const [focusedGamePk, setFocusedGamePk] = useState<number | null>(null);

  // ── Schedule query ──
  const { data: scheduleData } = useQuery({
    queryKey: ["schedule", today],
    queryFn: () => fetchSchedule(today),
    refetchInterval: hasLiveGamesInData(leagueGames) ? 15_000 : 60_000,
  });

  useEffect(() => {
    if (!scheduleData) return;
    const scores = transformScheduleToScores(scheduleData);
    useLeagueStore.getState().setGames(scores);

    // Determine which game to show on the main scoreboard
    const targetPk = focusedGamePk;
    const targetGame = targetPk
      ? scores.find((g) => g.gamePk === targetPk)
      : scores.find(
          (g) => g.home.team.id === selectedTeam.id || g.away.team.id === selectedTeam.id
        );

    if (targetGame) {
      // Preserve atBatName from game feed — schedule data doesn't have it
      const current = useScoreboardStore.getState().game;
      const sameGame = current?.gamePk === targetGame.gamePk;
      useScoreboardStore.getState().setGame({
        ...targetGame,
        atBatName: sameGame ? current.atBatName : undefined,
        venue: targetGame.venue || (sameGame ? current.venue : undefined),
      });
    } else if (!targetPk) {
      useScoreboardStore.getState().setGame(null);
    }
  }, [scheduleData, selectedTeam.id, focusedGamePk]);

  // ── Game feed query (live games only) ──
  const displayedGamePk = game?.gamePk;
  const displayedGameStatus = game?.status;

  const { data: feedData } = useQuery({
    queryKey: ["gameFeed", displayedGamePk],
    queryFn: () => fetchGameFeed(displayedGamePk!),
    enabled: !!displayedGamePk && displayedGameStatus === "Live",
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!feedData || !displayedGamePk) return;
    useScoreboardStore.getState().setGame(transformGameFeed(feedData, displayedGamePk));
  }, [feedData, displayedGamePk]);

  // ── Team schedule query (upcoming games) ──
  const endDate = useMemo(() => {
    return new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });
  }, []);

  const { data: teamScheduleData } = useQuery({
    queryKey: ["teamSchedule", selectedTeam.id],
    queryFn: () => fetchTeamSchedule(selectedTeam.id, today, endDate),
    staleTime: 3600_000,
  });

  useEffect(() => {
    if (!teamScheduleData) return;
    useScheduleStore.getState().setUpcoming(transformScheduleToUpcoming(teamScheduleData));
  }, [teamScheduleData]);

  // ── Standings query ──
  const { data: standingsData } = useQuery({
    queryKey: ["standings", currentYear],
    queryFn: () => fetchStandings(currentYear),
    staleTime: 1800_000,
  });

  useEffect(() => {
    if (!standingsData) return;
    useStandingsStore
      .getState()
      .setStandings(
        transformStandings(standingsData, selectedTeam.division),
        selectedTeam.division
      );
  }, [standingsData, selectedTeam.division]);

  // ── Ballpark ambiance ──
  const [isSoundOn, setIsSoundOn] = useState(false);

  const toggleSound = useCallback(() => {
    if (ballparkAmbiance.playing) {
      ballparkAmbiance.stop();
      stadiumAnnouncer.disable();
      setIsSoundOn(false);
    } else {
      ballparkAmbiance.start();
      stadiumAnnouncer.enable();
      setIsSoundOn(true);
    }
  }, []);

  // Announce batter changes
  useEffect(() => {
    if (game?.atBatName) {
      stadiumAnnouncer.announceBatter(game.atBatName);
    }
  }, [game?.atBatName]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      ballparkAmbiance.stop();
      stadiumAnnouncer.disable();
    };
  }, []);

  // ── Cast guide ──
  const [showCast, setShowCast] = useState(false);

  // ── Fullscreen ──
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Wake lock (prevent screen sleep) ──
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    let released = false;

    async function requestWakeLock() {
      if (!("wakeLock" in navigator)) return;
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      } catch {
        // Wake lock request failed (e.g., low battery)
      }
    }

    // Re-acquire on visibility change (tab comes back into focus)
    function handleVisibility() {
      if (document.visibilityState === "visible" && !wakeLockRef.current && !released) {
        requestWakeLock();
      }
    }

    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

  // ── Render ──
  return (
    <div className={`${styles.pageBody} ${isFullscreen ? styles.fullscreen : ""}`}>
      <TopBar
        onSettingsClick={() => setShowPicker(true)}
        onFullscreenClick={toggleFullscreen}
        isFullscreen={isFullscreen}
        onCastClick={() => setShowCast(true)}
        onSoundToggle={toggleSound}
        isSoundOn={isSoundOn}
      />

      {/* Main scoreboard */}
      <ScoreboardSurface className={styles.scoreboard}>
        {game ? (
          game.status === "Preview" ? (
            <PreviewCountdown game={game} />
          ) : (
            <>
              {/* Matchup header: logos + venue */}
              <div className={styles.matchupHeader}>
                <img
                  src={`https://www.mlbstatic.com/team-logos/team-cap-on-dark/${game.away.team.id}.svg`}
                  alt={game.away.team.abbreviation}
                  className={styles.capLogo}
                />
                <div className={styles.matchupInfo}>
                  <div className={styles.matchupTeams}>
                    {game.away.team.abbreviation}
                    <span className={styles.matchupAt}>at</span>
                    {game.home.team.abbreviation}
                  </div>
                  {game.venue && (
                    <div className={styles.venueName}>{game.venue}</div>
                  )}
                </div>
                <img
                  src={`https://www.mlbstatic.com/team-logos/team-cap-on-dark/${game.home.team.id}.svg`}
                  alt={game.home.team.abbreviation}
                  className={styles.capLogo}
                />
              </div>
              <Linescore game={game} />
              <hr className={styles.boardDivider} />
              <StatsPanel game={game} />
            </>
          )
        ) : (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "40px",
              color: "var(--sb-text-color)",
              fontFamily: "Georgia, serif",
            }}
          >
            No game today
          </div>
        )}
      </ScoreboardSurface>

      {/* View toggle */}
      <ViewToggle
        activeView={activeView}
        onSwitch={setActiveView}
        views={["my-team", "around-league"]}
        labels={["My Team", "Around the League"]}
      />

      {/* View container */}
      <div className={styles.viewContainer}>
        <div
          className={`${styles.viewMyTeam} ${activeView === "my-team" ? styles.active : ""}`}
        >
          <UpcomingGames games={upcoming} />
          <Standings entries={standings} divisionName={divisionName} />
        </div>
        <div
          className={`${styles.viewAroundLeague} ${activeView === "around-league" ? styles.active : ""}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            ...(isFullscreen && leagueGames.length > 0
              ? {
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.ceil(leagueGames.length / 2)}, auto)`,
                  justifyContent: "center",
                  justifyItems: "center",
                  gap: 12,
                }
              : {}),
          }}
        >
          {leagueGames.map((g) => (
            <LiveGameCard
              key={g.gamePk}
              game={g}
              onClick={(gamePk) => {
                const picked = leagueGames.find((lg) => lg.gamePk === gamePk);
                if (picked) {
                  setFocusedGamePk(gamePk);
                  useScoreboardStore.getState().setGame(picked);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlays */}
      {showPicker && <TeamPicker onClose={() => setShowPicker(false)} />}
      {showCast && <CastGuide onClose={() => setShowCast(false)} />}
    </div>
  );
}

/** Check if any games in the current list are live */
function hasLiveGamesInData(games: { status: string }[]): boolean {
  return games.some((g) => g.status === "Live");
}

/** Countdown display for preview (not yet started) games */
function PreviewCountdown({ game }: { game: GameScore }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(game.gameDate).getTime();
  const diffMs = Math.max(0, start - now);
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
  const seconds = Math.floor((diffMs % 60_000) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");

  const timeStr = new Date(game.gameDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  return (
    <div className={styles.previewCountdown}>
      {/* Venue name — hero treatment */}
      {game.venue && (
        <div className={styles.previewVenue}>{game.venue}</div>
      )}

      {/* Logos + matchup */}
      <div className={styles.previewMatchup}>
        <img
          src={`https://www.mlbstatic.com/team-logos/team-cap-on-dark/${game.away.team.id}.svg`}
          alt={game.away.team.abbreviation}
          className={styles.previewLogo}
        />
        <div className={styles.previewVs}>
          <span>{game.away.team.abbreviation}</span>
          <span className={styles.previewAt}>at</span>
          <span>{game.home.team.abbreviation}</span>
        </div>
        <img
          src={`https://www.mlbstatic.com/team-logos/team-cap-on-dark/${game.home.team.id}.svg`}
          alt={game.home.team.abbreviation}
          className={styles.previewLogo}
        />
      </div>

      {/* Probable pitchers */}
      <div className={styles.previewPitchers}>
        <div>
          <span className={styles.previewPitcherLabel}>SP {game.away.team.abbreviation}</span>
          {game.away.probablePitcher ?? "TBD"}
        </div>
        <div>
          <span className={styles.previewPitcherLabel}>SP {game.home.team.abbreviation}</span>
          {game.home.probablePitcher ?? "TBD"}
        </div>
      </div>

      {/* Countdown */}
      <div className={styles.previewTimer}>
        {hours > 0 && `${hours}:`}{pad(minutes)}:{pad(seconds)}
      </div>

      {/* First pitch */}
      <div className={styles.previewFirstPitch}>
        First Pitch {timeStr} ET
      </div>
    </div>
  );
}
