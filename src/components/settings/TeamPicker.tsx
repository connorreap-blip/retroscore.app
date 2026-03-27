"use client";

import { allTeams } from "@/lib/mlb/teams";
import { useTeamStore } from "@/stores/team-store";
import TeamLogo from "@/components/shared/TeamLogo";
import type { MlbTeam } from "@/lib/mlb/types";

interface TeamPickerProps {
  onClose: () => void;
}

export default function TeamPicker({ onClose }: TeamPickerProps) {
  function handleSelect(team: MlbTeam) {
    useTeamStore.getState().setSelectedTeam(team);
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--sb-board-bg, #1a1f1a)",
          border: "6px solid #ddd",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.6)",
          padding: "36px 40px",
          maxWidth: 700,
          width: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            fontFamily: "'Impact', 'Arial Narrow', 'Helvetica Neue', sans-serif",
            fontSize: 22,
            letterSpacing: 6,
            color: "rgba(232,232,228,0.7)",
            textAlign: "center",
            marginBottom: 28,
            marginTop: 0,
          }}
        >
          SELECT YOUR TEAM
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}
        >
          {allTeams().map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(232,232,228,0.12)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 8px",
                borderRadius: 4,
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(232,232,228,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(232,232,228,0.12)";
              }}
            >
              <TeamLogo team={team} size={48} />
              <span
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 10,
                  color: "rgba(232,232,228,0.45)",
                  letterSpacing: 1,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {team.abbreviation}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
