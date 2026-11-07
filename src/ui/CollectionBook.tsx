/**
 * Sammelbuch: alle Fische und Insekten. Gefangene Arten zeigen Bild,
 * Beschreibung, Ort, Monate und Uhrzeiten – unbekannte nur einen Schatten.
 */
import { useEffect, useState } from 'preact/hooks';
import { MONTHS } from '../core/time';
import { CURRENCY, itemDef } from '../data/items';
import { FINDS } from '../data/fossils';
import { COLORS, FLOWER_SPECIES, MIXES, paletteOf, variantId } from '../data/flowers';
import { FISH, FISH_HABITAT_LABELS, type FishDef, INSECT_HABITAT_LABELS, INSECTS, type InsectDef } from '../data/species';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { ui, useSessionVersion } from './store';

type Tab = 'fische' | 'insekten' | 'funde' | 'blumen';
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

const TABS = ['fische', 'insekten', 'funde', 'blumen'] as const;
const TAB_LABELS: Record<Tab, string> = { fische: '🐟 Fische', insekten: '🦋 Insekten', funde: '🦴 Funde', blumen: '🌷 Blumen' };

/** Reiter „Funde“: Fossilien & Kristalle aus dem Boden */
function FindsBook({ session, tab, setTab, close }: { session: Session; tab: Tab; setTab: (t: Tab) => void; close: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const collection = session.data?.collection ?? {};
  const found = FINDS.filter((f) => collection[f.id]).length;
  const sel = FINDS.find((f) => f.id === selected) ?? null;
  const entry = sel ? collection[sel.id] : undefined;
  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book pop-in">
        <h2 class="card-title">📖 Sammelbuch</h2>
        <div class="book-tabs">
          {TABS.map((t) => (
            <button key={t} class={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {TAB_LABELS[t]}
            </button>
          ))}
          <span class="soft book-progress">
            {found} / {FINDS.length} entdeckt
          </span>
        </div>
        <div class="book-grid">
          {FINDS.map((f) => {
            const known = !!collection[f.id];
            return (
              <button key={f.id} class={`book-cell ${known ? '' : 'unknown'} ${selected === f.id ? 'selected' : ''}`} onClick={() => setSelected(f.id)} aria-label={known ? f.name : 'unbekannt'}>
                <img src={itemIconUrl(f.id)} alt="" draggable={false} />
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
                <div class="item-cat">{sel.kind === 'fossil' ? 'Fossil' : 'Mineral'}</div>
                <div class="item-desc">{sel.description}</div>
                <div class="item-price">
                  Wert: {sel.price} {CURRENCY.icon}
                  {entry.firstDay ? ` · zuerst gefunden am ${entry.firstDay.split('-').reverse().join('.')}` : ''}
                </div>
              </div>
            </>
          ) : sel ? (
            <p class="soft center">??? – noch nicht ausgegraben.</p>
          ) : (
            <p class="soft center">Nimm Thalias Schaufel (Taste 4) und grab an kleinen, funkelnden Rissen im Boden.</p>
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

/** Reiter „Blumen“: jede Art in jeder Farbe – Mischfarben verraten nach dem Entdecken ihr Rezept */
function FlowerBook({ session, tab, setTab, close }: { session: Session; tab: Tab; setTab: (t: Tab) => void; close: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const collection = session.data?.collection ?? {};
  const all = FLOWER_SPECIES.flatMap((sp) => paletteOf(sp).map((c) => ({ sp, color: c, id: variantId(sp, c) })));
  const found = all.filter((f) => collection[f.id]).length;
  const sel = all.find((f) => f.id === selected) ?? null;
  const entry = sel ? collection[sel.id] : undefined;
  const mix = sel ? MIXES.find((m) => m.result === sel.color && paletteOf(sel.sp).includes(m.a) && paletteOf(sel.sp).includes(m.b)) : undefined;
  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book pop-in">
        <h2 class="card-title">📖 Sammelbuch</h2>
        <div class="book-tabs">
          {TABS.map((t) => (
            <button key={t} class={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {TAB_LABELS[t]}
            </button>
          ))}
          <span class="soft book-progress">
            {found} / {all.length} entdeckt
          </span>
        </div>
        <div class="flower-rows">
          {FLOWER_SPECIES.map((sp) => (
            <div key={sp.id} class="flower-row">
              <span class="flower-row-name">{itemDef(sp.id)?.name}</span>
              <div class="flower-row-cells">
                {paletteOf(sp).map((c) => {
                  const id = variantId(sp, c);
                  const known = !!collection[id];
                  return (
                    <button key={id} class={`book-cell ${known ? '' : 'unknown'} ${selected === id ? 'selected' : ''}`} onClick={() => setSelected(id)} aria-label={known ? itemDef(id)?.name : 'unbekannt'}>
                      <img src={itemIconUrl(id)} alt="" draggable={false} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div class="item-detail">
          {sel && entry ? (
            <>
              <img src={itemIconUrl(sel.id, 96)} alt="" />
              <div>
                <div class="item-name">{itemDef(sel.id)?.name}</div>
                <div class="item-cat">{sel.color === sel.sp.base ? 'Standardfarbe' : sel.sp.seedColors.includes(sel.color) ? 'Gibt es als Samen' : 'Mischfarbe'}</div>
                <div class="item-desc">
                  {sel.sp.crossColors.includes(sel.color) && mix
                    ? `Entstanden aus ${COLORS[mix.a].label} × ${COLORS[mix.b].label}${mix.rare ? ' – klappt nur manchmal.' : '.'}`
                    : itemDef(sel.id)?.description}
                </div>
                <div class="item-price">
                  Wert: {itemDef(sel.id)?.price} {CURRENCY.icon}
                  {entry.firstDay ? ` · zuerst erblüht am ${entry.firstDay.split('-').reverse().join('.')}` : ''}
                </div>
              </div>
            </>
          ) : sel ? (
            <p class="soft center">
              ??? – noch nicht erblüht.{' '}
              {sel.sp.crossColors.includes(sel.color)
                ? 'Diese Farbe entsteht nur durch Kreuzen.'
                : 'Diese Farbe gibt es als Samen – vielleicht kommt Post?'}
            </p>
          ) : (
            <p class="soft center">Blühen zwei Farben einer Art nebeneinander im Beet, fällt beim Pflücken manchmal ein Misch-Same ab. 🌷</p>
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
  if (tab === 'funde') return <FindsBook session={session} tab={tab} setTab={setTab} close={close} />;
  if (tab === 'blumen') return <FlowerBook session={session} tab={tab} setTab={setTab} close={close} />;
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
          {TABS.map((t) => (
            <button
              key={t}
              class={`chip ${tab === t ? 'active' : ''}`}
              onClick={() => {
                setTab(t);
                setSelected(null);
              }}
            >
              {TAB_LABELS[t]}
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
