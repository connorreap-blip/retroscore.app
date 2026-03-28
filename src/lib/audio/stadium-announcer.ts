"use client";

/**
 * Stadium announcer using Web Speech API.
 *
 * Announces batter coming to the plate with classic
 * ballpark PA style. Uses the deepest available voice
 * with slow rate and low pitch for gravitas.
 */

const ANNOUNCEMENTS = [
  (name: string, number: string) =>
    `Now batting, number ${number}, ${name}`,
  (name: string, number: string) =>
    `Coming to the plate, number ${number}, ${name}`,
  (name: string, _number: string) =>
    `Now batting, ${name}`,
  (name: string, number: string) =>
    `Your attention please. Now batting, number ${number}, ${name}`,
];

class StadiumAnnouncer {
  private _enabled = false;
  private lastAnnounced = "";
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private lastAnnouncedAt = 0;
  private voice: SpeechSynthesisVoice | null = null;
  private voiceReady = false;

  private static MIN_INTERVAL_MS = 5000; // Don't announce more often than every 5s

  get enabled() {
    return this._enabled;
  }

  enable(): void {
    this._enabled = true;
    this.lastAnnounced = ""; // Reset so first batter after enable gets announced
    this.loadVoice();
  }

  disable(): void {
    this._enabled = false;
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  /** Announce a batter — debounced, deduplicated, rate-limited */
  announceBatter(fullName: string | undefined): void {
    if (!this._enabled || !fullName) return;
    if (fullName === this.lastAnnounced) return;

    // Cancel any pending announcement (prevents duplicates from rapid updates)
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }

    // Rate limit — don't announce if we just announced
    const now = Date.now();
    const timeSinceLast = now - this.lastAnnouncedAt;
    const delay = Math.max(1200, StadiumAnnouncer.MIN_INTERVAL_MS - timeSinceLast);

    this.pendingTimer = setTimeout(() => {
      this.pendingTimer = null;
      // Re-check the name hasn't changed during the delay
      if (!this._enabled) return;
      this.lastAnnounced = fullName;
      this.lastAnnouncedAt = Date.now();
      this.speak(fullName);
    }, delay);
  }

  private speak(fullName: string): void {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    // Pick a random announcement template
    const template = ANNOUNCEMENTS[Math.floor(Math.random() * ANNOUNCEMENTS.length)];
    const text = template(fullName, "");

    // Clean up — remove "number ," if we don't have a number
    const cleaned = text.replace(/number\s*,\s*,?\s*/i, "").replace(/\s+/g, " ");

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 0.82;
    utterance.pitch = 0.7;
    utterance.volume = 0.6;

    if (this.voice) {
      utterance.voice = this.voice;
    }

    speechSynthesis.speak(utterance);
  }

  private loadVoice(): void {
    if (this.voiceReady) return;
    if (!("speechSynthesis" in window)) return;

    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      if (!voices.length) return;

      // Prefer deep male English voices
      const preferred = [
        "Daniel", "Aaron", "Fred", "Alex", "Tom",
        "Google US English", "Microsoft David",
      ];

      for (const name of preferred) {
        const match = voices.find(
          (v) => v.name.includes(name) && v.lang.startsWith("en")
        );
        if (match) {
          this.voice = match;
          this.voiceReady = true;
          return;
        }
      }

      // Fallback: any English voice
      const english = voices.find((v) => v.lang.startsWith("en"));
      if (english) {
        this.voice = english;
        this.voiceReady = true;
      }
    };

    pickVoice();

    // Voices may load async in some browsers
    if (!this.voiceReady) {
      speechSynthesis.addEventListener("voiceschanged", pickVoice, { once: true });
    }
  }
}

export const stadiumAnnouncer = new StadiumAnnouncer();
