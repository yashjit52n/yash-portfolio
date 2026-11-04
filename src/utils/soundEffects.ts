/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Procedural Web Audio Sound Effects for interactive UI elements.
 * Generates subtle, non-intrusive micro-tones on hover and crisp tactile clicks.
 * Zero external audio assets (no 404s, works offline, sub-millisecond response).
 */

class SoundEffectsController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastHoverTime: number = 0;

  constructor() {
    try {
      const saved = localStorage.getItem('yj_sound_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch {
      this.muted = false;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem('yj_sound_muted', String(muted));
    } catch {
      // ignore
    }
  }

  public toggleMuted(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    if (!next) {
      this.playClick();
    }
    return next;
  }

  /**
   * Subtle, soft micro-tone chime on hovering buttons & cards.
   * Debounced to 60ms to prevent audio clutter when moving mouse rapidly.
   */
  public playHover(): void {
    if (this.muted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTime < 60) return;
    this.lastHoverTime = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Subtle high-tech upward micro-glide (540Hz to 680Hz)
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.045);

      // Low, comfortable volume: starts quiet, peaks at 0.018, soft decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Crisp, subtle tactile mechanical click on pressing interactive buttons.
   */
  public playClick(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary crisp impulse
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      osc2.frequency.setValueAtTime(840, now);
      osc2.frequency.exponentialRampToValueAtTime(420, now + 0.035);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.06);
      osc2.stop(now + 0.06);
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Shimmering tone on theme toggle
   */
  public playThemeSwitch(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio catch
    }
  }
}

export const soundEffects = new SoundEffectsController();
