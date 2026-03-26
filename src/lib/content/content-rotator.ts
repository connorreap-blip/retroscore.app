import type { ContentItem } from "@/types";

/**
 * Simple content rotation manager.
 * Cycles through a queue of content items.
 */
export class ContentRotator {
  private queue: ContentItem[];
  private index: number;

  constructor(items: ContentItem[]) {
    this.queue = [...items];
    this.index = 0;
    this.shuffle();
  }

  /** Fisher-Yates shuffle for variety */
  private shuffle() {
    for (let i = this.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
  }

  next(): ContentItem {
    if (this.index >= this.queue.length) {
      this.index = 0;
      this.shuffle();
    }
    return this.queue[this.index++];
  }

  setQueue(items: ContentItem[]) {
    this.queue = [...items];
    this.index = 0;
    this.shuffle();
  }
}
