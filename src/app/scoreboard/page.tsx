"use client";

import { useState, useEffect, useMemo } from "react";
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

import TopBar from "@/components/layout/TopBar";
import ViewToggle from "@/components/layout/ViewToggle";
import ScoreboardSurface from "@/components/scoreboard/ScoreboardSurface";
import Linescore from "@/components/scoreboard/Linescore";
import StatsPanel from "@/components/scoreboard/StatsPanel";
import UpcomingGames from "@/components/cards/UpcomingGames";
import Standings from "@/components/cards/Standings";
import LiveGameCard from "@/components/cards/LiveGameCard";
import TeamPicker from "@/components/settings/TeamPicker";

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
    <div className={styles.pageBody}>
      <TopBar team={selectedTeam} onSettingsClick={() => setShowPicker(true)} />

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
        >
          {leagueGames.map((g) => (
            <LiveGameCard key={g.gamePk} game={g} />
          ))}
        </div>
      </div>

      {/* Team picker overlay */}
      {showPicker && <TeamPicker onClose={() => setShowPicker(false)} />}
    </div>
  );
}

/** Check if any games in the current list are live */
function hasLiveGamesInData(games: { status: string }[]): boolean {
  return games.some((g) => g.status === "Live");
}
