import type { GameScore, ScheduleGame, StandingsEntry, LinescoreInning } from "./types";
import type { MlbScheduleResponse, MlbGameFeedResponse, MlbStandingsResponse } from "./api";
import { getTeam } from "./teams";

/** Extract all games from a schedule response into GameScore[] */
export function transformScheduleToScores(res: MlbScheduleResponse): GameScore[] {
  if (!res.dates?.length) return [];
  return res.dates.flatMap((d) =>
    d.games.map((g) => {
      const ls = g.linescore;
      return {
        gamePk: g.gamePk,
        status: normalizeStatus(g.status.abstractGameState),
        detailedState: g.status.detailedState,
        gameDate: g.gameDate,
        inning: ls?.currentInning ?? 0,
        inningHalf: ls?.inningHalf === "Bottom" ? "Bottom" as const : "Top" as const,
        away: {
          team: getTeam(g.teams.away.team.id),
          runs: ls?.teams?.away?.runs ?? 0,
          hits: ls?.teams?.away?.hits ?? 0,
          errors: ls?.teams?.away?.errors ?? 0,
          probablePitcher: g.teams.away.probablePitcher?.fullName,
        },
        home: {
          team: getTeam(g.teams.home.team.id),
          runs: ls?.teams?.home?.runs ?? 0,
          hits: ls?.teams?.home?.hits ?? 0,
          errors: ls?.teams?.home?.errors ?? 0,
          probablePitcher: g.teams.home.probablePitcher?.fullName,
        },
        innings: (ls?.innings ?? []).map(transformInning),
        count: { balls: ls?.balls ?? 0, strikes: ls?.strikes ?? 0, outs: ls?.outs ?? 0 },
        venue: g.venue?.name,
      };
    })
  );
}

/** Transform a live game feed into a GameScore */
export function transformGameFeed(res: MlbGameFeedResponse, gamePk: number): GameScore {
  const ls = res.liveData.linescore;
  return {
    gamePk,
    status: normalizeStatus(res.gameData.status.abstractGameState),
    detailedState: res.gameData.status.detailedState,
    gameDate: "",
    inning: ls.currentInning,
    inningHalf: ls.inningHalf === "Bottom" ? "Bottom" as const : "Top" as const,
    away: {
      team: getTeam(res.gameData.teams.away.id),
      runs: ls.teams.away.runs ?? 0,
      hits: ls.teams.away.hits ?? 0,
      errors: ls.teams.away.errors ?? 0,
    },
    home: {
      team: getTeam(res.gameData.teams.home.id),
      runs: ls.teams.home.runs ?? 0,
      hits: ls.teams.home.hits ?? 0,
      errors: ls.teams.home.errors ?? 0,
    },
    innings: ls.innings.map(transformInning),
    count: { balls: ls.balls, strikes: ls.strikes, outs: ls.outs },
    atBatName: res.liveData.plays.currentPlay?.matchup?.batter?.fullName,
  };
}

/** Transform schedule response into upcoming ScheduleGame[] */
export function transformScheduleToUpcoming(res: MlbScheduleResponse): ScheduleGame[] {
  if (!res.dates?.length) return [];
  return res.dates.flatMap((d) =>
    d.games.map((g) => ({
      gamePk: g.gamePk,
      date: d.date,
      time: new Date(g.gameDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }) + " ET",
      away: getTeam(g.teams.away.team.id),
      home: getTeam(g.teams.home.team.id),
    }))
  );
}

/** Map short division names ("AL East") to API names ("American League East") */
function expandDivision(short: string): string {
  return short
    .replace("AL ", "American League ")
    .replace("NL ", "National League ");
}

/** Transform standings response, filtered to a division */
export function transformStandings(res: MlbStandingsResponse, divisionName: string): StandingsEntry[] {
  const expanded = expandDivision(divisionName);
  const division = res.records.find((r) => r.division?.name === expanded);
  if (!division) return [];
  return division.teamRecords
    .sort((a, b) => Number(a.divisionRank) - Number(b.divisionRank))
    .map((tr) => ({
      rank: Number(tr.divisionRank),
      team: getTeam(tr.team.id),
      wins: tr.wins,
      losses: tr.losses,
      gamesBehind: tr.gamesBack === "-" ? "—" : tr.gamesBack,
    }));
}

function transformInning(inn: {
  num: number;
  home?: { runs?: number; hits?: number; errors?: number };
  away?: { runs?: number; hits?: number; errors?: number };
}): LinescoreInning {
  return {
    num: inn.num,
    home: inn.home ? { runs: inn.home.runs ?? 0, hits: inn.home.hits ?? 0, errors: inn.home.errors ?? 0 } : undefined,
    away: inn.away ? { runs: inn.away.runs ?? 0, hits: inn.away.hits ?? 0, errors: inn.away.errors ?? 0 } : undefined,
  };
}

function normalizeStatus(s: string): "Preview" | "Live" | "Final" {
  if (s === "Live" || s === "In Progress") return "Live";
  if (s === "Final") return "Final";
  return "Preview";
}
