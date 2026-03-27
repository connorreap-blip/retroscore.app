"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTeamStore } from "@/stores/team-store";
import { useScoreboardStore } from "@/stores/scoreboard-store";
import { useScheduleStore } from "@/stores/schedule-store";
import { useStandingsStore } from "@/stores/standings-store";
import { useLeagueStore } from "@/stores/league-store";

import { fetchSchedule, fetchGameFeed, fetchTeamSchedule, fetchStandings } from "@/lib/mlb/api";
import {
  transformScheduleToScores,
  transformGameFeed,
  transformScheduleToUpcoming,
  transformStandings,
} from "@/lib/mlb/transforms";

import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import Linescore from "@/components/scoreboard/Linescore";
import StatsPanel from "@/components/scoreboard/StatsPanel";
import UpcomingGames from "@/components/cards/UpcomingGames";
import Standings from "@/components/cards/Standings";
import LiveGameCard from "@/components/cards/LiveGameCard";

import styles from "@/styles/scoreboard.module.css";

/** Check if any games in the current list are live */
function hasLiveGamesInData(games: { status: string }[]): boolean {
  return games.some((g) => g.status === "Live");
}

export default function TVPage() {
  const selectedTeam = useTeamStore((s) => s.selectedTeam);

  if (!selectedTeam) {
    return (
      <div
        style={{
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--sb-page-bg, #0a1a0f)",
          fontFamily: "Georgia, serif",
          color: "rgba(232,232,228,0.5)",
          fontSize: "18px",
          letterSpacing: "2px",
          textAlign: "center",
          padding: "40px",
        }}
      >
        Select a team at /scoreboard to get started
      </div>
    );
  }

  return <TVInner selectedTeam={selectedTeam} />;
}

function TVInner({
  selectedTeam,
}: {
  selectedTeam: NonNullable<ReturnType<typeof useTeamStore.getState>["selectedTeam"]>;
}) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const currentYear = new Date().getFullYear();

  // ── Auto-cycling view state ──
  const [activeView, setActiveView] = useState<"my-team" | "around-league">("my-team");
  const cycleTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const VIEW_CYCLE_MS = 20_000; // switch views every 20 seconds

  // ── Wake lock ──
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {}
    }
    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      wakeLockRef.current?.release();
    };
  }, []);

  // ── Fullscreen on first click ──
  const handleFirstClick = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  // ── Auto-cycle between views ──
  useEffect(() => {
    cycleTimerRef.current = setInterval(() => {
      setActiveView((prev) => (prev === "my-team" ? "around-league" : "my-team"));
    }, VIEW_CYCLE_MS);
    return () => clearInterval(cycleTimerRef.current);
  }, []);

  // ── Read from stores ──
  const game = useScoreboardStore((s) => s.game);
  const upcoming = useScheduleStore((s) => s.upcoming);
  const standings = useStandingsStore((s) => s.entries);
  const divisionName = useStandingsStore((s) => s.divisionName);
  const leagueGames = useLeagueStore((s) => s.games);

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

    const myGame = scores.find(
      (g) => g.home.team.id === selectedTeam.id || g.away.team.id === selectedTeam.id
    );
    useScoreboardStore.getState().setGame(myGame ?? null);
  }, [scheduleData, selectedTeam.id]);

  // ── Game feed query (live games only) ──
  const myGamePk = game?.gamePk;
  const myGameStatus = game?.status;

  const { data: feedData } = useQuery({
    queryKey: ["gameFeed", myGamePk],
    queryFn: () => fetchGameFeed(myGamePk!),
    enabled: !!myGamePk && myGameStatus === "Live",
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!feedData || !myGamePk) return;
    useScoreboardStore.getState().setGame(transformGameFeed(feedData, myGamePk));
  }, [feedData, myGamePk]);

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

  // ── Render ──
  return (
    <div
      className={styles.pageBody}
      style={{ minHeight: "100vh", overflow: "hidden" }}
      onClick={handleFirstClick}
    >
      {/* Simple team name header — no interactive TopBar in TV mode */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "0 4px",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "14px",
            color: "rgba(232,232,228,0.6)",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          {selectedTeam.name}
        </span>
      </div>

      {/* Main scoreboard */}
      <ScoreboardSurface className={styles.scoreboard}>
        {game ? (
          <>
            <Linescore game={game} />
            <hr className={styles.boardDivider} />
            <StatsPanel game={game} />
          </>
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

      {/* View container — auto-cycling, no visible toggle */}
      <div className={styles.viewContainer}>
        <div
          className={`${styles.viewMyTeam} ${activeView === "my-team" ? styles.active : ""}`}
        >
          <UpcomingGames games={upcoming} />
          <Standings entries={standings} divisionName={divisionName} />
        </div>
        <div
          className={`${styles.viewAroundLeague} ${activeView === "around-league" ? styles.active : ""}`}
        >
          {leagueGames.map((g) => (
            <LiveGameCard key={g.gamePk} game={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
