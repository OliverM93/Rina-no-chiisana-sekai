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
} from '../core/unternehmungen';
import type { UnternehmungDef } from '../data/unternehmungen';
import { drawPainting } from '../gfx/malen';
import type { Session } from '../game/session';
import { bestOf, type RoundResult, unlockedLevels } from '../game/unternehmungen';

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

/** Pfeil-Duell: erst ein Level wählen (nur erreichte), dann der Kampf */
function DuellGame(props: GameProps) {
  const { def, session } = props;
  const levels = def.duell?.levels ?? [];
  const reached = unlockedLevels(session, def.id);
  const [level, setLevel] = useState<number | null>(levels.length <= 1 ? 0 : null);
  if (level === null) {
    return (
      <>
        <div class="zs-status">Welcher Boss ist heute dran?</div>
        <div class="zs-levels">
          {levels.map((lv, i) => {
            const open = i < reached;
            const best = bestOf(session, def.id, i);
            return (
              <button key={i} class={`btn ${open ? (i === reached - 1 ? 'primary' : 'ghost') : 'ghost locked'}`} disabled={!open} onClick={() => setLevel(i)}>
                <span class="zs-level-no">{open ? `Level ${i + 1}` : `🔒 Level ${i + 1}`}</span>
                <span class="zs-level-boss">{open ? lv.boss : '???'}</span>
                {open && best !== null && <span class="zs-level-best">Bestwert {best} / {lv.length}</span>}
              </button>
            );
          })}
        </div>
        <div class="zs-cheer">Schaff mindestens 60 % Treffer, dann wird das nächste Level frei.</div>
      </>
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

/** Kissen-Sumo: abwechselnd ← und → drücken schiebt den Gegner aus dem Ring */
function SumoGame({ def, onDone }: GameProps) {
  const st = useRef(newSumo());
  const [, redraw] = useState(0);
  const [msg, setMsg] = useState('');
  const [pause, setPause] = useState(false);
  const pauseRef = useRef(false);
  const t0 = useRef(performance.now());
  const s = st.current;
  const sumo = def.sumo;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!pauseRef.current && !sumoOver(s)) {
        const r = sumoTick(s, dt, (now - t0.current) / 1000);
        if (r !== 'weiter') {
          const lines = r === 'gewonnen' ? (sumo?.win ?? []) : (sumo?.lose ?? []);
          setMsg(lines[(s.won + s.lost) % Math.max(1, lines.length)] ?? '');
          pauseRef.current = true;
          setPause(true);
          window.setTimeout(() => {
            if (sumoOver(s)) {
              onDone({ rank: sumoRank(s), score: s.won });
              return;
            }
            sumoNextRound(s);
            pauseRef.current = false;
            setPause(false);
            setMsg(`Runde ${s.round}! ${pickCheer(def, s.round)}`);
          }, 2200);
        }
        redraw((n) => n + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const push = (side: 'left' | 'right') => {
    if (pauseRef.current) return;
    const ok = sumoPush(s, side);
    if (!ok) setMsg('Ausgerutscht! Immer abwechselnd ← und →.');
    else if (Math.random() < 0.06) setMsg(pickCheer(def, Math.floor(Math.random() * 10)));
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
  // Ring: Lina links, Gegner rechts; beide stehen Schulter an Schulter an der Druckstelle
  const center = 50 + s.pos * 38;
  return (
    <>
      <div class="zs-status">
        Runde {s.round} · Lina {s.won} : {s.lost} {sumo?.opponent}
      </div>
      <div class="zs-ring">
        <div class="zs-ring-line left" />
        <div class="zs-ring-line right" />
        <div class={`zs-wrestler lina ${pause ? '' : 'push'}`} style={{ left: `${center - 9}%` }}>
          🧍‍♀️
        </div>
        <div class={`zs-wrestler gegner ${pause ? '' : 'push'}`} style={{ left: `${center + 1}%` }}>
          🧔
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
      <div class="zs-cheer">{msg || 'Abwechselnd ← und → drücken! Zwei gewonnene Runden gewinnen.'}</div>
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
