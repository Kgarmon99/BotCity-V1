// ═══════════════════════════════════════════════════════════════════════
//  BotCity Sound & Music Engine
//  ─────────────────────────────────────────────────────────────────────
//  • SFX: coin, dialog, step, jetpack, rocket (original system)
//  • BGM: generative lo-fi hip-hop that adapts to the player's district
//  • All audio is synthesized in real-time — zero external assets
// ═══════════════════════════════════════════════════════════════════════

type Wave = OscillatorType;

// ── Music Theory Constants ─────────────────────────────────────────────
const TEMPO = 72; // BPM — chill zone
const BEAT = 60 / TEMPO; // seconds per quarter note
const BAR = BEAT * 4;

// C minor / Eb major pentatonic with jazz extensions
// Frequencies for C4 - C5 range (comfortable, not shrill)
const SCALE: number[] = [
  261.63, // C4
  293.66, // D4
  311.13, // Eb4 (blue note)
  349.23, // F4
  392.00, // G4
  415.30, // Ab4 (minor feel)
  466.16, // Bb4
  523.25, // C5
  587.33, // D5
  622.25, // Eb5
  698.46, // F5
];

// Jazz chord voicings (rootless where possible for smoothness)
const CHORDS: number[][][] = [
  // i - VI - III - VII  (Cmin7 - Abmaj7 - Ebmaj7 - Bbmin7)
  [[311.13, 349.23, 392.00, 466.16], [349.23, 415.30, 493.88, 587.33], [311.13, 392.00, 466.16, 523.25], [233.08, 311.13, 349.23, 466.16]],
  // i - iv - VI - V     (Cmin7 - Fmin7 - Abmaj7 - G7)
  [[311.13, 349.23, 392.00, 466.16], [349.23, 392.00, 466.16, 523.25], [349.23, 415.30, 493.88, 587.33], [196.00, 293.66, 349.23, 415.30]],
  // i - VII - VI - V    (Cmin7 - Bbmin7 - Abmaj7 - G7)
  [[311.13, 349.23, 392.00, 466.16], [233.08, 311.13, 349.23, 466.16], [349.23, 415.30, 493.88, 587.33], [196.00, 293.66, 349.23, 415.30]],
];

// Drum pattern: kick on 1, brushed snare on 2+4, hat on every 8th
const DRUM_PATTERNS = [
  { kick: [0, 2.5], snare: [1, 3], hat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] },
  { kick: [0, 1.5, 2.5], snare: [1, 3], hat: [0, 1, 1.5, 2, 2.5, 3, 3.5] },
  { kick: [0, 2], snare: [1, 2.5, 3], hat: [0.5, 1, 1.5, 2, 2.5, 3, 3.5] },
];

// ── Generative Lo-Fi Music Manager ──────────────────────────────────────
class MusicManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicMaster: GainNode | null = null;
  private muted = false;
  private isPlaying = false;
  private nextNoteTime = 0;
  private beatIndex = 0;
  private barIndex = 0;
  private progressionIndex = 0;
  private chordIndex = 0;
  private melodyQueue: Array<{ note: number; duration: number; velocity: number }> = [];
  private currentPattern = 0;
  private patternChangeCounter = 0;
  private scheduleAheadTime = 0.1;
  private lookahead = 25; // ms
  private timerId: ReturnType<typeof setInterval> | null = null;
  // Sustained nodes
  private chordNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;
  private bassNode: { osc: OscillatorNode; gain: GainNode } | null = null;
  private padNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;
  private vinylNode: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  // Sidechain ducking
  private sidechainGain: GainNode | null = null;

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.35; // music at 35% of master
        this.master.connect(this.ctx.destination);
        // Sidechain compressor (ducking on kick)
        this.sidechainGain = this.ctx.createGain();
        this.sidechainGain.gain.value = 1;
        this.sidechainGain.connect(this.master);
        this.musicMaster = this.ctx.createGain();
        this.musicMaster.gain.value = 0;
        this.musicMaster.connect(this.sidechainGain);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) {
      if (this.musicMaster) this.musicMaster.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.5);
      this.stop();
    } else {
      this.start();
      if (this.musicMaster) this.musicMaster.gain.linearRampToValueAtTime(1, this.ctx!.currentTime + 1);
    }
  }

  start() {
    if (this.isPlaying || this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster) return;
    this.isPlaying = true;
    this.nextNoteTime = ctx.currentTime + 0.1;
    this.beatIndex = 0;
    this.barIndex = 0;
    this.startPad();
    this.startVinyl();
    this.schedule();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.stopPad();
    this.stopVinyl();
    this.stopBass();
    this.stopChord();
  }

  // ── Scheduler ────────────────────────────────────────────────────────
  private schedule() {
    if (!this.isPlaying) return;
    const ctx = this.ensure();
    if (!ctx) return;

    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleBeat(this.nextNoteTime);
      this.nextNoteTime += BEAT;
      this.beatIndex = (this.beatIndex + 1) % 4;
      if (this.beatIndex === 0) {
        this.barIndex++;
        if (this.barIndex % 4 === 0) {
          this.chordIndex = (this.chordIndex + 1) % 4;
          if (this.chordIndex === 0) {
            this.progressionIndex = (this.progressionIndex + 1) % CHORDS.length;
          }
          this.scheduleChordChange(this.nextNoteTime);
          this.scheduleBassNote(this.nextNoteTime);
        }
        // Vary drum pattern every 8 bars
        this.patternChangeCounter++;
        if (this.patternChangeCounter % 8 === 0) {
          this.currentPattern = Math.floor(Math.random() * DRUM_PATTERNS.length);
        }
      }
      // Schedule melody notes (generative)
      if (Math.random() < 0.35) {
        this.scheduleMelodyNote(this.nextNoteTime + Math.random() * BEAT * 0.5);
      }
    }

    this.timerId = setTimeout(() => this.schedule(), this.lookahead);
  }

  // ── Drum Kit ─────────────────────────────────────────────────────────
  private scheduleBeat(time: number) {
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster) return;
    const pattern = DRUM_PATTERNS[this.currentPattern];
    const beatInBar = this.beatIndex;
    const subBeat = 0; // for 8th notes we'd need finer granularity

    // Kick
    if (pattern.kick.includes(beatInBar)) {
      this.playKick(ctx, time);
      // Sidechain duck
      if (this.sidechainGain) {
        this.sidechainGain.gain.cancelScheduledValues(time);
        this.sidechainGain.gain.setValueAtTime(1, time);
        this.sidechainGain.gain.exponentialRampToValueAtTime(0.3, time + 0.05);
        this.sidechainGain.gain.exponentialRampToValueAtTime(1, time + 0.25);
      }
    }
    // Snare (brushed — softer)
    if (pattern.snare.includes(beatInBar)) {
      this.playSnare(ctx, time);
    }
    // Hi-hat (every 8th)
    this.playHat(ctx, time);
    this.playHat(ctx, time + BEAT / 2);
  }

  private playKick(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
    g.gain.setValueAtTime(0.45, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(g).connect(this.musicMaster!);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playSnare(ctx: AudioContext, time: number) {
    // Noise burst for brushed snare
    const len = ctx.sampleRate * 0.15;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    src.connect(filter).connect(g).connect(this.musicMaster!);
    src.start(time);
    // Tone body
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 180;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.06, time);
    g2.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(g2).connect(this.musicMaster!);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playHat(ctx: AudioContext, time: number) {
    const len = ctx.sampleRate * 0.03;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    src.connect(filter).connect(g).connect(this.musicMaster!);
    src.start(time);
  }

  // ── Bass ─────────────────────────────────────────────────────────────
  private scheduleBassNote(time: number) {
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster) return;
    this.stopBass();
    const chord = CHORDS[this.progressionIndex][this.chordIndex];
    const root = chord[0]; // Use root of chord
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = root / 2; // One octave down
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.18, time + 0.04);
    g.gain.setValueAtTime(0.18, time + BAR - 0.1);
    g.gain.linearRampToValueAtTime(0, time + BAR);
    osc.connect(g).connect(this.musicMaster);
    osc.start(time);
    osc.stop(time + BAR + 0.05);
    this.bassNode = { osc, gain: g };
  }

  private stopBass() {
    if (this.bassNode) {
      try { this.bassNode.osc.stop(); } catch {}
      this.bassNode = null;
    }
  }

  // ── Chords (Rhodes-ish) ──────────────────────────────────────────────
  private scheduleChordChange(time: number) {
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster) return;
    this.stopChord();
    const chord = CHORDS[this.progressionIndex][this.chordIndex];
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.04, time + 0.3); // slow attack
    g.gain.setValueAtTime(0.04, time + BAR * 3.5);
    g.gain.linearRampToValueAtTime(0, time + BAR * 4);
    const oscs: OscillatorNode[] = [];
    for (const freq of chord) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      // Slight detune for warmth
      osc.detune.value = (Math.random() - 0.5) * 8;
      osc.connect(g).connect(this.musicMaster);
      osc.start(time);
      osc.stop(time + BAR * 4 + 0.1);
      oscs.push(osc);
    }
    this.chordNodes = { oscs, gain: g };
  }

  private stopChord() {
    if (this.chordNodes) {
      for (const osc of this.chordNodes.oscs) {
        try { osc.stop(); } catch {}
      }
      this.chordNodes = null;
    }
  }

  // ── Melody (generative) ──────────────────────────────────────────────
  private scheduleMelodyNote(time: number) {
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster) return;
    const note = SCALE[Math.floor(Math.random() * SCALE.length)];
    const duration = BEAT * (Math.random() < 0.5 ? 0.5 : 1);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = note;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.055, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, time + duration);
    // Subtle vibrato
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start(time);
    lfo.stop(time + duration + 0.1);
    osc.connect(g).connect(this.musicMaster!);
    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  // ── Ambient Pad ──────────────────────────────────────────────────────
  private startPad() {
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster || this.padNodes) return;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 3);
    const oscs: OscillatorNode[] = [];
    // C minor pad: C - Eb - G - Bb (spread across octaves)
    const padNotes = [130.81, 155.56, 196.00, 233.08, 261.63, 311.13];
    for (const freq of padNotes) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 15;
      osc.connect(g).connect(this.musicMaster);
      osc.start();
      oscs.push(osc);
    }
    this.padNodes = { oscs, gain: g };
  }

  private stopPad() {
    if (!this.padNodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.padNodes.gain.gain.cancelScheduledValues(now);
    this.padNodes.gain.gain.setValueAtTime(this.padNodes.gain.gain.value, now);
    this.padNodes.gain.gain.linearRampToValueAtTime(0, now + 1);
    setTimeout(() => {
      for (const osc of this.padNodes!.oscs) {
        try { osc.stop(); } catch {}
      }
      this.padNodes = null;
    }, 1100);
  }

  // ── Vinyl Crackle ────────────────────────────────────────────────────
  private startVinyl() {
    const ctx = this.ensure();
    if (!ctx || !this.musicMaster || this.vinylNode) return;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // Occasional pops + continuous dust
      const pop = Math.random() < 0.001 ? (Math.random() - 0.5) * 0.8 : 0;
      data[i] = (Math.random() * 2 - 1) * 0.04 + pop;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.value = 0.015;
    src.connect(filter).connect(g).connect(this.musicMaster);
    src.start();
    this.vinylNode = { src, gain: g };
  }

  private stopVinyl() {
    if (this.vinylNode) {
      try { this.vinylNode.src.stop(); } catch {}
      this.vinylNode = null;
    }
  }
}

export const music = new MusicManager();

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
  /**
   * Footstep — short low-frequency thud, alternating slightly between
   * left/right via `alt` so consecutive steps don't sound identical.
   * Cheap to call every step (~3Hz walking) — same blip() path everything
   * else uses.
   */
  step(alt: boolean) {
    this.blip(alt ? 165 : 145, 0.045, "triangle", 0.028, alt ? 12 : -12);
  }
}

export const sound = new SoundManager();
