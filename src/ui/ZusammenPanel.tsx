/**
 * Gemeinsame Unternehmungen: das Fenster mit dem kleinen Spiel (Memory, Puzzle, Takt, Pfeil-Duell in Leveln, Kissen-Sumo, Quiz, Malen).
 * Kein Scheitern – jede Runde endet und gibt ein Ergebnis zurück; „Lieber ein andermal“ geht jederzeit.
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { hashString } from '../core/rng';
import {
  type Arrow,
  duelAnswer,
  duelRank,
  duelSequence,
  flipMemory,
  memoryDone,
  memoryRank,
  newMemory,
  newPuzzle,
  newSumo,
  puzzleDoneWith,
  puzzleRank,
  puzzleRightAt,
  quizRank,
  type Rank,
  rhythmHit,
  rhythmPos,
  rhythmRank,
  shuffled,
  slidePuzzle,
  slidePuzzleDir,
  sumoNextRound,
  sumoOver,
  sumoPush,
  sumoRank,
  sumoTick,
  SUMO_ROUNDS_TO_WIN,
} from '../core/unternehmungen';
import type { UnternehmungDef } from '../data/unternehmungen';
import { drawPainting } from '../gfx/malen';
import type { Session } from '../game/session';
import { bestOf, levelNames, type RoundResult, unlockedLevels } from '../game/unternehmungen';
import { palette } from '../style/palette';

interface GameProps {
  session: Session;
  def: UnternehmungDef;
  seed: number;
  onDone: (r: RoundResult) => void;
}

const pickCheer = (def: UnternehmungDef, n: number) => (def.cheers.length > 0 ? def.cheers[n % def.cheers.length] : '');

// ---------------------------------------------------------------------------

function MemoryGame({ def, seed, onDone }: GameProps) {
  const state = useRef(newMemory(def.memory?.symbols ?? [], seed));
  const [, redraw] = useState(0);
  const [cheer, setCheer] = useState('');
  const s = state.current;
  const flip = (i: number) => {
    const { pair } = flipMemory(s, i);
    redraw((n) => n + 1);
    if (s.open.length === 2 && !pair) {
      setCheer(pickCheer(def, s.moves));
      const open = [...s.open];
      window.setTimeout(() => {
        if (s.open.length === 2 && s.open[0] === open[0] && s.open[1] === open[1]) s.open = [];
        redraw((n) => n + 1);
      }, 800);
    }
    if (pair) setCheer(pickCheer(def, s.moves + 2));
    if (memoryDone(s)) window.setTimeout(() => onDone({ rank: memoryRank(s), score: s.moves }), 700);
  };
  return (
    <>
      <div class="zs-status">Versuche: {s.moves}</div>
      <div class="zs-memory">
        {s.cards.map((c, i) => {
          const shown = s.found[i] || s.open.includes(i);
          return (
            <button key={i} class={`zs-card ${shown ? 'shown' : ''} ${s.found[i] ? 'found' : ''}`} onClick={() => flip(i)} aria-label={shown ? c : 'verdeckte Karte'}>
              {shown ? c : '❀'}
            </button>
          );
        })}
      </div>
      <div class="zs-cheer">{cheer || 'Deck zwei Karten auf und find die Paare.'}</div>
    </>
  );
}

// ---------------------------------------------------------------------------

function PuzzleGame({ def, seed, onDone }: GameProps) {
  const state = useRef(newPuzzle(seed));
  const [, redraw] = useState(0);
  const [cheer, setCheer] = useState('');
  const done = useRef(false);
  const s = state.current;
  const pic = def.puzzle?.picture ?? [];
  const after = (moved: boolean) => {
    if (!moved) return;
    redraw((n) => n + 1);
    if (s.moves % 8 === 0) setCheer(pickCheer(def, s.moves / 8));
    // gelöst, sobald jedes Bild am richtigen Platz liegt (gleiche Symbole sind austauschbar)
    if (puzzleDoneWith(s, pic) && !done.current) {
      done.current = true;
      setCheer('Fertig! Alles an seinem Platz. ✨');
      window.setTimeout(() => onDone({ rank: puzzleRank(s), score: s.moves }), 900);
    }
  };
  useEffect(() => {
    const keys: Record<string, 'up' | 'down' | 'left' | 'right'> = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
    const onKey = (e: KeyboardEvent) => {
      const d = keys[e.code];
      if (!d || done.current) return;
      e.preventDefault();
      after(slidePuzzleDir(s, d));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const right = s.tiles.filter((_, i) => puzzleRightAt(s, pic, i)).length;
  return (
    <>
      <div class="zs-status">
        Züge: {s.moves} · richtig: {right} / {pic.length}
      </div>
      <div class="zs-puzzle-row">
        <div class="zs-puzzle">
          {s.tiles.map((t, i) => (
            <button key={i} class={`zs-tile ${t === 0 ? 'gap' : ''} ${puzzleRightAt(s, pic, i) ? 'right' : ''}`} onClick={() => after(slidePuzzle(s, i))} disabled={t === 0 || done.current}>
              {t === 0 ? '' : pic[t - 1]}
            </button>
          ))}
        </div>
        <div class="zs-goal-box">
          <div class="zs-goal-title">So soll es aussehen</div>
          <div class="zs-goal-grid">
            {[...pic, ''].map((sym, i) => (
              <span key={i} class={sym ? '' : 'gap'}>
                {sym}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div class="zs-cheer">{cheer || 'Klick ein Teil neben der Lücke an (oder Pfeiltasten). Grün umrandet = richtiger Platz.'}</div>
    </>
  );
}

// ---------------------------------------------------------------------------

function TaktGame({ def, onDone, session }: GameProps) {
  const reps = def.takt?.reps ?? 10;
  const period = def.takt?.period ?? 0.9;
  const [pos, setPos] = useState(0);
  const [rep, setRep] = useState(0);
  const [points, setPoints] = useState(0);
  const [msg, setMsg] = useState('');
  const t0 = useRef(performance.now());
  const posRef = useRef(0);
  const lock = useRef(false);
  const finished = useRef(false);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = rhythmPos((performance.now() - t0.current) / 1000, period);
      posRef.current = p;
      setPos(p);
      // Lina und Thalia gehen im Takt in die Knie: ganz unten, wenn der Punkt in der Mitte ist
      if (!finished.current) session.bus.emit('zusammen:takt', 1 - Math.abs(p - 0.5) * 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      session.bus.emit('zusammen:takt', null);
    };
  }, []);
  const press = () => {
    if (lock.current || finished.current) return;
    lock.current = true;
    window.setTimeout(() => (lock.current = false), 250);
    const h = rhythmHit(posRef.current);
    const gain = h === 'perfekt' ? 2 : h === 'gut' ? 1 : 0;
    const total = points + gain;
    const n = rep + 1;
    setPoints(total);
    setRep(n);
    setMsg(h === 'perfekt' ? `Perfekt! ${pickCheer(def, n)}` : h === 'gut' ? `Gut! ${pickCheer(def, n + 1)}` : `Knapp daneben – ${pickCheer(def, n + 2)}`);
    session.bus.emit('zusammen:takt-treffer', h);
    if (n >= reps) {
      finished.current = true;
      session.bus.emit('zusammen:takt', null);
      window.setTimeout(() => onDone({ rank: rhythmRank(total, reps), score: total }), 700);
    }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        press();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return (
    <>
      <div class="zs-status">
        Wiederholung {Math.min(rep + 1, reps)} / {reps} · Punkte {points}
      </div>
      <div class="zs-takt">
        <div class="zs-takt-zone good" />
        <div class="zs-takt-zone perfect" />
        <div class="zs-takt-dot" style={{ left: `${pos * 100}%` }} />
      </div>
      <button class="btn primary zs-big" onClick={press}>
        💪 Jetzt! (Leertaste)
      </button>
      <div class="zs-cheer">{msg || 'Drück, wenn ihr ganz unten in der Kniebeuge seid (Punkt in der Mitte).'}</div>
    </>
  );
}

// ---------------------------------------------------------------------------

const ARROW_ICON: Record<Arrow, string> = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
const ARROW_KEYS: Record<string, Arrow> = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };

/** Level-Auswahl (Pfeil-Duell, Kissen-Sumo): nur erreichte Level sind wählbar, das neueste ist hervorgehoben */
function LevelSelect({ session, def, title, hint, best, onPick }: { session: Session; def: UnternehmungDef; title: string; hint: string; best: (i: number) => string | null; onPick: (i: number) => void }) {
  const names = levelNames(def);
  const reached = unlockedLevels(session, def.id);
  return (
    <>
      <div class="zs-status">{title}</div>
      <div class="zs-levels">
        {names.map((name, i) => {
          const open = i < reached;
          const b = open ? best(i) : null;
          return (
            <button key={i} class={`btn ${open ? (i === reached - 1 ? 'primary' : 'ghost') : 'ghost locked'}`} disabled={!open} onClick={() => onPick(i)}>
              <span class="zs-level-no">{open ? `Level ${i + 1}` : `🔒 Level ${i + 1}`}</span>
              <span class="zs-level-boss">{open ? name : '???'}</span>
              {b && <span class="zs-level-best">{b}</span>}
            </button>
          );
        })}
      </div>
      <div class="zs-cheer">{hint}</div>
    </>
  );
}

/** Pfeil-Duell: erst ein Level wählen (nur erreichte), dann der Kampf */
function DuellGame(props: GameProps) {
  const { def, session } = props;
  const levels = def.duell?.levels ?? [];
  const [level, setLevel] = useState<number | null>(levels.length <= 1 ? 0 : null);
  if (level === null) {
    return (
      <LevelSelect
        session={session}
        def={def}
        title="Welcher Boss ist heute dran?"
        hint="Schaff mindestens 60 % Treffer, dann wird das nächste Level frei."
        best={(i) => {
          const b = bestOf(session, def.id, i);
          return b === null ? null : `Bestwert ${b} / ${levels[i]?.length ?? '?'}`;
        }}
        onPick={setLevel}
      />
    );
  }
  return <DuellFight {...props} level={level} />;
}

function DuellFight({ def, seed, onDone, level }: GameProps & { level: number }) {
  const lv = def.duell?.levels[level] ?? { boss: '?', length: 12, window: 1.5, reverse: 0 };
  const len = lv.length;
  const seq = useMemo(() => duelSequence(seed + level * 7919, len, lv.reverse), [seed, level]);
  const [i, setI] = useState(0);
  const [hits, setHits] = useState(0);
  const [left, setLeft] = useState(1);
  const [msg, setMsg] = useState('');
  // eine Sekunde „Bereit?“ vor dem ersten Pfeil
  const started = useRef(performance.now() + 1000);
  const state = useRef({ i: 0, hits: 0, done: false });
  const advance = (hit: boolean) => {
    const st = state.current;
    if (st.done) return;
    if (hit) st.hits += 1;
    st.i += 1;
    setHits(st.hits);
    setI(st.i);
    setMsg(hit ? pickCheer(def, st.i) : `Ausgewichen … ${pickCheer(def, st.i + 1)}`);
    started.current = performance.now();
    if (st.i >= len) {
      st.done = true;
      window.setTimeout(() => onDone({ rank: duelRank(st.hits, len), score: st.hits, level }), 700);
    }
  };
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const k = 1 - (performance.now() - started.current) / 1000 / lv.window;
      setLeft(Math.min(1, Math.max(0, k)));
      if (k <= 0) advance(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const press = (a: Arrow) => {
    const st = state.current;
    if (st.done || performance.now() < started.current) return;
    advance(duelAnswer(seq[st.i]) === a);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = ARROW_KEYS[e.code];
      if (!a) return;
      e.preventDefault();
      press(a);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const cur = seq[i];
  return (
    <>
      <div class="zs-status">
        Level {level + 1}: {lv.boss} · Treffer {hits} / {len}
      </div>
      <div class="zs-hp">
        <div class="zs-hp-fill" style={{ width: `${(1 - hits / len) * 100}%` }} />
      </div>
      <div class={`zs-arrow ${cur?.reverse ? 'reverse' : ''}`}>{i < len && cur ? ARROW_ICON[cur.dir] : '🏆'}</div>
      <div class="zs-timer">
        <div class="zs-timer-fill" style={{ width: `${left * 100}%` }} />
      </div>
      <div class="zs-arrow-buttons">
        {(['left', 'up', 'down', 'right'] as const).map((a) => (
          <button key={a} class="btn ghost" onClick={() => press(a)}>
            {ARROW_ICON[a]}
          </button>
        ))}
      </div>
      <div class="zs-cheer">{msg || (lv.reverse > 0 ? 'Achtung: Bei roten Pfeilen die Gegenrichtung drücken!' : 'Drück den Pfeil, der erscheint (Pfeiltasten oder Knöpfe).')}</div>
    </>
  );
}

// ---------------------------------------------------------------------------

/** Ein gezeichneter Sumo-Ringer (Chibi): runder Bauch, Mawashi-Gürtel, Haarknoten; schaut nach rechts */
function SumoRinger({ who, push, fallen }: { who: 'lina' | 'lars'; push: number; fallen: boolean }) {
  const c = palette.sumo;
  const hair = who === 'lina' ? c.linaHair : c.larsHair;
  const belt = who === 'lina' ? c.linaBelt : c.larsBelt;
  // vorgebeugt beim Drücken, umgekippt nach einer verlorenen Runde
  const lean = fallen ? -70 : 8 + push * 10;
  return (
    <svg class="zs-ringer" viewBox="0 0 100 100" aria-hidden="true">
      <g transform={`rotate(${lean} 50 90)`}>
        {/* Beine im Grätschstand */}
        <ellipse cx="34" cy="86" rx="11" ry="9" fill={c.skinShade} />
        <ellipse cx="66" cy="86" rx="11" ry="9" fill={c.skinShade} />
        {/* Bauch */}
        <ellipse cx="50" cy="62" rx="33" ry="27" fill={c.skin} />
        <ellipse cx="56" cy="58" rx="14" ry="12" fill="rgba(255,255,255,0.25)" />
        {/* Mawashi mit Knoten vorn */}
        <rect x="18" y="68" width="64" height="12" rx="5" fill={belt} />
        <rect x="18" y="76" width="64" height="4" rx="2" fill={c.beltShade} />
        <path d="M46 80 L54 80 L56 92 L44 92 Z" fill={belt} />
        {/* Arme nach vorn (zum Gegner) */}
        <ellipse cx="78" cy="54" rx="13" ry="8" fill={c.skin} transform="rotate(-15 78 54)" />
        <ellipse cx="72" cy="64" rx="12" ry="7" fill={c.skinShade} transform="rotate(-5 72 64)" />
        {/* Kopf */}
        {who === 'lina' && (
          <>
            {/* Locken um das Gesicht */}
            <circle cx="38" cy="30" r="9" fill={hair} />
            <circle cx="40" cy="42" r="7" fill={hair} />
            <circle cx="64" cy="32" r="7" fill={hair} />
          </>
        )}
        <circle cx="52" cy="32" r="15" fill={c.skin} />
        {/* Haare oben und Haarknoten (Chonmage) */}
        <path d="M37 30 Q40 14 52 15 Q65 14 67 30 Q60 22 52 23 Q44 22 37 30 Z" fill={hair} />
        <ellipse cx="54" cy="12" rx="6" ry="4.5" fill={hair} />
        <rect x="51" y="13" width="6" height="4" rx="1" fill={hair} />
        {/* Gesicht: entschlossen, aber freundlich */}
        <path d="M54 29 l6 -2" stroke={c.face} stroke-width="1.6" stroke-linecap="round" />
        <path d="M45 29 l5 1" stroke={c.face} stroke-width="1.6" stroke-linecap="round" />
        <circle cx="58" cy="33" r="1.8" fill={c.face} />
        <circle cx="48" cy="33" r="1.8" fill={c.face} />
        <ellipse cx="62" cy="38" rx="3" ry="1.8" fill={c.blush} />
        <ellipse cx="44" cy="38" rx="3" ry="1.8" fill={c.blush} />
        {who === 'lina' && (
          <>
            <circle cx="61" cy="36" r="0.7" fill={c.freckle} />
            <circle cx="63" cy="35" r="0.7" fill={c.freckle} />
            <circle cx="45" cy="36" r="0.7" fill={c.freckle} />
            <path d="M50 40 Q54 42 57 40" stroke={c.face} stroke-width="1.4" fill="none" stroke-linecap="round" />
          </>
        )}
        {who === 'lars' && (
          // rotblonder Vollbart
          <path d="M39 34 Q40 50 52 50 Q64 50 66 34 Q62 42 52 42 Q43 42 39 34 Z" fill={hair} />
        )}
      </g>
    </svg>
  );
}

/** Kissen-Sumo: erst einen Rang wählen, dann abwechselnd ← und → drücken */
function SumoGame(props: GameProps) {
  const { def, session } = props;
  const levels = def.sumo?.levels ?? [];
  const [level, setLevel] = useState<number | null>(levels.length <= 1 ? 0 : null);
  if (level === null) {
    return (
      <LevelSelect
        session={session}
        def={def}
        title="Gegen welchen Lars trittst du an?"
        hint="Gewinn das Match (zwei Runden), dann wird der nächste Rang frei."
        best={(i) => ((bestOf(session, def.id, i) ?? 0) >= SUMO_ROUNDS_TO_WIN ? '🏆 geschafft' : null)}
        onPick={setLevel}
      />
    );
  }
  return <SumoBout {...props} level={level} />;
}

function SumoBout({ def, onDone, level }: GameProps & { level: number }) {
  const lv = def.sumo?.levels[level];
  const st = useRef(newSumo(lv));
  const [, redraw] = useState(0);
  const [msg, setMsg] = useState('');
  const [pause, setPause] = useState(false);
  const [pushK, setPushK] = useState(0);
  const pauseRef = useRef(false);
  const t0 = useRef(performance.now());
  const s = st.current;
  const sumo = def.sumo;
  const endRound = (win: boolean) => {
    const lines = win ? (sumo?.win ?? []) : (sumo?.lose ?? []);
    setMsg(lines[(s.won + s.lost) % Math.max(1, lines.length)] ?? '');
    pauseRef.current = true;
    setPause(true);
    redraw((n) => n + 1);
    window.setTimeout(() => {
      if (sumoOver(s)) {
        onDone({ rank: sumoRank(s), score: s.won, level });
        return;
      }
      sumoNextRound(s);
      pauseRef.current = false;
      setPause(false);
      setMsg(`Runde ${s.round}! ${pickCheer(def, s.round)}`);
    }, 2200);
  };
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!pauseRef.current && !sumoOver(s)) {
        const r = sumoTick(s, dt, (now - t0.current) / 1000);
        if (r === 'verloren') endRound(false);
        else if (r === 'stoss') setMsg('„Tsuppari!“ Lars schiebt plötzlich nach – dagegenhalten!');
        redraw((n) => n + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const push = (side: 'left' | 'right') => {
    if (pauseRef.current) return;
    const r = sumoPush(s, side);
    if (r === 'rutsch') setMsg('Ausgerutscht! Immer abwechselnd ← und →.');
    if (r === 'ok' || r === 'gewonnen') setPushK((k) => (k + 1) % 2);
    if (r === 'gewonnen') endRound(true);
    redraw((n) => n + 1);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        push('left');
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        push('right');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  // Druckpunkt zwischen den beiden: -1 = Linas Rand (links), +1 = Lars' Rand (rechts)
  const center = 50 + s.pos * 30;
  const linaOut = pause && s.lost > 0 && s.pos <= -1;
  const larsOut = pause && s.pos >= 1;
  return (
    <>
      <div class="zs-status">
        Level {level + 1} · Runde {s.round} · Lina {s.won} : {s.lost} {sumo?.opponent}
      </div>
      <div class="zs-dohyo">
        <svg class="zs-dohyo-ring" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
          <rect x="0" y="0" width="400" height="120" rx="18" fill={palette.sumo.clayDark} />
          <ellipse cx="200" cy="60" rx="186" ry="52" fill={palette.sumo.clay} />
          <ellipse cx="200" cy="60" rx="178" ry="47" fill="none" stroke={palette.sumo.straw} stroke-width="8" />
          <ellipse cx="200" cy="60" rx="178" ry="47" fill="none" stroke={palette.sumo.strawDark} stroke-width="2" stroke-dasharray="6 5" />
          <rect x="176" y="44" width="5" height="32" fill={palette.sumo.line} />
          <rect x="219" y="44" width="5" height="32" fill={palette.sumo.line} />
        </svg>
        <div class={`zs-ringer-pos lina ${pushK ? 'shove' : ''}`} style={{ left: `${center - 25}%` }}>
          <SumoRinger who="lina" push={pause ? 0 : 1} fallen={linaOut} />
        </div>
        <div class="zs-ringer-pos lars" style={{ left: `${center - 2}%` }}>
          <SumoRinger who="lars" push={pause ? 0 : 1} fallen={larsOut} />
        </div>
      </div>
      <div class="zs-arrow-buttons">
        <button class="btn ghost" onClick={() => push('left')}>
          ⬅️
        </button>
        <button class="btn ghost" onClick={() => push('right')}>
          ➡️
        </button>
      </div>
      <div class="zs-cheer">{msg || `${lv?.name ?? ''}: abwechselnd ← und → drücken! Zwei gewonnene Runden gewinnen.`}</div>
    </>
  );
}

// ---------------------------------------------------------------------------

function QuizGame({ def, seed, onDone }: GameProps) {
  const quiz = def.quiz;
  const questions = useMemo(() => shuffled(quiz?.questions ?? [], seed).slice(0, quiz?.count ?? 5), [seed]);
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const q = questions[i];
  if (!q || !quiz) return null;
  const answer = (k: number) => {
    if (answered !== null) return;
    setAnswered(k);
    if (k === q.right) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (i + 1 >= questions.length) {
      onDone({ rank: quizRank(correct, questions.length), score: correct });
      return;
    }
    setI(i + 1);
    setAnswered(null);
  };
  const ok = answered === q.right;
  return (
    <>
      <div class="zs-status">
        Frage {i + 1} / {questions.length} · Richtig {correct}
      </div>
      <p class="zs-question">{q.q}</p>
      <div class="zs-answers">
        {q.answers.map((a, k) => (
          <button key={k} class={`btn ${answered === null ? 'ghost' : k === q.right ? 'primary' : k === answered ? 'danger-fill' : 'ghost'}`} onClick={() => answer(k)} disabled={answered !== null && k !== answered && k !== q.right}>
            {a}
          </button>
        ))}
      </div>
      <div class="zs-cheer">
        {answered === null
          ? 'Papa lehnt sich gespannt zurück.'
          : ok
            ? `Papa: „${quiz.right[i % quiz.right.length]}“`
            : `Papa: „${quiz.wrong[i % quiz.wrong.length]} Richtig ist: ${q.answers[q.right]}.“`}
      </div>
      {answered !== null && (
        <button class="btn primary" onClick={next}>
          {i + 1 >= questions.length ? 'Fertig' : 'Nächste Frage'}
        </button>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

function MalenGame({ def, onDone }: GameProps) {
  const m = def.malen;
  const [motif, setMotif] = useState<string>(m?.motifs[0]?.id ?? 'meer');
  const [pal, setPal] = useState<string>(m?.palettes[0]?.id ?? 'pastell');
  const [touched, setTouched] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) drawPainting(ctx, motif, pal, 360, 250);
  }, [motif, pal]);
  if (!m) return null;
  return (
    <>
      <div class="zs-easel">
        <canvas ref={canvas} class="zs-painting" width={360} height={250} />
      </div>
      <div class="zs-choose-title">Motiv</div>
      <div class="zs-choose">
        {m.motifs.map((x) => (
          <button
            key={x.id}
            class={`btn ${motif === x.id ? 'primary' : 'ghost'}`}
            onClick={() => {
              setMotif(x.id);
              setTouched(true);
            }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div class="zs-choose-title">Farben</div>
      <div class="zs-choose">
        {m.palettes.map((x) => (
          <button
            key={x.id}
            class={`btn ${pal === x.id ? 'primary' : 'ghost'}`}
            onClick={() => {
              setPal(x.id);
              setTouched(true);
            }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <button class="btn primary" disabled={!touched} onClick={() => onDone({ rank: 'super' as Rank, motif, palette: pal })}>
        🎨 Bild fertig malen
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------

export function ZusammenPanel({ session, def, round, onDone, onCancel }: { session: Session; def: UnternehmungDef; round: string; onDone: (r: RoundResult) => void; onCancel: () => void }) {
  const seed = hashString(`zusammen:${def.id}:${round}`);
  const [finished, setFinished] = useState(false);
  const done = (r: RoundResult) => {
    if (finished) return;
    setFinished(true);
    onDone(r);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const props = { def, seed, onDone: done, session };
  return (
    // Beim Training rückt das Fenster nach unten, damit man Lina und Thalia bei den Kniebeugen sieht
    <div class={`modal-layer ${def.game === 'takt' ? 'zs-low' : ''}`}>
      <div class={`card zusammen pop-in ${def.game === 'takt' ? 'compact' : ''}`} role="dialog" aria-label={def.title}>
        <h2 class="card-title">{def.title}</h2>
        {def.game === 'memory' && <MemoryGame {...props} />}
        {def.game === 'puzzle' && <PuzzleGame {...props} />}
        {def.game === 'takt' && <TaktGame {...props} />}
        {def.game === 'duell' && <DuellGame {...props} />}
        {def.game === 'sumo' && <SumoGame {...props} />}
        {def.game === 'quiz' && <QuizGame {...props} />}
        {def.game === 'malen' && <MalenGame {...props} />}
        <div class="card-actions">
          <button class="btn ghost" onClick={onCancel}>
            Lieber ein andermal
          </button>
        </div>
      </div>
    </div>
  );
}
