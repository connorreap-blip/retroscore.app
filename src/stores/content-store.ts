"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentItem } from "@/types";
import { QUOTES } from "@/lib/content/quotes";

interface ContentStore {
  queue: ContentItem[];
  currentIndex: number;
  addToQueue: (item: ContentItem) => void;
  removeFromQueue: (id: string) => void;
  nextContent: () => ContentItem;
  resetQueue: () => void;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      queue: QUOTES,
      currentIndex: 0,

      addToQueue: (item) =>
        set((state) => ({ queue: [...state.queue, item] })),

      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((q) => q.id !== id),
        })),

      nextContent: () => {
        const state = get();
        const queue = state.queue.length > 0 ? state.queue : QUOTES;
        const index = state.currentIndex % queue.length;
        set({ currentIndex: index + 1 });
        return queue[index];
      },

      resetQueue: () => set({ queue: QUOTES, currentIndex: 0 }),
    }),
    {
      name: "flappyboards-content",
      partialize: (state) => ({
        queue: state.queue,
        currentIndex: state.currentIndex,
      }),
    }
  )
);
