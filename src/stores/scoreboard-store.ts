"use client";

import { create } from "zustand";
import type { GameScore } from "@/lib/mlb/types";

interface ScoreboardStore {
  game: GameScore | null;
  setGame: (game: GameScore | null) => void;
}

export const useScoreboardStore = create<ScoreboardStore>((set) => ({
  game: null,
  setGame: (game) => set({ game }),
}));
