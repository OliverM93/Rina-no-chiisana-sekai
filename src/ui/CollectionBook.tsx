/**
 * Sammelbuch: alle Fische und Insekten. Gefangene Arten zeigen Bild,
 * Beschreibung, Ort, Monate und Uhrzeiten – unbekannte nur einen Schatten.
 */
import { useEffect, useState } from 'preact/hooks';
import { MONTHS } from '../core/time';
import { CURRENCY } from '../data/items';
import { FISH, FISH_HABITAT_LABELS, type FishDef, INSECT_HABITAT_LABELS, INSECTS, type InsectDef } from '../data/species';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { ui, useSessionVersion } from './store';

type Tab = 'fische' | 'insekten';
type Species = FishDef | InsectDef;

function monthsLabel(months: readonly number[]): string {
  if (months.length === 12) return 'das ganze Jahr';
  // zusammenhängende Bereiche (auch über den Jahreswechsel)
  const has = (m: number) => months.includes(((m - 1 + 12) % 12) + 1);
  const start = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((m) => has(m) && !has(m - 1));
  return start
    .map((s) => {
      let e = s;
      while (has(e + 1) && e - s < 11) e++;
      const name = (m: number) => MONTHS[((m - 1) % 12 + 12) % 12].slice(0, 3);
      return s === e ? name(s) : `${name(s)}–${name(e)}`;
    })
    .join(', ');
}

function hoursLabel(h: readonly [number, number]): string {
  if ((h[0] === 0 && h[1] === 24) || h[0] === h[1]) return 'den ganzen Tag';
  return `${h[0]}–${h[1] % 24} Uhr`;
}

export function CollectionBook({ session }: { session: Session }) {
  useSessionVersion(session);
  const [tab, setTab] = useState<Tab>('fische');
  const [selected, setSelected] = useState<string | null>(null);
  const close = () => ui.set({ panel: null });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyB') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const collection = session.data?.collection ?? {};
  const list: readonly Species[] = tab === 'fische' ? FISH : INSECTS;
  const caught = list.filter((s) => collection[s.id]).length;
  const sel = list.find((s) => s.id === selected) ?? null;
  const entry = sel ? collection[sel.id] : undefined;
  const place = (s: Species) => ('size' in s ? FISH_HABITAT_LABELS[s.habitat] : INSECT_HABITAT_LABELS[s.habitat]);

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book pop-in">
        <h2 class="card-title">📖 Sammelbuch</h2>
        <div class="book-tabs">
          {(['fische', 'insekten'] as const).map((t) => (
            <button
              key={t}
              class={`chip ${tab === t ? 'active' : ''}`}
              onClick={() => {
                setTab(t);
                setSelected(null);
              }}
            >
              {t === 'fische' ? '🐟 Fische' : '🦋 Insekten'}
            </button>
          ))}
          <span class="soft book-progress">
            {caught} / {list.length} entdeckt
          </span>
        </div>
        <div class="book-grid">
          {list.map((s) => {
            const known = !!collection[s.id];
            return (
              <button key={s.id} class={`book-cell ${known ? '' : 'unknown'} ${selected === s.id ? 'selected' : ''}`} onClick={() => setSelected(s.id)} aria-label={known ? s.name : 'unbekannt'}>
                <img src={itemIconUrl(s.id)} alt="" draggable={false} />
              </button>
            );
          })}
        </div>
        <div class="item-detail">
          {sel && entry ? (
            <>
              <img src={itemIconUrl(sel.id, 96)} alt="" />
              <div>
                <div class="item-name">
                  {sel.name} <span class="soft">× {entry.count}</span>
                </div>
                <div class="item-cat">
                  {place(sel)} · {monthsLabel(sel.months)} · {hoursLabel(sel.hours)}
                  {sel.rainOnly ? ' · nur bei Regen' : ''}
                </div>
                <div class="item-desc">{sel.description}</div>
                <div class="item-price">
                  Wert: {sel.price} {CURRENCY.icon}
                  {entry.firstDay ? ` · zuerst gefangen am ${entry.firstDay.split('-').reverse().join('.')}` : ''}
                </div>
              </div>
            </>
          ) : sel ? (
            <p class="soft center">
              ??? – noch nicht gefangen. Vielleicht {place(sel)}?
            </p>
          ) : (
            <p class="soft center">
              {tab === 'fische'
                ? 'Nimm die Angel (Taste 1), stell dich ans Wasser und drück die Leertaste.'
                : 'Nimm den Kescher (Taste 2) und schleich dich an Schmetterlinge, Käfer & Co. heran.'}
            </p>
          )}
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
