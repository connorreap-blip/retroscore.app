const BASE = "https://statsapi.mlb.com/api/v1";

async function mlbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`MLB API ${res.status}: ${path}`);
  return res.json();
}

/** All games for a date with inline linescore data */
export function fetchSchedule(date: string) {
  return mlbFetch<MlbScheduleResponse>(
    `/schedule?sportId=1&date=${date}&hydrate=linescore,team`
  );
}

/** Full live feed for a specific game */
export function fetchGameFeed(gamePk: number) {
  return mlbFetch<MlbGameFeedResponse>(
    `/game/${gamePk}/feed/live`
  );
}

/** Upcoming games for a team over a date range */
export function fetchTeamSchedule(teamId: number, startDate: string, endDate: string) {
  return mlbFetch<MlbScheduleResponse>(
    `/schedule?sportId=1&teamId=${teamId}&startDate=${startDate}&endDate=${endDate}`
  );
}

/** Division standings for a season */
export function fetchStandings(season: number) {
  return mlbFetch<MlbStandingsResponse>(
    `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason`
  );
}

/** Team roster/metadata (cached on mount) */
export function fetchTeams(season: number) {
  return mlbFetch<MlbTeamsResponse>(
    `/teams?sportId=1&season=${season}`
  );
}

// ── Raw API response shapes (minimal, what we actually read) ──

export interface MlbScheduleResponse {
  dates: Array<{
    date: string;
    games: Array<{
      gamePk: number;
      gameDate: string;
      status: { abstractGameState: string; detailedState: string };
      teams: {
        away: { team: { id: number; name: string } };
        home: { team: { id: number; name: string } };
      };
      linescore?: {
        currentInning?: number;
        inningHalf?: string;
        innings?: Array<{
          num: number;
          home?: { runs?: number; hits?: number; errors?: number };
          away?: { runs?: number; hits?: number; errors?: number };
        }>;
        teams?: {
          home?: { runs?: number; hits?: number; errors?: number };
          away?: { runs?: number; hits?: number; errors?: number };
        };
        balls?: number;
        strikes?: number;
        outs?: number;
      };
    }>;
  }>;
}

export interface MlbGameFeedResponse {
  gameData: {
    status: { abstractGameState: string; detailedState: string };
    teams: {
      away: { id: number; name: string };
      home: { id: number; name: string };
    };
  };
  liveData: {
    linescore: {
      currentInning: number;
      inningHalf: string;
      innings: Array<{
        num: number;
        home?: { runs?: number; hits?: number; errors?: number };
        away?: { runs?: number; hits?: number; errors?: number };
      }>;
      teams: {
        home: { runs?: number; hits?: number; errors?: number };
        away: { runs?: number; hits?: number; errors?: number };
      };
      balls: number;
      strikes: number;
      outs: number;
    };
    plays: {
      currentPlay?: {
        matchup?: { batter?: { id: number } };
      };
    };
  };
}

export interface MlbStandingsResponse {
  records: Array<{
    division: { id: number; name: string };
    teamRecords: Array<{
      team: { id: number; name: string };
      wins: number;
      losses: number;
      gamesBack: string;
      divisionRank: string;
    }>;
  }>;
}

export interface MlbTeamsResponse {
  teams: Array<{
    id: number;
    name: string;
    abbreviation: string;
    division: { id: number; name: string };
    league: { id: number; name: string };
  }>;
}
