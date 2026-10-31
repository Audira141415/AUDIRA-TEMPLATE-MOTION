'use client';

import { isAudioInteractionAllowed } from './browser-audio';

export type BGMTrack = 'lofi_chill' | 'news_pulse' | 'retro_arcade' | 'cyber_synth' | 'none';

class BGMEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentTrack: BGMTrack = 'lofi_chill';
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.4;

  public async unlock(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.duckGain = this.ctx.createGain();

        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.duckGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this.duckGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }

    return this.ctx ? this.ctx.state === 'running' : false;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || !isAudioInteractionAllowed()) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.duckGain = this.ctx.createGain();

        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.duckGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this.duckGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx && this.ctx.state === 'running' ? this.ctx : null;
  }

  public setTrack(track: BGMTrack) {
    this.currentTrack = track;
    if (this.isPlaying) {
      this.stop();
      if (track !== 'none') {
        this.start();
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    const ctx = this.getContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    const ctx = this.getContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, ctx.currentTime);
    }
  }

  // Smooth Auto-Ducking when speech is active
  public duck() {
    const ctx = this.getContext();
    if (!ctx || !this.duckGain) return;
    const t = ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(t);
    this.duckGain.gain.linearRampToValueAtTime(0.2, t + 0.15); // Duck to 20%
  }

  // Restore volume when speech pauses
  public unduck() {
    const ctx = this.getContext();
    if (!ctx || !this.duckGain) return;
    const t = ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(t);
    this.duckGain.gain.linearRampToValueAtTime(1.0, t + 0.35); // Restore to 100%
  }

  public start() {
    if (this.currentTrack === 'none' || !isAudioInteractionAllowed()) return;
    const ctx = this.getContext();
    if (!ctx || !this.duckGain) return;

    if (this.isPlaying) this.stop();
    this.isPlaying = true;

    let step = 0;
    const chordProgressions: Record<string, number[][]> = {
      lofi_chill: [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23], // G7
      ],
      news_pulse: [
        [130.81, 196.0, 261.63], // C minor pulse
        [123.47, 185.0, 246.94], // B diminished
        [110.0, 164.81, 220.0],  // A minor
        [116.54, 174.61, 233.08] // Bb
      ],
      retro_arcade: [
        [440, 554.37, 659.25], // A major chiptune
        [329.63, 415.3, 493.88], // E major
        [369.99, 440, 554.37],   // F#m
        [293.66, 369.99, 440],   // D major
      ],
      cyber_synth: [
        [65.41, 130.81, 196.0],  // Low C Cyber drone
        [73.42, 146.83, 220.0],  // D
        [55.0, 110.0, 164.81],   // A
        [61.74, 123.47, 185.0]   // B
      ]
    };

    const playBeat = () => {
      if (!this.isPlaying || !this.ctx || !this.duckGain) return;
      const t = this.ctx.currentTime;
      const chords = chordProgressions[this.currentTrack] || chordProgressions.lofi_chill;
      const currentChord = chords[step % chords.length];

      // Play ambient chord layers
      currentChord.forEach((freq, idx) => {
        try {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = this.currentTrack === 'retro_arcade' ? 'square' : this.currentTrack === 'cyber_synth' ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.04 / (idx + 1), t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

          osc.connect(gain);
          gain.connect(this.duckGain!);

          osc.start(t);
          osc.stop(t + 1.8);
        } catch {
          // ignore
        }
      });

      step++;
    };

    playBeat();
    this.intervalId = setInterval(playBeat, 1800);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const bgmEngine = new BGMEngine();
