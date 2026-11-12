/**
 * Christins Samenstand: Samen für Linas Beet kaufen. Immer da: Standard-Samen aller Blumen & Kräuter;
 * dazu täglich wechselnd drei Farb-Samen (Kreuzungs-Partner fürs Beet).
 */
import { useEffect, useState } from 'preact/hooks';
import { countItem } from '../core/inventory';
import { getSeason } from '../core/time';
import { BASE_SEEDS, cropsAt } from '../data/seedstand';
import { CROP_BY_ID } from '../data/crops';
import { itemDef } from '../data/items';
import { itemIconUrl } from '../gfx/items';
import { formatMoney } from '../game/gameplay';
import { buySeeds, seedOffers } from '../game/seedstand';
import type { Session } from '../game/session';
import { showToast, ui, useSessionVersion } from './store';

export function SeedStandPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'blumen' | 'gemuese'>('blumen');
  const close = () => ui.set({ panel: null });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const data = session.data;
  if (!data) return null;
  const offers = seedOffers(session);
  const flowerOffers = offers.filter((o) => BASE_SEEDS.includes(o.itemId) || !(o.itemId.slice(6) in CROP_BY_ID));
  const standard = flowerOffers.filter((o) => BASE_SEEDS.includes(o.itemId));
  const today = flowerOffers.filter((o) => !BASE_SEEDS.includes(o.itemId));
  const crops = cropsAt(getSeason(session.clock()));
  const cropRows = (kind: 'gemuese' | 'kraut') => offers.filter((o) => CROP_BY_ID[o.itemId.slice(6)]?.kind === kind);

  const buy = (itemId: string, n: number) => {
    const name = itemDef(itemId)?.name ?? itemId;
    const r = buySeeds(session, itemId, n);
    if (r === 'ok') showToast(`${n}× ${name} gekauft. 🌱`);
    else if (r === 'teuer') showToast('Dafür reichen deine Sternchen gerade nicht. ⭐');
    else if (r === 'voll') showToast('Deine Tasche ist voll! 🎒');
  };

  const row = (o: { itemId: string; price: number }) => (
    <div class="seed-row" key={o.itemId}>
      <img src={itemIconUrl(o.itemId)} alt="" draggable={false} />
      <div class="seed-name">
        <b>{itemDef(o.itemId)?.name ?? o.itemId}</b>
        {countItem(data.inventory, o.itemId) > 0 && <span class="soft small-text">{countItem(data.inventory, o.itemId)} dabei</span>}
      </div>
      <span class="seed-price">{formatMoney(o.price)}</span>
      <button class="btn" disabled={data.money < o.price * qty} onClick={() => buy(o.itemId, qty)}>
        {qty === 1 ? 'Kaufen' : `${qty}× kaufen`}
      </button>
    </div>
  );

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card seedstand pop-in">
        <h2 class="card-title">🌱 Christins Samenstand</h2>
        <p class="soft center">„Alles frisch und sauber beschriftet. Misch-Samen musst du dir selbst im Beet züchten.“ – Christin</p>
        <div class="bank-row">
          <span>Deine Sternchen:</span>
          <b>{formatMoney(data.money)}</b>
        </div>
        <div class="seed-qty">
          <span>Menge:</span>
          {[1, 5].map((n) => (
            <button key={n} class={`btn ${qty === n ? 'primary' : ''}`} onClick={() => setQty(n)}>
              {n}×
            </button>
          ))}
        </div>
        {getSeason(session.clock()) === 'winter' && <p class="soft small-text">❄️ Im Winter ruht das Beet draußen. Nur im Frühbeet oder Gewächshaus (Möbelkatalog, Reiter Garten) wächst etwas weiter.</p>}
        <div class="seed-tabs">
          <button class={`btn ${tab === 'blumen' ? 'primary' : ''}`} onClick={() => setTab('blumen')}>
            🌷 Blumen
          </button>
          <button class={`btn ${tab === 'gemuese' ? 'primary' : ''}`} onClick={() => setTab('gemuese')}>
            🥕 Gemüse &amp; Kräuter
          </button>
        </div>
        <div class="seed-scroll">
        {tab === 'blumen' ? (
          <>
            <h3 class="bank-sub">Heute im Angebot</h3>
            <div class="seed-list">{today.map(row)}</div>
            <h3 class="bank-sub">Immer da</h3>
            <div class="seed-list">{standard.map(row)}</div>
          </>
        ) : (
          <>
            <h3 class="bank-sub">Gemüse</h3>
            <div class="seed-list">{cropRows('gemuese').map(row)}</div>
            <h3 class="bank-sub">Kräuter</h3>
            <div class="seed-list">{cropRows('kraut').map(row)}</div>
            {crops.away.length > 0 && <p class="soft small-text">Gerade nicht da: {crops.away.map((c) => c.name).join(', ')} – die gibt es nur in anderen Jahreszeiten.</p>}
          </>
        )}
        </div>
        <div class="card-actions">
          <button class="btn primary" onClick={close}>
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}
