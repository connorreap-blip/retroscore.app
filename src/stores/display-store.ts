"use client";

import { create } from "zustand";
import type { BoardState } from "@/types";
import { createEmptyBoard } from "@/lib/vestaboard/message-formatter";

interface DisplayStore {
  currentBoard: BoardState;
  targetBoard: BoardState;
  isTransitioning: boolean;
  setCurrentBoard: (board: BoardState) => void;
  setTargetBoard: (board: BoardState) => void;
  setTransitioning: (v: boolean) => void;
}

export const useDisplayStore = create<DisplayStore>((set) => ({
  currentBoard: createEmptyBoard(),
  targetBoard: createEmptyBoard(),
  isTransitioning: false,
  setCurrentBoard: (board) => set({ currentBoard: board }),
  setTargetBoard: (board) => set({ targetBoard: board }),
  setTransitioning: (v) => set({ isTransitioning: v }),
}));
