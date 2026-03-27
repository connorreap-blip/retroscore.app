import type { MlbTeam } from "./types";

function team(
  id: number,
  name: string,
  abbreviation: string,
  division: string,
  league: string,
  primaryColor: string,
  secondaryColor: string
): MlbTeam {
  return {
    id, name, abbreviation, division, league, primaryColor, secondaryColor,
    logoUrl: `https://www.mlb.com/team-logos/${id}.svg`,
  };
}

export const MLB_TEAMS: Record<number, MlbTeam> = {
  // AL East
  110: team(110, "Baltimore Orioles", "BAL", "AL East", "AL", "#df4601", "#000000"),
  111: team(111, "Boston Red Sox", "BOS", "AL East", "AL", "#bd3039", "#0c2340"),
  147: team(147, "New York Yankees", "NYY", "AL East", "AL", "#003087", "#e4002c"),
  139: team(139, "Tampa Bay Rays", "TB", "AL East", "AL", "#092c5c", "#8fbce6"),
  141: team(141, "Toronto Blue Jays", "TOR", "AL East", "AL", "#134a8e", "#1d2d5c"),
  // AL Central
  114: team(114, "Cleveland Guardians", "CLE", "AL Central", "AL", "#00385d", "#e31937"),
  116: team(116, "Detroit Tigers", "DET", "AL Central", "AL", "#0c2340", "#fa4616"),
  118: team(118, "Kansas City Royals", "KC", "AL Central", "AL", "#004687", "#bd9b60"),
  142: team(142, "Minnesota Twins", "MIN", "AL Central", "AL", "#002b5c", "#d31145"),
  145: team(145, "Chicago White Sox", "CWS", "AL Central", "AL", "#27251f", "#c4ced4"),
  // AL West
  117: team(117, "Houston Astros", "HOU", "AL West", "AL", "#002d62", "#eb6e1f"),
  108: team(108, "Los Angeles Angels", "LAA", "AL West", "AL", "#ba0021", "#003263"),
  133: team(133, "Oakland Athletics", "OAK", "AL West", "AL", "#003831", "#efb21e"),
  136: team(136, "Seattle Mariners", "SEA", "AL West", "AL", "#0c2c56", "#005c5c"),
  140: team(140, "Texas Rangers", "TEX", "AL West", "AL", "#003278", "#c0111f"),
  // NL East
  144: team(144, "Atlanta Braves", "ATL", "NL East", "NL", "#ce1141", "#13274f"),
  146: team(146, "Miami Marlins", "MIA", "NL East", "NL", "#00a3e0", "#ef3340"),
  121: team(121, "New York Mets", "NYM", "NL East", "NL", "#002d72", "#ff5910"),
  143: team(143, "Philadelphia Phillies", "PHI", "NL East", "NL", "#e81828", "#002d72"),
  120: team(120, "Washington Nationals", "WSH", "NL East", "NL", "#ab0003", "#14225a"),
  // NL Central
  112: team(112, "Chicago Cubs", "CHC", "NL Central", "NL", "#0e3386", "#cc3433"),
  113: team(113, "Cincinnati Reds", "CIN", "NL Central", "NL", "#c6011f", "#000000"),
  158: team(158, "Milwaukee Brewers", "MIL", "NL Central", "NL", "#ffc52f", "#12284b"),
  134: team(134, "Pittsburgh Pirates", "PIT", "NL Central", "NL", "#27251f", "#fdb827"),
  138: team(138, "St. Louis Cardinals", "STL", "NL Central", "NL", "#c41e3a", "#0c2340"),
  // NL West
  109: team(109, "Arizona Diamondbacks", "ARI", "NL West", "NL", "#a71930", "#e3d4ad"),
  115: team(115, "Colorado Rockies", "COL", "NL West", "NL", "#333366", "#c4ced4"),
  119: team(119, "Los Angeles Dodgers", "LAD", "NL West", "NL", "#005a9c", "#ef3e42"),
  135: team(135, "San Diego Padres", "SD", "NL West", "NL", "#2f241d", "#ffc425"),
  137: team(137, "San Francisco Giants", "SF", "NL West", "NL", "#fd5a1e", "#27251f"),
};

export function getTeam(id: number): MlbTeam {
  return MLB_TEAMS[id] ?? {
    id, name: `Team ${id}`, abbreviation: "???", division: "Unknown",
    league: "Unknown", primaryColor: "#333333", secondaryColor: "#666666", logoUrl: "",
  };
}

export function allTeams(): MlbTeam[] {
  return Object.values(MLB_TEAMS).sort((a, b) => a.name.localeCompare(b.name));
}

export function teamsByDivision(division: string): MlbTeam[] {
  return Object.values(MLB_TEAMS).filter((t) => t.division === division);
}
