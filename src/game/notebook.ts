/**
 * Linas Notizbuch (Audit 3, M1): Was steht gerade an? Keine Aufgabenliste mit Häkchen, sondern
 * Notizen in der Stimme der Bewohner – damit Lina nach einer Pause schnell wieder hineinfindet.
 */
import { fillPlaceholders } from '../data/interactions';
import { HOUSE_STAGES } from '../data/house';
import { NPC_BY_ID } from '../data/npcs';
import { MILESTONES } from '../data/progress';
import { ALL_WISHES, wishToldFlag } from '../data/wishes';
import { nextStage } from './home';
import { allProgressHints } from './progress';
import type { Session } from './session';
import { activeWish, wishesUnlocked, wishProgress } from './wishes';

export interface NotebookNote {
  /** Wer es gesagt hat (Name) – leer = Linas eigene Notiz */
  by: string;
  text: string;
}

export interface NotebookWish {
  npc: string;
  title: string;
  /** „5 × Rosen (jede Farbe) – 2 dabei“ */
  needs: string[];
}

export interface Notebook {
  /** Nächster Einzug: Hinweise oder „bald ist es so weit“ */
  story: NotebookNote[];
  /** Erzählte, noch offene Herzenswünsche */
  wishes: NotebookWish[];
  /** Bewohner, die noch einen Wunsch haben, aber noch nicht davon erzählt haben */
  untold: string[];
  /** Zuhause: Ausbau, Kredit */
  home: string[];
}

const nameOf = (id: string) => NPC_BY_ID[id]?.name ?? id;

export function notebook(session: Session): Notebook {
  const data = session.data;
  const empty: Notebook = { story: [], wishes: [], untold: [], home: [] };
  if (!data) return empty;
  const f = data.flags;
  const ctx = session.interactionContext();
  const nb = empty;

  // 1) Rahmenhandlung
  const waiting = MILESTONES.find((m) => f[`${m.npc}Angekuendigt`] && !f[`${m.npc}Eingezogen`]);
  if (waiting) {
    nb.story.push({ by: '', text: `📮 ${nameOf(waiting.npc)} hat geschrieben – bald ist es so weit! Bis dahin einfach den Tag genießen.` });
  } else {
    for (const h of allProgressHints(session)) nb.story.push({ by: nameOf(h.by), text: h.lines.map((l) => fillPlaceholders(l, ctx)).join(' ') });
  }

  // 2) Herzenswünsche
  if (wishesUnlocked(session)) {
    for (const npc of new Set(ALL_WISHES.map((w) => w.npc))) {
      const w = activeWish(session, npc);
      if (!w) continue;
      if (!f[wishToldFlag(w.id)]) {
        nb.untold.push(nameOf(npc));
        continue;
      }
      const p = wishProgress(session, w);
      const needs = p.needs.map((n) => `${n.need} × ${n.label}${n.have > 0 ? ` – ${Math.min(n.have, n.need)} dabei` : ''}`);
      if (p.stars) needs.push(`${p.stars.need} ⭐ für die Dorfkasse`);
      nb.wishes.push({ npc: nameOf(npc), title: w.title, needs });
    }
  }

  // 3) Zuhause (erst, wenn Papa die Dorfkasse führt)
  if (f.olafEingezogen) {
    const house = data.house;
    if (house.pending) nb.home.push(`🔨 „${HOUSE_STAGES[house.pending.stage]?.name}“ wird gerade gebaut.`);
    if (data.bank.loan > 0) nb.home.push(`🏦 Bei Papa sind noch ${data.bank.loan.toLocaleString('de-DE')} ⭐ offen – ganz ohne Eile.`);
    const next = nextStage(session);
    if (next && data.bank.loan === 0) nb.home.push(`🏡 Nächster Ausbau: „${next.name}“ (${next.price.toLocaleString('de-DE')} ⭐, auf Kredit bei Papa an der Dorfkasse).`);
  }
  return nb;
}
