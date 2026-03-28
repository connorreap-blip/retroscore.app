"use client";

/**
 * Ballpark ambiance engine — gentle crowd murmur.
 *
 * Three filtered noise layers create a warm, enveloping crowd sound:
 * 1. Deep rumble (very low, like distant crowd roar)
 * 2. Mid murmur (the body of the crowd sound)
 * 3. High chatter (sparse, thin — occasional voices)
 *
 * All heavily filtered and low volume. Should feel like
 * you're sitting in the upper deck on a warm evening.
 */

class BallparkAmbiance {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private swellTimers: ReturnType<typeof setTimeout>[] = [];
  private _playing = false;
  private _volume = 0.25;

  get playing() {
    return this._playing;
  }

  async start(): Promise<void> {
    if (this._playing) return;

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._volume;
    this.masterGain.connect(this.ctx.destination);

    // Layer 1: Deep rumble — very low frequency, heavy
    this.createLayer({
      filterFreq: 120,
      filterQ: 0.3,
      filterType: "lowpass",
      gain: 0.5,
      bufferSeconds: 6,
    });

    // Layer 2: Mid murmur — the main crowd body
    this.createLayer({
      filterFreq: 350,
      filterQ: 0.6,
      filterType: "bandpass",
      gain: 0.25,
      bufferSeconds: 5,
    });

    // Layer 3: Gentle high chatter — thin and quiet
    this.createLayer({
      filterFreq: 1200,
      filterQ: 1.2,
      filterType: "bandpass",
      gain: 0.06,
      bufferSeconds: 4,
    });

    this._playing = true;
  }

  stop(): void {
    this._playing = false;
    this.swellTimers.forEach(clearTimeout);
    this.swellTimers = [];
    this.sources.forEach((s) => { try { s.stop(); } catch {} });
    this.sources = [];
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.masterGain = null;
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this._volume, this.ctx!.currentTime, 0.1);
    }
  }

  private createLayer(opts: {
    filterFreq: number;
    filterQ: number;
    filterType: BiquadFilterType;
    gain: number;
    bufferSeconds: number;
  }) {
    if (!this.ctx || !this.masterGain) return;

    const buffer = this.generateBrownNoise(this.ctx, opts.bufferSeconds);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Primary filter
    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = opts.filterType;
    filter1.frequency.value = opts.filterFreq;
    filter1.Q.value = opts.filterQ;

    // Second pass filter to really tame harshness
    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = "lowpass";
    filter2.frequency.value = Math.min(opts.filterFreq * 3, 2000);
    filter2.Q.value = 0.3;

    const layerGain = this.ctx.createGain();
    layerGain.gain.value = opts.gain;

    source.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(layerGain);
    layerGain.connect(this.masterGain);
    source.start();

    this.sources.push(source);

    // Gentle volume swells on this layer
    this.scheduleSwell(layerGain, opts.gain);
  }

  /** Brown noise: integrated white noise — much warmer than white/pink */
  private generateBrownNoise(ctx: AudioContext, seconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * seconds;
    const buffer = ctx.createBuffer(2, length, sampleRate); // stereo

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        // Tighter integration = darker, warmer noise
        last = (last + 0.015 * white) / 1.015;
        data[i] = last * 3.5;
      }
    }

    return buffer;
  }

  /** Slow, organic volume swells — crowd ebbs and flows */
  private scheduleSwell(gainNode: GainNode, baseGain: number): void {
    if (!this.ctx || !this._playing) return;

    const duration = 10 + Math.random() * 20; // 10-30 second cycles
    const peakMultiplier = 0.8 + Math.random() * 0.5; // 80%-130% of base
    const now = this.ctx.currentTime;

    gainNode.gain.setValueAtTime(baseGain, now);
    gainNode.gain.linearRampToValueAtTime(baseGain * peakMultiplier, now + duration * 0.4);
    gainNode.gain.linearRampToValueAtTime(baseGain, now + duration);

    const timer = setTimeout(() => {
      if (this._playing) this.scheduleSwell(gainNode, baseGain);
    }, duration * 1000);

    this.swellTimers.push(timer);
  }
}

export const ballparkAmbiance = new BallparkAmbiance();
