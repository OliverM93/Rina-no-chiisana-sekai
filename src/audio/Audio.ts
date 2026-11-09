/**
 * Klang für Linas kleine Welt – komplett selbst erzeugt mit der Web Audio API
 * (keine Audiodateien): sanfte Musik je nach Stimmung, Umgebungsgeräusche
 * (Vögel, Grillen, Regen, Wellen) und kleine Geräusche fürs Spiel.
 *
 * Startet erst nach der ersten Taste/dem ersten Klick (Browser-Regel).
 * Zeitplanung in echter Zeit (setInterval + AudioContext-Zeit), damit die Musik
 * auch in Hintergrund-Tabs nicht stolpert.
 */
import { composeSection, FORM, midiToHz, type Lead, type Mood, MOODS, type NoteEvent, pickTheme, sectionSteps } from '../core/music';
import type { Season } from '../core/time';
import { BABBLE_EVERY, type Voice } from '../data/voices';
import { syllableAt, type Syllable } from '../core/babble';

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
  | 'foto'
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
  /** Das Lied, das gerade gespielt wird (ein Thema aus der Familie von `family`) */
  private mood: Mood = 'tag';
  /** Das Thema, zu dem das laufende Lied gehört (Tageszeit/Wetter/Ort) */
  private family: Mood = 'tag';
  private nextMood: Mood = 'tag';
  private season: Season | undefined;
  private phrase: NoteEvent[] = [];
  private phraseStart = 0;
  private phraseEnd = 0;
  private sectionIndex = 0;
  private scheduled = 0;
  /** Stimmung, für die der laufende Abschnitt schon gekürzt wurde (Wechsel am nächsten Takt) */
  private cutFor: Mood | null = null;
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
    const sd = 60 / MOODS[mood].bpm / 2;
    const sec = phrases * sectionSteps(mood) * sd + 2.5;
    const ctx = new OfflineAudioContext(2, Math.ceil(44100 * sec), 44100);
    a.setup(ctx);
    a.mood = mood;
    for (let p = 0; p < phrases; p++) {
      const start = 0.1 + p * sectionSteps(mood) * sd;
      for (const n of composeSection(mood, 7, FORM[p % FORM.length])) a.playNote(n, start + a.stepTime(n.step, sd), sd);
    }
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
  static async previewVoice(voice: Voice, text: string, every = BABBLE_EVERY, cps = 40): Promise<AudioBuffer> {
    const a = new GameAudio();
    const chars = [...text];
    const sec = chars.length / cps + 1;
    const ctx = new OfflineAudioContext(2, Math.ceil(44100 * sec), 44100);
    a.setup(ctx, false);
    a.offlineAt = 0;
    chars.forEach((ch, i) => {
      if (i % every !== 0 || !/\p{L}/u.test(ch)) return;
      a.offlineAt = 0.1 + i / cps;
      a.babble(voice, syllableAt(text, i, every));
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
    this.phraseEnd = this.phraseStart;
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
  setMood(m: Mood, season?: Season) {
    this.nextMood = m;
    this.season = season;
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

  /** Startzeit einer Achtel im Abschnitt (mit Swing) */
  private stepTime(step: number, sd: number): number {
    return step * sd + (step % 2 === 1 ? MOODS[this.mood].swing * sd : 0);
  }

  private tick() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const ahead = now + 0.4;
    // Ortswechsel: laufenden Abschnitt am nächsten Taktende beenden statt bis zu 20 s zu warten
    if (this.phrase.length > 0 && this.nextMood !== this.family && this.cutFor !== this.nextMood) {
      this.cutFor = this.nextMood;
      const sd = this.stepDur();
      const barSteps = MOODS[this.mood].beats;
      const bar = Math.max(1, Math.ceil((ahead - this.phraseStart) / (barSteps * sd)));
      const cutStep = bar * barSteps;
      if (cutStep * sd < this.phraseEnd - this.phraseStart) {
        this.phrase = this.phrase.filter((n, i) => i < this.scheduled || n.step < cutStep);
        this.phraseEnd = this.phraseStart + cutStep * sd;
      }
    }
    for (let guard = 0; guard < 4; guard++) {
      const sd = this.stepDur();
      while (this.scheduled < this.phrase.length) {
        const n = this.phrase[this.scheduled];
        const t = this.phraseStart + this.stepTime(n.step, sd);
        if (t > ahead) break;
        if (t >= now - 0.05) this.playNote(n, Math.max(t, now), sd);
        this.scheduled++;
      }
      // nächster Abschnitt erst, wenn der laufende zu Ende ist (sonst rutscht die Startzeit weg)
      if (this.scheduled < this.phrase.length || this.phraseEnd > ahead) break;
      const start = Math.max(this.phraseEnd, now + 0.05);
      if (this.family !== this.nextMood) this.sectionIndex = Math.ceil(this.sectionIndex / FORM.length) * FORM.length; // neues Lied
      this.family = this.nextMood;
      this.cutFor = null;
      const song = Math.floor(this.sectionIndex / FORM.length);
      const part = FORM[this.sectionIndex % FORM.length];
      // Zu Beginn jedes Liedes kommt reihum das nächste Thema der Familie dran – so wiederholt sich draußen nichts
      if (this.sectionIndex % FORM.length === 0) this.mood = pickTheme(this.family, song, this.seed, this.season);
      this.sectionIndex++;
      this.phrase = composeSection(this.mood, this.seed + song * 13, part);
      this.phraseStart = start;
      this.phraseEnd = start + sectionSteps(this.mood) * this.stepDur();
      this.scheduled = 0;
    }
    this.updateAmbience();
  }

  private playNote(n: NoteEvent, t: number, sd: number) {
    const ctx = this.ctx as BaseAudioContext;
    const out = this.musicBus;
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
    if (n.voice === 'besen') {
      // Jazzbesen: weiches, kurzes Wischen
      this.noiseBurst(out, t, 0.09, 4200, 0.05 * n.vel, 'bandpass');
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
    if (n.voice === 'arp') {
      this.epiano(out, t, f * 2, 0.07 * n.vel, 0.9);
      return;
    }
    if (n.voice === 'chord') {
      const inst = MOODS[this.mood].accomp === 'walzer' ? 'akkordeon' : 'zupf';
      if (inst === 'zupf') this.pluck(out, t, f * 2, 0.11 * n.vel);
      else this.reed(out, t, f, Math.min(dur, sd * 1.2), 0.038 * n.vel);
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
    this.lead(n.inst ?? MOODS[this.mood].lead, out, t, f, dur, n.vel);
  }

  /** Melodie-Instrumente */
  private lead(inst: Lead, out: AudioNode, t: number, f: number, dur: number, vel: number) {
    const ctx = this.ctx as BaseAudioContext;
    if (inst === 'epiano') return this.epiano(out, t, f, 0.17 * vel, 1.6);
    if (inst === 'zupf') return this.pluck(out, t, f, 0.2 * vel);
    if (inst === 'akkordeon') return this.reed(out, t, f, dur, 0.075 * vel, true);
    if (inst === 'glocke') {
      // Vibraphon/Glocke: Sinus + unharmonischer Oberton, sanftes Tremolo
      for (const [mul, lvl, dec] of [[1, 0.15, 2.2], [4.0, 0.035, 0.5], [2.76, 0.02, 0.8]] as const) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = f * mul;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(lvl * vel, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.001, t + dec);
        o.connect(g).connect(out);
        o.start(t);
        o.stop(t + dec + 0.05);
      }
      return;
    }
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = f;
    if (inst === 'floete') {
      o.type = 'sine';
      const vib = ctx.createOscillator();
      const vg = ctx.createGain();
      vib.frequency.value = 5;
      vg.gain.setValueAtTime(0, t);
      vg.gain.linearRampToValueAtTime(f * 0.007, t + 0.25);
      vib.connect(vg).connect(o.frequency);
      vib.start(t);
      vib.stop(t + dur + 0.2);
      // etwas Atem
      this.noiseBurst(out, t, 0.06, f * 2, 0.012 * vel, 'bandpass');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.13 * vel, t + 0.06);
      g.gain.setValueAtTime(0.12 * vel, t + Math.max(0.07, dur * 0.8));
      g.gain.linearRampToValueAtTime(0, t + dur + 0.15);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dur + 0.25);
      return;
    }
    // Marimba / Spieluhr: kurzer Anschlag, langes Ausklingen, ein Oberton
    o.type = inst === 'spieluhr' ? 'triangle' : 'sine';
    const decay = inst === 'spieluhr' ? 1.4 : 0.6;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16 * vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.frequency.value = f * (inst === 'spieluhr' ? 3 : 4);
    g2.gain.setValueAtTime(0.04 * vel, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o2.connect(g2).connect(out);
    o2.start(t);
    o2.stop(t + 0.2);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + decay + 0.05);
  }

  /** Gezupfte Saite (Ukulele/Gitarre): Säge durch schnell schließenden Tiefpass */
  private pluck(out: AudioNode, t: number, f: number, vol: number) {
    const ctx = this.ctx as BaseAudioContext;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 2;
    lp.frequency.setValueAtTime(Math.min(8000, f * 8), t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(200, f * 1.2), t + 0.25);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    o.connect(lp).connect(g).connect(out);
    o.start(t);
    o.stop(t + 0.95);
  }

  /** Akkordeon: zwei leicht verstimmte Zungen (Schwebung), gefiltert */
  private reed(out: AudioNode, t: number, f: number, dur: number, vol: number, vibrato = false) {
    const ctx = this.ctx as BaseAudioContext;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.min(4000, f * 5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.setValueAtTime(vol, t + Math.max(0.04, dur * 0.85));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.08);
    for (const det of [-9, 9]) {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = f;
      o.detune.value = det;
      if (vibrato) {
        const lfo = ctx.createOscillator();
        const lg = ctx.createGain();
        lfo.frequency.value = 5.5;
        lg.gain.value = 4;
        lfo.connect(lg).connect(o.detune);
        lfo.start(t);
        lfo.stop(t + dur + 0.1);
      }
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.1);
    }
    lp.connect(g).connect(out);
  }

  /** Weicher E-Piano-Ton: Sinus mit kurzem glockigem Oberton, langes Ausklingen */
  private epiano(out: AudioNode, t: number, f: number, vol: number, decay = 1.8) {
    const ctx = this.ctx as BaseAudioContext;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
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
      x.stop(t + decay + 0.1);
    }
  }

  // -------------------------------------------------------------------------
  // Brabbelsprache
  // -------------------------------------------------------------------------

  /** Stimmband-Welle je Helligkeit (weiche Obertöne wie eine echte Stimme, nicht schnarrend) */
  private glottal = new Map<number, PeriodicWave>();
  private glottalWave(bright: number): PeriodicWave {
    const key = Math.round(bright * 10);
    let w = this.glottal.get(key);
    if (!w) {
      const ctx = this.ctx as BaseAudioContext;
      const n = 28;
      const real = new Float32Array(n);
      const imag = new Float32Array(n);
      const tilt = 1.9 - key / 10;
      for (let i = 1; i < n; i++) imag[i] = 1 / Math.pow(i, tilt);
      w = ctx.createPeriodicWave(real, imag);
      this.glottal.set(key, w);
    }
    return w;
  }

  /**
   * Eine kleine gesprochene Silbe: Mitlaut als Rauschen/Klick, dann ein gesungener Selbstlaut durch
   * drei Formant-Filter (Kopfgröße je Figur), mit Tonhöhenbogen und Satzmelodie. Niedlich & unverständlich.
   */
  babble(voice: Voice, syl: Syllable) {
    const ctx = this.ctx;
    if (!ctx || (this.offlineAt === null && ctx.state !== 'running')) return;
    let t = this.offlineAt ?? ctx.currentTime + 0.005;
    const out = ctx.createGain();
    out.gain.value = 1.6;
    out.connect(this.sfxBus);
    // --- Mitlaut ---
    const c = syl.consonant;
    if (c) {
      if ('szßcxfvjh'.includes(c)) {
        this.noiseBurst(out, t, 0.035, c === 'f' || c === 'v' || c === 'h' ? 3200 : 6500, c === 'h' ? 0.03 : 0.05, c === 'h' ? 'bandpass' : 'highpass');
        t += 0.022;
      } else if ('ptkbdgq'.includes(c)) {
        this.noiseBurst(out, t, 0.012, c === 'k' || c === 'g' || c === 'q' ? 2200 : c === 't' || c === 'd' ? 4200 : 1200, 0.07, 'bandpass');
        t += 0.012;
      }
    }
    // --- Tonhöhe & Satzmelodie ---
    const dur = voice.syllable * (0.85 + Math.random() * 0.3) * (syl.final ? 1.6 : 1) * (syl.excited ? 0.9 : 1);
    const range = voice.range * (syl.excited ? 1.4 : 1);
    let semis = (Math.random() * 2 - 1) * range * 0.5 + range * 0.35 * (0.5 - syl.pos); // sanft abfallende Linie
    if (syl.excited) semis += 1.5;
    const f = voice.pitch * Math.pow(2, semis / 12);
    const end = syl.final ? (syl.question ? 1.3 : syl.excited ? 1.08 : 0.84) : Math.pow(2, -voice.lilt / 24);
    const peak = Math.pow(2, voice.lilt / 24);
    const src = ctx.createOscillator();
    src.setPeriodicWave(this.glottalWave(voice.bright));
    src.frequency.setValueAtTime(f * 0.97, t);
    src.frequency.linearRampToValueAtTime(f * peak, t + dur * 0.35);
    src.frequency.linearRampToValueAtTime(f * end, t + dur);
    if (voice.vibrato) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = voice.vibrato;
      lg.gain.value = f * 0.025;
      lfo.connect(lg).connect(src.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.05);
    }
    // --- Hüllkurve ---
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.014);
    g.gain.setValueAtTime(0.5, t + dur * 0.65);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);
    g.connect(out);
    // --- Formanten (Vokal), etwas „Mund-Bewegung“ vom Mitlaut zum Vokal ---
    const [f1, f2, f3] = formantsFor(syl.vowel).map((x) => x * voice.formant);
    for (const [freq, q, lvl, glide] of [[f1, 5, 1, 0.85], [f2, 8, 0.7, 1.18], [f3, 10, 0.28, 1]] as const) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = q;
      bp.frequency.setValueAtTime(freq * glide, t);
      bp.frequency.exponentialRampToValueAtTime(freq, t + 0.035);
      const lg = ctx.createGain();
      lg.gain.value = lvl;
      src.connect(bp).connect(lg).connect(g);
    }
    // Wärme: etwas Grundton durch einen Tiefpass
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = f * 1.6;
    const dry = ctx.createGain();
    dry.gain.value = 0.22;
    src.connect(lp).connect(dry).connect(g);
    // Hauch
    if (voice.breath) this.noiseBurst(g, t, dur, f2, 0.15 * voice.breath, 'bandpass');
    src.start(t);
    src.stop(t + dur + 0.06);
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
      case 'foto':
        this.noiseBurst(out, t, 0.03, 3000, 0.25);
        this.noiseBurst(out, t + 0.09, 0.05, 1800, 0.3);
        this.tone(t + 0.14, 1568, 0.05, 0.05, 'triangle');
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
/** Formanten F1–F3 eines Selbstlauts (Erwachsenen-Werte, werden je Stimme hochskaliert) */
function formantsFor(vowel: string): [number, number, number] {
  const table: Record<string, [number, number, number]> = {
    a: [800, 1250, 2600],
    e: [480, 1900, 2600],
    i: [300, 2300, 3000],
    o: [500, 880, 2500],
    u: [330, 800, 2300],
    ä: [650, 1750, 2600],
    ö: [450, 1500, 2400],
    ü: [300, 1650, 2300],
  };
  return table[vowel] ?? table.e;
}
