/**
 * Galerie „Chez Jens“: Kunstwerk des Tages kaufen, Bilder stiften,
 * und alle gestifteten Bilder anschauen.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { ARTWORKS, type ArtDef } from '../data/art';
import { CURRENCY } from '../data/items';
import { artOfTheDay, buyArtOfTheDay, donatableArt, donateArt } from '../game/gallery';
import { formatMoney } from '../game/gameplay';
import type { Session } from '../game/session';
import { artCanvas } from '../gfx/art';
import { showToast, ui, useSessionVersion } from './store';

function Painting({ art, big = false }: { art: ArtDef; big?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const src = artCanvas(art, 160, 128);
    c.width = src.width;
    c.height = src.height;
    (c.getContext('2d') as CanvasRenderingContext2D).drawImage(src, 0, 0);
  }, [art.id]);
  return <canvas ref={ref} class={`painting ${big ? 'big' : ''}`} />;
}

export function GalleryPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const [selected, setSelected] = useState<string | null>(null);
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
  }, []);
  const data = session.data;
  if (!data) return null;
  const today = artOfTheDay(session);
  const sold = data.world.dates['kunst-gekauft'] === session.today();
  const donatable = donatableArt(session);
  const sel = ARTWORKS.find((a) => a.id === selected && data.gallery.includes(a.id)) ?? null;

  const buy = () => {
    const r = buyArtOfTheDay(session);
    if (r === 'ok') showToast(`🖼️ „${today?.name}“ gekauft! Aufstellen mit „Einrichten“ – oder stiften.`);
    else if (r === 'zu-teuer') showToast('Dafür reichen deine Sternchen noch nicht. Jens hält es dir aber nicht zurück – morgen gibt\'s ein neues!');
    else if (r === 'tasche-voll') showToast('Deine Tasche ist voll! 🎒');
  };
  const donate = (id: string) => {
    const lines = donateArt(session, id);
    if (lines.length) session.bus.emit('dialog:open', { title: 'Jens', lines });
  };

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book gallery pop-in">
        <h2 class="card-title">🖼️ Galerie „Chez Jens“</h2>
        <div class="book-tabs">
          <span class="soft small-text">„Kunst, chérie, ist das, was übrig bleibt, wenn man alles andere vergessen hat.“</span>
          <span class="book-progress">
            {data.gallery.length}/{ARTWORKS.length} Bilder
          </span>
        </div>
        {today && (
          <div class="item-detail">
            <Painting art={today} big />
            <div>
              <div class="item-cat">Kunstwerk des Tages</div>
              <div class="item-name">{today.name}</div>
              <div class="soft small-text">von {today.artist}</div>
              <div class="item-desc">{today.description}</div>
              <div class="item-price">
                {sold ? 'Heute schon verkauft – morgen gibt\'s ein neues!' : `Preis: ${today.price} ${CURRENCY.icon} · du hast ${formatMoney(data.money)}`}
              </div>
              {!sold && (
                <button class="btn primary small" disabled={data.money < today.price} onClick={buy}>
                  Kaufen
                </button>
              )}
            </div>
          </div>
        )}
        <div class="gallery-wall">
          {ARTWORKS.map((a) => {
            const hung = data.gallery.includes(a.id);
            return (
              <button key={a.id} class={`gallery-frame ${hung ? '' : 'empty'} ${selected === a.id ? 'selected' : ''}`} onClick={() => setSelected(a.id)} onFocus={() => setSelected(a.id)} aria-label={hung ? a.name : 'leerer Rahmen'}>
                {hung ? <Painting art={a} /> : <span>?</span>}
              </button>
            );
          })}
        </div>
        {sel && (
          <p class="center small-text">
            <b>{sel.name}</b> von {sel.artist} – {sel.description}
          </p>
        )}
        {donatable.length > 0 && (
          <div class="gallery-donate">
            <span class="soft small-text">Aus deiner Tasche stiften:</span>
            {donatable.map((a) => (
              <button key={a.id} class="btn small" onClick={() => donate(a.id)}>
                🖼️ {a.name}
              </button>
            ))}
          </div>
        )}
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
