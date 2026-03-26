"use client";

/**
 * Audio engine for the split-flap display.
 *
 * Key design decisions to avoid "jet engine" effect:
 * 1. Throttle: minimum 30ms between clack sounds
 * 2. Max concurrent: only 4 audio nodes playing at once
 * 3. Sound design: short noise bursts (not tonal sine waves)
 * 4. Random skip: only ~40% of flip steps actually produce sound
 *    (real split-flap boards have a messy, sparse rattle, not a
 *    perfectly synchronized click on every single flap)
 */

const MAX_CONCURRENT = 4;
const MIN_INTERVAL_MS = 30;
const PLAY_PROBABILITY = 0.35;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private buffers: AudioBuffer[] = [];
  private _initialized = false;
  private _volume = 0.5;
  private _muted = false;
  private activeCount = 0;
  private lastPlayTime = 0;

  get initialized() {
    return this._initialized;
  }

  get currentTime() {
    return this.ctx?.currentTime ?? 0;
  }

  async initialize(): Promise<void> {
    if (this._initialized) return;

    try {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this._muted ? 0 : this._volume;
      this.gainNode.connect(this.ctx.destination);

      // Generate short mechanical impact sounds — mostly noise, minimal tone
      this.buffers = [
        this.generateClack(0.025, 1200, 0.6),  // Very short sharp tick
        this.generateClack(0.030, 900, 0.5),    // Slightly longer tick
        this.generateClack(0.020, 1500, 0.55),  // Quick snap
        this.generateClack(0.035, 700, 0.4),    // Softer settle click
      ];

      this._initialized = true;
    } catch (e) {
      console.warn("Audio initialization failed:", e);
    }
  }

  /**
   * Generate a synthetic mechanical clack.
   * Emphasis on noise burst (impact) with very brief tonal component.
   * Faster decay than before to keep sounds ultra-short.
   */
  private generateClack(
    duration: number,
    frequency: number,
    intensity: number
  ): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;

      // Very fast exponential decay — sound dies within ~15ms
      const envelope = Math.exp(-t * 200) * intensity;

      // Noise is the primary component (mechanical impact sound)
      const noise = (Math.random() * 2 - 1) * 0.7;

      // Very subtle tonal click — just enough for "character"
      const click = Math.sin(2 * Math.PI * frequency * t) * 0.15;

      // High-pass filtered feel: reduce low-freq energy
      const hp = Math.sin(2 * Math.PI * (frequency * 2.5) * t) * 0.1;

      data[i] = (noise + click + hp) * envelope;
    }

    return buffer;
  }

  /**
   * Play a clack sound immediately, with throttling and concurrency limits.
   * Returns true if a sound was actually played.
   */
  playClack(variation?: number): boolean {
    if (!this.ctx || !this.gainNode || this._muted) return false;

    // Throttle: enforce minimum interval between sounds
    const now = performance.now();
    if (now - this.lastPlayTime < MIN_INTERVAL_MS) return false;

    // Concurrency limit
    if (this.activeCount >= MAX_CONCURRENT) return false;

    // Probabilistic skip — real boards don't click on every single flap
    if (Math.random() > PLAY_PROBABILITY) return false;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer =
        this.buffers[(variation ?? Math.floor(Math.random() * this.buffers.length)) % this.buffers.length];

      // Pitch variation for organic feel
      source.playbackRate.value = 0.85 + Math.random() * 0.3;

      source.connect(this.gainNode);
      source.start(this.ctx.currentTime);

      this.activeCount++;
      this.lastPlayTime = now;

      source.onended = () => {
        this.activeCount = Math.max(0, this.activeCount - 1);
      };

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Schedule a clack at a future time (bypasses throttle — use for pre-scheduled).
   */
  scheduleClack(when: number, variation: number = 0): void {
    if (!this.ctx || !this.gainNode || this._muted) return;
    if (this.activeCount >= MAX_CONCURRENT * 2) return;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers[variation % this.buffers.length];
      source.playbackRate.value = 0.85 + Math.random() * 0.3;
      source.connect(this.gainNode);
      source.start(Math.max(when, this.ctx.currentTime));

      this.activeCount++;
      source.onended = () => {
        this.activeCount = Math.max(0, this.activeCount - 1);
      };
    } catch {
      // Ignore
    }
  }

  setVolume(vol: number): void {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && !this._muted) {
      this.gainNode.gain.setTargetAtTime(
        this._volume,
        this.ctx!.currentTime,
        0.01
      );
    }
  }

  setMuted(muted: boolean): void {
    this._muted = muted;
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(
        muted ? 0 : this._volume,
        this.ctx!.currentTime,
        0.01
      );
    }
  }

  get volume() {
    return this._volume;
  }

  get muted() {
    return this._muted;
  }
}

export const audioEngine = new AudioEngine();
