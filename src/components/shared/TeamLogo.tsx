import type { MlbTeam } from "@/lib/mlb/types";

interface TeamLogoProps {
  team: MlbTeam;
  size?: number;
}

export default function TeamLogo({ team, size = 26 }: TeamLogoProps) {
  return (
    <img
      src={`https://www.mlbstatic.com/team-logos/team-cap-on-dark/${team.id}.svg`}
      alt={team.abbreviation}
      width={size}
      height={size}
      style={{
        flexShrink: 0,
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
      }}
    />
  );
}
