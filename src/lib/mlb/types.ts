/** Core team identity */
export interface MlbTeam {
  id: number;
  name: string;
  abbreviation: string;
  division: string;
  league: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

/** Single half-inning in a linescore */
export interface LinescoreInning {
  num: number;
  home?: { runs: number; hits: number; errors: number };
  away?: { runs: number; hits: number; errors: number };
}

/** Normalized game score for UI consumption */
export interface GameScore {
  gamePk: number;
  status: "Preview" | "Live" | "Final";
  detailedState: string;
  gameDate: string;
  inning: number;
  inningHalf: "Top" | "Bottom";
  away: { team: MlbTeam; runs: number; hits: number; errors: number; probablePitcher?: string };
  home: { team: MlbTeam; runs: number; hits: number; errors: number; probablePitcher?: string };
  innings: LinescoreInning[];
  count: { balls: number; strikes: number; outs: number };
  venue?: string;
  atBatName?: string;
}

/** Upcoming game for schedule display */
export interface ScheduleGame {
  gamePk: number;
  date: string;
  time: string;
  away: MlbTeam;
  home: MlbTeam;
}

/** Single row in standings table */
export interface StandingsEntry {
  rank: number;
  team: MlbTeam;
  wins: number;
  losses: number;
  gamesBehind: string;
}
