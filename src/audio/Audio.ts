/**
 * Klang für Linas kleine Welt – komplett selbst erzeugt mit der Web Audio API
 * (keine Audiodateien): sanfte Musik je nach Stimmung, Umgebungsgeräusche
 * (Vögel, Grillen, Regen, Wellen) und kleine Geräusche fürs Spiel.
 *
 * Startet erst nach der ersten Taste/dem ersten Klick (Browser-Regel).
 * Zeitplanung in echter Zeit (setInterval + AudioContext-Zeit), damit die Musik
 * auch in Hintergrund-Tabs nicht stolpert.
 */
import { composePhrase, midiToHz, type Mood, MOODS, type NoteEvent } from '../core/music';
import type { Voice } from '../data/voices';

export type Sfx =
  | 'kuss'
  | 'schritt'
  | 'schritt-holz'
  | 'aufheben'
  | 'tuer'
  | 'platsch'
  | 'biss'
  | 'fang'
  | 'kescher'
  | 'dialog'
  | 'klick'
  | 'muenzen'
  | 'bauen'
  | 'bellen'
  | 'gackern'
  | 'graben'
  | 'herz'
  | 'post';

/** Musik deutlich hörbar über Umgebung & Geräuschen (vorher ging sie darin unter) */
const MUSIC_GAIN = 2.2;

export type Ambience = { birds: number; crickets: number; rain: number; waves: number };

export class GameAudio {
  private ctx: BaseAudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private ambBus!: GainNode;
  private noise!: AudioBuffer;
  private mood: Mood = 'tag';
  private nextMood: Mood = 'tag';
  private phrase: NoteEvent[] = [];
  private phraseStart = 0;
  private phraseIndex = 0;
  private scheduled = 0;
  private timer: number | null = null;
  private amb: { rain: GainNode; waves: GainNode; birdsLevel: number; cricketsLevel: number } | null = null;
  private ambTarget: Ambience = { birds: 0, crickets: 0, rain: 0, waves: 0 };
  private nextChirp = 0;
  private volumes = { music: 0.6, sfx: 0.8 };
  private seed = Math.floor(Math.random() * 1e6);

  /** Nach der ersten Benutzer-Aktion aufrufen (Browser erlauben Klang erst dann) */
  start() {
    if (this.ctx) {
      if (this.ctx instanceof AudioContext) void this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.setup(new Ctor());
    this.timer = window.setInterval(() => this.tick(), 120);
  }

  /** Hörprobe: rendert `phrases` Phrasen einer Stimmung offline (für Tests & zum Anhören) */
  static async preview(mood: Mood, phrases = 2, ambience?: Ambience): Promise<AudioBuffer> {
    const a = new GameAudio();
    const sec = phrases * 32 * (60 / MOODS[mood].bpm / 2) + 2;
    const ctx = new OfflineAudioContext(2, Math.ceil(44100 * sec), 44100);
    a.setup(ctx);
    a.mood = mood;
    const sd = a.stepDur();
    for (let p = 0; p < phrases; p++) for (const n of composePhrase(mood, 7 + p)) a.playNote(n, 0.1 + p * 32 * sd + n.step * sd, sd);
    if (ambience) {
      a.ambTarget = ambience;
      for (let t = 0.5; t < sec - 1; t += 1.5 + Math.random() * 2) {
        if (ambience.birds > 0) a.bird(t, ambience.birds);
        else if (ambience.crickets > 0) a.cricket(t, ambience.crickets);
      }
    }
    return ctx.startRendering();
  }

  /** Hörprobe Brabbelsprache: spricht `text` offline mit dieser Stimme (wie in der Dialogbox) */
  static async previewVoice(voice: Voice, text: string, every = 3, cps = 55): Promise<AudioBuffer> {
    const a = new GameAudio();
    const chars = [...text];
    const sec = chars.length / cps + 1;
    const ctx = new OfflineAudioContext(2, Math.ceil(44100 * sec), 44100);
    a.setup(ctx, false);
    a.offlineAt = 0;
    chars.forEach((ch, i) => {
      if (i % every !== 0 || !/\p{L}/u.test(ch)) return;
      a.offlineAt = 0.1 + i / cps;
      a.babble(voice, ch);
    });
    return ctx.startRendering();
  }

  /** nur für Offline-Hörproben: Startzeit statt `currentTime` */
  private offlineAt: number | null = null;

  private setup(ctx: BaseAudioContext, ambience = true) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);
    this.musicBus = this.bus(this.volumes.music * MUSIC_GAIN);
    this.sfxBus = this.bus(this.volumes.sfx * 0.7);
    this.ambBus = this.bus(this.volumes.sfx * 0.8);
    // weißes Rauschen (für Regen, Wellen, Schritte, Schlagzeug)
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (ambience) this.startAmbience();
    this.phraseStart = ctx.currentTime + 0.3;
  }

  private bus(vol: number): GainNode {
    const g = (this.ctx as BaseAudioContext).createGain();
    g.gain.value = vol;
    g.connect(this.master);
    return g;
  }

  setVolumes(music: number, sfx: number) {
    this.volumes = { music, sfx };
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(music * MUSIC_GAIN, t, 0.2);
    this.sfxBus.gain.setTargetAtTime(sfx * 0.7, t, 0.1);
    this.ambBus.gain.setTargetAtTime(sfx * 0.8, t, 0.2);
  }

  /** Stimmung wechseln – greift am Ende der aktuellen Phrase */
  setMood(m: Mood) {
    this.nextMood = m;
  }

  setAmbience(a: Ambience) {
    this.ambTarget = a;
  }

  // -------------------------------------------------------------------------
  // Musik
  // -------------------------------------------------------------------------

  private stepDur() {
    return 60 / MOODS[this.mood].bpm / 2;
  }

  private tick() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const ahead = ctx.currentTime + 0.4;
    // neue Phrase?
    if (this.phrase.length === 0 || this.scheduled >= this.phrase.length) {
      const phraseLen = 32 * this.stepDur();
      if (this.phrase.length > 0) this.phraseStart += phraseLen;
      if (this.phraseStart < ctx.currentTime) this.phraseStart = ctx.currentTime + 0.05;
      if (this.phraseStart > ahead) {
        this.updateAmbience();
        return;
      }
      this.mood = this.nextMood;
      this.phrase = composePhrase(this.mood, this.seed + this.phraseIndex++).sort((a, b) => a.step - b.step);
      this.scheduled = 0;
    }
    const sd = this.stepDur();
    while (this.scheduled < this.phrase.length) {
      const n = this.phrase[this.scheduled];
      const t = this.phraseStart + n.step * sd;
      if (t > ahead) break;
      this.playNote(n, t, sd);
      this.scheduled++;
    }
    this.updateAmbience();
  }

  private playNote(n: NoteEvent, t: number, sd: number) {
    const ctx = this.ctx as BaseAudioContext;
    const out = this.musicBus;
    const lead = MOODS[this.mood].lead;
    if (n.voice === 'kick') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      g.gain.setValueAtTime(0.5 * n.vel, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.2);
      return;
    }
    if (n.voice === 'hat') {
      this.noiseBurst(out, t, 0.05, 7000, 0.12 * n.vel, 'highpass');
      return;
    }
    const f = midiToHz(n.midi);
    const dur = n.len * sd;
    if (n.voice === 'pad') {
      // warmes Pad aus zwei leicht verstimmten Oszillatoren …
      const g = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1100;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.07 * n.vel, t + dur * 0.3);
      g.gain.linearRampToValueAtTime(0, t + dur * 1.05);
      for (const detune of [-7, 7]) {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        o.detune.value = detune;
        o.connect(lp);
        o.start(t);
        o.stop(t + dur * 1.1);
      }
      lp.connect(g).connect(out);
      // … plus ein weicher E-Piano-Anschlag am Taktanfang (gemütlicher „Lo-fi“-Akkord)
      this.epiano(out, t, f * 2, 0.09 * n.vel);
      return;
    }
    if (n.voice === 'bass') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22 * n.vel, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dur + 0.05);
      return;
    }
    // Melodie
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = f;
    if (lead === 'floete') {
      o.type = 'sine';
      const vib = ctx.createOscillator();
      const vg = ctx.createGain();
      vib.frequency.value = 5;
      vg.gain.value = f * 0.006;
      vib.connect(vg).connect(o.frequency);
      vib.start(t);
      vib.stop(t + dur + 0.2);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.13 * n.vel, t + 0.06);
      g.gain.linearRampToValueAtTime(0, t + dur + 0.15);
    } else {
      // Marimba / Spieluhr: kurzer Anschlag, langes Ausklingen, ein Oberton
      o.type = lead === 'spieluhr' ? 'triangle' : 'sine';
      const decay = lead === 'spieluhr' ? 1.4 : 0.6;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16 * n.vel, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + decay);
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.frequency.value = f * (lead === 'spieluhr' ? 3 : 4);
      g2.gain.setValueAtTime(0.04 * n.vel, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o2.connect(g2).connect(out);
      o2.start(t);
      o2.stop(t + 0.2);
      o.start(t);
      o.connect(g).connect(out);
      o.stop(t + decay + 0.05);
      return;
    }
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.25);
  }

  /** Weicher E-Piano-Ton: Sinus mit kurzem glockigem Oberton, langes Ausklingen */
  private epiano(out: AudioNode, t: number, f: number, vol: number) {
    const ctx = this.ctx as BaseAudioContext;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    // Glocke: Modulator
    const m = ctx.createOscillator();
    const mg = ctx.createGain();
    m.frequency.value = f * 2;
    mg.gain.setValueAtTime(f * 0.8, t);
    mg.gain.exponentialRampToValueAtTime(1, t + 0.4);
    m.connect(mg).connect(o.frequency);
    o.connect(g).connect(out);
    for (const x of [o, m]) {
      x.start(t);
      x.stop(t + 1.9);
    }
  }

  // -------------------------------------------------------------------------
  // Brabbelsprache
  // -------------------------------------------------------------------------

  /**
   * Eine kleine gesprochene Silbe: Klang durch zwei Formant-Filter (Vokal aus dem Buchstaben),
   * Tonhöhe zufällig um die Stimme herum, kurzer Gleiter. Klingt niedlich & unverständlich.
   */
  babble(voice: Voice, ch: string) {
    const ctx = this.ctx;
    if (!ctx || (this.offlineAt === null && ctx.state !== 'running')) return;
    const t = this.offlineAt ?? ctx.currentTime + 0.005;
    const dur = voice.syllable * (0.85 + Math.random() * 0.3);
    const semis = (Math.random() * 2 - 1) * voice.range;
    const f = voice.pitch * Math.pow(2, semis / 12);
    const [f1, f2] = formantsFor(ch);
    const src = ctx.createOscillator();
    src.type = voice.tone === 'hell' ? 'sawtooth' : 'triangle';
    src.frequency.setValueAtTime(f * 1.04, t);
    src.frequency.exponentialRampToValueAtTime(f * 0.94, t + dur);
    if (voice.vibrato) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = voice.vibrato;
      lg.gain.value = f * 0.03;
      lfo.connect(lg).connect(src.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.02);
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.008);
    g.gain.setValueAtTime(0.5, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    const mix = ctx.createGain();
    mix.gain.value = 1.5;
    for (const [freq, q, lvl] of [[f1, 6, 1], [f2, 9, 0.55]] as const) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = q;
      const lg = ctx.createGain();
      lg.gain.value = lvl;
      src.connect(bp).connect(lg).connect(g);
    }
    // etwas vom Grundton für Wärme
    const dry = ctx.createGain();
    dry.gain.value = voice.pitch < 200 ? 0.45 : 0.25;
    src.connect(dry).connect(g);
    g.connect(mix).connect(this.sfxBus);
    src.start(t);
    src.stop(t + dur + 0.03);
  }

  // -------------------------------------------------------------------------
  // Umgebung
  // -------------------------------------------------------------------------

  private loopNoise(filter: BiquadFilterType, freq: number): GainNode {
    const ctx = this.ctx as BaseAudioContext;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(f).connect(g).connect(this.ambBus);
    src.start();
    return g;
  }

  private startAmbience() {
    const ctx = this.ctx as BaseAudioContext;
    const rain = this.loopNoise('bandpass', 2400);
    const waves = this.loopNoise('lowpass', 500);
    // Wellen: langsames An- und Abschwellen
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    lfo.frequency.value = 0.12;
    lg.gain.value = 0.5;
    const wavesLevel = ctx.createGain();
    wavesLevel.gain.value = 0;
    waves.disconnect();
    waves.gain.value = 0.5;
    lfo.connect(lg).connect(waves.gain);
    waves.connect(wavesLevel).connect(this.ambBus);
    lfo.start();
    this.amb = { rain, waves: wavesLevel, birdsLevel: 0, cricketsLevel: 0 };
  }

  private updateAmbience() {
    const ctx = this.ctx;
    const a = this.amb;
    if (!ctx || !a) return;
    const t = ctx.currentTime;
    a.rain.gain.setTargetAtTime(this.ambTarget.rain * 0.35, t, 1.2);
    a.waves.gain.setTargetAtTime(this.ambTarget.waves * 0.25, t, 1.5);
    a.birdsLevel = this.ambTarget.birds;
    a.cricketsLevel = this.ambTarget.crickets;
    if (t < this.nextChirp) return;
    if (a.birdsLevel > 0.05 && Math.random() < 0.6) this.bird(t, a.birdsLevel);
    else if (a.cricketsLevel > 0.05) this.cricket(t, a.cricketsLevel);
    this.nextChirp = t + 0.8 + Math.random() * 2.5;
  }

  private bird(t: number, level: number) {
    const ctx = this.ctx as BaseAudioContext;
    const base = 2200 + Math.random() * 1600;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const s = t + i * 0.11;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(base, s);
      o.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.4), s + 0.06);
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.05 * level, s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.08);
      o.connect(g).connect(this.ambBus);
      o.start(s);
      o.stop(s + 0.1);
    }
  }

  private cricket(t: number, level: number) {
    const ctx = this.ctx as BaseAudioContext;
    for (let i = 0; i < 3; i++) {
      const s = t + i * 0.07;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 4400;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.012 * level, s + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0005, s + 0.04);
      o.connect(g).connect(this.ambBus);
      o.start(s);
      o.stop(s + 0.05);
    }
  }

  // -------------------------------------------------------------------------
  // Geräusche
  // -------------------------------------------------------------------------

  private noiseBurst(out: AudioNode, t: number, dur: number, freq: number, vol: number, type: BiquadFilterType = 'bandpass') {
    const ctx = this.ctx as BaseAudioContext;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.02);
  }

  private tone(t: number, freq: number, dur: number, vol: number, type: OscillatorType = 'sine', slideTo?: number) {
    const ctx = this.ctx as BaseAudioContext;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  play(s: Sfx) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime + 0.01;
    const out = this.sfxBus;
    switch (s) {
      case 'schritt':
        this.noiseBurst(out, t, 0.07, 900 + Math.random() * 300, 0.18);
        break;
      case 'schritt-holz':
        this.noiseBurst(out, t, 0.05, 1600, 0.12);
        this.tone(t, 180, 0.05, 0.05, 'triangle');
        break;
      case 'aufheben':
        this.tone(t, 880, 0.12, 0.12, 'triangle');
        this.tone(t + 0.07, 1320, 0.18, 0.1, 'triangle');
        break;
      case 'tuer':
        this.tone(t, 220, 0.25, 0.06, 'sawtooth', 160);
        this.noiseBurst(out, t + 0.22, 0.08, 400, 0.25);
        break;
      case 'platsch':
        this.noiseBurst(out, t, 0.35, 700, 0.35);
        this.tone(t, 500, 0.2, 0.05, 'sine', 200);
        break;
      case 'biss':
        this.tone(t, 660, 0.08, 0.12, 'sine', 520);
        this.tone(t + 0.12, 660, 0.08, 0.12, 'sine', 520);
        break;
      case 'fang':
        [523, 659, 784, 1046].forEach((f, i) => this.tone(t + i * 0.08, f, 0.3, 0.12, 'triangle'));
        break;
      case 'kescher':
        this.noiseBurst(out, t, 0.18, 1800, 0.18, 'highpass');
        break;
      case 'dialog':
        this.tone(t, 740 + Math.random() * 120, 0.06, 0.05, 'triangle');
        break;
      case 'klick':
        this.tone(t, 1200, 0.04, 0.06, 'triangle');
        break;
      case 'muenzen':
        [1318, 1568, 1976].forEach((f, i) => this.tone(t + i * 0.06, f, 0.22, 0.08, 'square'));
        break;
      case 'bauen':
        for (let i = 0; i < 3; i++) {
          this.noiseBurst(out, t + i * 0.12, 0.06, 600, 0.3);
          this.tone(t + i * 0.12, 300, 0.06, 0.08, 'square');
        }
        this.tone(t + 0.4, 880, 0.3, 0.1, 'triangle');
        break;
      case 'bellen':
        for (const d of [0, 0.18]) {
          this.tone(t + d, 520, 0.09, 0.14, 'sawtooth', 330);
          this.noiseBurst(out, t + d, 0.06, 1200, 0.1);
        }
        break;
      case 'gackern':
        for (let i = 0; i < 4; i++) this.tone(t + i * 0.09, 700 + (i % 2) * 220, 0.06, 0.08, 'square', 520);
        break;
      case 'graben':
        for (let i = 0; i < 3; i++) this.noiseBurst(out, t + i * 0.15, 0.1, 350, 0.35, 'lowpass');
        break;
      case 'kuss':
        // „Mwah“: kleiner Schmatz (Rauschen) + aufsteigender Ton, dann ein Glöckchen
        this.noiseBurst(out, t, 0.05, 2400, 0.25, 'bandpass');
        this.tone(t + 0.02, 520, 0.16, 0.07, 'sine', 980);
        this.tone(t + 0.22, 1568, 0.4, 0.05, 'sine');
        break;
      case 'herz':
        this.tone(t, 988, 0.2, 0.08, 'sine');
        this.tone(t + 0.1, 1318, 0.35, 0.08, 'sine');
        break;
      case 'post':
        this.tone(t, 1046, 0.25, 0.08, 'triangle');
        this.tone(t + 0.15, 784, 0.35, 0.08, 'triangle');
        break;
    }
  }

  dispose() {
    if (this.timer !== null) window.clearInterval(this.timer);
    if (this.ctx instanceof AudioContext) void this.ctx.close();
    this.ctx = null;
  }
}

/** Grobe Vokal-Formanten (F1, F2) für einen Buchstaben – Konsonanten bekommen einen „passenden“ Vokal */
function formantsFor(ch: string): [number, number] {
  const c = ch.toLowerCase();
  const table: Record<string, [number, number]> = {
    a: [800, 1250],
    e: [480, 1900],
    i: [300, 2300],
    o: [500, 880],
    u: [330, 800],
    ä: [650, 1750],
    ö: [450, 1500],
    ü: [300, 1650],
  };
  if (table[c]) return table[c];
  const vowels = Object.values(table);
  return vowels[(c.codePointAt(0) ?? 0) % vowels.length];
}
