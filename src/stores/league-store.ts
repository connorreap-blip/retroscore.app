"use client";

import { create } from "zustand";
import type { GameScore } from "@/lib/mlb/types";

interface LeagueStore {
  games: GameScore[];
  setGames: (games: GameScore[]) => void;
}

export const useLeagueStore = create<LeagueStore>((set) => ({
  games: [],
  setGames: (games) => set({ games }),
}));
