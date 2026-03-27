"use client";

import { create } from "zustand";
import type { ScheduleGame } from "@/lib/mlb/types";

interface ScheduleStore {
  upcoming: ScheduleGame[];
  setUpcoming: (games: ScheduleGame[]) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  upcoming: [],
  setUpcoming: (upcoming) => set({ upcoming }),
}));
