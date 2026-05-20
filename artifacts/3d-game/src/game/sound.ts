// Tiny synth-based SFX manager. Generates short tones with the Web Audio API
// so we don't ship any audio assets. Calls are cheap to no-op if the browser
// blocks audio before the first user gesture — AudioContext.resume() is
// attempted on each call so the first interactive click unlocks playback.

type Wave = OscillatorType;

class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private blip(
    freq: number,
    duration = 0.12,
    type: Wave = "square",
    gain = 0.06,
    detune = 0,
  ) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m && this.ctx && this.master) {
      this.master.gain.value = 0;
    } else if (this.master) {
      this.master.gain.value = 0.5;
    }
  }
  isMuted() {
    return this.muted;
  }

  /** Dialog open — friendly two-note rising chirp. */
  open() {
    this.blip(660, 0.12, "triangle", 0.05);
    setTimeout(() => this.blip(880, 0.11, "triangle", 0.05), 70);
  }
  /** Dialog close — single descending blip. */
  close() {
    this.blip(520, 0.08, "triangle", 0.04);
  }
  /** Money/coin pickup — bright two-note square. */
  coin() {
    this.blip(988, 0.07, "square", 0.05);
    setTimeout(() => this.blip(1318, 0.1, "square", 0.05), 55);
  }
  /** Document collected — soft sine arpeggio. */
  doc() {
    this.blip(523, 0.06, "sine", 0.05);
    setTimeout(() => this.blip(784, 0.09, "sine", 0.05), 50);
  }
  /** "Wrong choice" — short low sawtooth. */
  bad() {
    this.blip(196, 0.18, "sawtooth", 0.05);
  }
  /** Tax filed — triumphant fanfare (C-E-G-C). */
  fanfare() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) =>
      setTimeout(() => this.blip(f, 0.16, "triangle", 0.06), i * 110),
    );
  }
  /** Building approach — soft single pulse. */
  ping() {
    this.blip(880, 0.05, "sine", 0.03);
  }
}

export const sound = new SoundManager();
