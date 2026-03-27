"use client";

import { create } from "zustand";
import type { StandingsEntry } from "@/lib/mlb/types";

interface StandingsStore {
  entries: StandingsEntry[];
  divisionName: string;
  setStandings: (entries: StandingsEntry[], divisionName: string) => void;
}

export const useStandingsStore = create<StandingsStore>((set) => ({
  entries: [],
  divisionName: "",
  setStandings: (entries, divisionName) => set({ entries, divisionName }),
}));
