import type { MlbTeam } from "@/lib/mlb/types";

interface TeamLogoProps {
  team: MlbTeam;
  size?: number;
}

export default function TeamLogo({ team, size = 26 }: TeamLogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: team.primaryColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.3,
        fontWeight: "bold",
        letterSpacing: "0.5px",
        color: "#fff",
        border: "1.5px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}
    >
      {team.abbreviation}
    </div>
  );
}
