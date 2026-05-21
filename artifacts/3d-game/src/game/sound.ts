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
  // Current logical jetpack state. Kept separate from `jetpackNodes`
  // because we keep the audio graph alive across toggles; this tracks
  // whether the gain is currently ramping toward the on or off target.
  private jetpackActive = false;
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
      // Force the jet whoosh gain to 0 immediately so the audio graph
      // can't diverge from the logical state while muted — otherwise
      // releasing jet during mute would only flip `jetpackActive`
      // (ensure() returns null when muted) and unmuting could leave a
      // stuck whoosh routed through master.
      if (this.jetpackNodes && this.ctx) {
        const g = this.jetpackNodes.gain.gain;
        g.cancelScheduledValues(this.ctx.currentTime);
        g.setValueAtTime(0, this.ctx.currentTime);
      }
    } else if (this.master) {
      this.master.gain.value = 0.5;
      // Restart ambient on unmute in case it was skipped while muted.
      this.startAmbient();
      // Reconcile jet state: while muted, setJetpack(active) only updated
      // the `jetpackActive` flag without touching gain. Re-apply the
      // current intent now so the whoosh matches whether the player is
      // still holding jet at unmute time.
      if (this.jetpackNodes && this.ctx) {
        const now = this.ctx.currentTime;
        const target = this.jetpackActive ? 0.07 : 0;
        const ramp = this.jetpackActive ? 0.08 : 0.14;
        const g = this.jetpackNodes.gain.gain;
        g.cancelScheduledValues(now);
        g.setValueAtTime(g.value, now);
        g.linearRampToValueAtTime(target, now + ramp);
      }
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
   * in/out instead of cutting hard so quick taps don't click.
   *
   * Implementation: nodes are created LAZILY on the first activation and
   * then kept alive for the lifetime of the audio context. Subsequent
   * calls just ramp the gain. This avoids the bug where rapid press +
   * release within ~200ms would overlap a tearing-down source with a
   * freshly-created one, producing audible double-whooshes or leaked
   * BufferSourceNodes feeding into master.
   *
   * Safe to call every frame — repeat calls with the same value short-
   * circuit via `jetpackActive` and never reschedule the ramp.
   */
  setJetpack(active: boolean) {
    if (active === this.jetpackActive) return; // no-op on repeats
    const ctx = this.ensure();
    if (!ctx || !this.master) {
      // Audio unavailable (muted or context refused). Just track the
      // intent so we don't drift out of sync — next ensure() will see
      // the right state.
      this.jetpackActive = active;
      return;
    }
    if (!this.jetpackNodes) {
      // First-ever activation: build the persistent noise + filter + gain
      // chain. Gain starts at 0 so we can ramp up smoothly below.
      const src = ctx.createBufferSource();
      src.buffer = this.getNoise(ctx);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 0.6;
      const g = ctx.createGain();
      g.gain.value = 0;
      src.connect(filter).connect(g).connect(this.master);
      src.start();
      this.jetpackNodes = { src, gain: g };
    }
    const now = ctx.currentTime;
    const { gain } = this.jetpackNodes;
    const target = active ? 0.07 : 0;
    const rampTime = active ? 0.08 : 0.14;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + rampTime);
    this.jetpackActive = active;
  }

  /**
   * Set rocket roar intensity (0..1). Lazily creates a low-pass filtered
   * noise bed + sub-bass triangle on first call; subsequent calls just
   * ramp the gain. Passing 0 fades out and tears down the nodes.
   *
   * Tuned to read as a distant rumble, not a sub-bass buzz: triangle
   * (not sawtooth) at 70Hz, attenuated before the master bus, with a
   * peak overall gain of ~0.055.
   */
  setRocket(intensity: number) {
    const t = Math.max(0, Math.min(1, intensity));
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (t > 0.001 && !this.rocketNodes) {
      // Noise bed: low-passed white noise gives the "roar" body.
      // We add a SECOND high-shelf cut so the bandpass-y resonance from
      // the sub-bass oscillator's harmonics doesn't ring out as buzz.
      const src = ctx.createBufferSource();
      src.buffer = this.getNoise(ctx);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 380;
      filter.Q.value = 0.4;
      // Sub-bass rumble: TRIANGLE (not sawtooth) at 70Hz. Triangle has
      // far fewer audible harmonics than sawtooth — gives the "deep
      // boom" feel without the harsh metallic buzz that sawtooth+sub
      // produces.  Also keep it considerably quieter than the noise so
      // the body is the noise bed, not the tone.
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = 70;
      const subGain = ctx.createGain();
      subGain.gain.value = 0.35; // attenuate the sub before it hits master
      const g = ctx.createGain();
      g.gain.value = 0;
      src.connect(filter).connect(g);
      osc.connect(subGain).connect(g);
      g.connect(this.master);
      src.start();
      osc.start();
      this.rocketNodes = { src, osc, gain: g };
    }
    if (this.rocketNodes) {
      const now = ctx.currentTime;
      // Lowered peak gain from 0.14 → 0.055 so the rocket reads as
      // "distant rumble" instead of "buzz in your headphones".
      const target = t * 0.055;
      const g = this.rocketNodes.gain.gain;
      // Anchor the current value before ramping so cancelScheduledValues
      // followed by linearRampToValueAtTime always has a valid start
      // point (matches the pattern used in setJetpack).
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(target, now + 0.12);
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
