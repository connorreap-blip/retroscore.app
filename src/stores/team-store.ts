"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MlbTeam } from "@/lib/mlb/types";

interface TeamStore {
  selectedTeam: MlbTeam | null;
  setSelectedTeam: (team: MlbTeam) => void;
  clearTeam: () => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      selectedTeam: null,
      setSelectedTeam: (team) => set({ selectedTeam: team }),
      clearTeam: () => set({ selectedTeam: null }),
    }),
    { name: "retro-scoreboard-team" }
  )
);
