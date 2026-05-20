// Tiny synth-based SFX manager. Generates short tones with the Web Audio API
// so we don't ship any audio assets. Calls are cheap to no-op if the browser
// blocks audio before the first user gesture — AudioContext.resume() is
// attempted on each call so the first interactive click unlocks playback.

type Wave = OscillatorType;

class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  // Pre-generated white-noise buffer shared by all noise-based effects so we
  // don't allocate a new buffer per jetpack press / rocket launch.
  private noiseBuffer: AudioBuffer | null = null;
  // Sustained sound handles — kept around so we can fade/stop them later.
  private ambientNodes: { osc: OscillatorNode[]; gain: GainNode } | null = null;
  private jetpackNodes: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private rocketNodes: { src: AudioBufferSourceNode; osc: OscillatorNode; gain: GainNode } | null = null;

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
      // Restart ambient on unmute in case it was skipped while muted.
      this.startAmbient();
    } else if (!m) {
      // No context yet — try to bring up ambient (and the context) now.
      this.startAmbient();
    }
  }
  isMuted() {
    return this.muted;
  }

  // ── Sustained ambient/effect sounds ────────────────────────────────
  private getNoise(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;
    }
    return this.noiseBuffer;
  }

  /**
   * Start the ambient city hum — three low detuned oscillators forming a
   * faint perpetual drone. Idempotent: subsequent calls no-op while the
   * ambient bed is already running.
   */
  startAmbient() {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.ambientNodes) return;
    const g = ctx.createGain();
    // Short fade-in so the drone doesn't pop on first start.
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.022, now + 0.08);
    g.connect(this.master);
    const oscs: OscillatorNode[] = [];
    // Low-frequency triad: fundamental + perfect fifth + octave, mildly
    // detuned so the beat between them keeps the drone alive.
    const layers: Array<[number, OscillatorType, number]> = [
      [55, "sine", 0],
      [82.5, "sine", 6],
      [110, "triangle", -8],
    ];
    for (const [freq, type, detune] of layers) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(g);
      o.start();
      oscs.push(o);
    }
    this.ambientNodes = { osc: oscs, gain: g };
  }

  /**
   * Toggle the jetpack whoosh — bandpass-filtered white noise that fades
   * in/out instead of cutting hard so quick taps don't click. Calling
   * with the same value back-to-back is a no-op.
   */
  setJetpack(active: boolean) {
    const ctx = this.ensure();
    if (!ctx || !this.master) {
      // Audio is unavailable (e.g. muted). If a previous activation left a
      // live source running, tear it down BEFORE dropping the handle so the
      // node doesn't keep running forever and we can't allocate a duplicate
      // on the next activation. We can still reach the source via the saved
      // refs even when ensure() refuses to vend a context.
      if (this.jetpackNodes) {
        try { this.jetpackNodes.src.stop(); } catch { /* already stopped */ }
        this.jetpackNodes = null;
      }
      return;
    }
    if (active && !this.jetpackNodes) {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoise(ctx);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 0.6;
      const g = ctx.createGain();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.07, now + 0.08);
      src.connect(filter).connect(g).connect(this.master);
      src.start();
      this.jetpackNodes = { src, gain: g };
    } else if (!active && this.jetpackNodes) {
      const { src, gain } = this.jetpackNodes;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.14);
      setTimeout(() => {
        try { src.stop(); } catch { /* already stopped */ }
      }, 200);
      this.jetpackNodes = null;
    }
  }

  /**
   * Set rocket roar intensity (0..1). Lazily creates a low-pass filtered
   * noise bed + sub-bass sawtooth on first call; subsequent calls just
   * ramp the gain. Passing 0 fades out and tears down the nodes.
   */
  setRocket(intensity: number) {
    const t = Math.max(0, Math.min(1, intensity));
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (t > 0.001 && !this.rocketNodes) {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoise(ctx);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      filter.Q.value = 0.5;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 48;
      const g = ctx.createGain();
      g.gain.value = 0;
      src.connect(filter).connect(g);
      osc.connect(g);
      g.connect(this.master);
      src.start();
      osc.start();
      this.rocketNodes = { src, osc, gain: g };
    }
    if (this.rocketNodes) {
      const now = ctx.currentTime;
      const target = t * 0.14;
      this.rocketNodes.gain.gain.cancelScheduledValues(now);
      this.rocketNodes.gain.gain.linearRampToValueAtTime(target, now + 0.12);
      if (t <= 0.001) {
        const { src, osc } = this.rocketNodes;
        this.rocketNodes = null;
        setTimeout(() => {
          try { src.stop(); } catch { /* already stopped */ }
          try { osc.stop(); } catch { /* already stopped */ }
        }, 250);
      }
    }
  }

  /** Dialog open — three-note rising chime (C5-E5-G5 triad). */
  open() {
    this.blip(523, 0.16, "triangle", 0.05);
    setTimeout(() => this.blip(659, 0.16, "triangle", 0.05), 60);
    setTimeout(() => this.blip(784, 0.18, "sine", 0.06), 120);
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
