/**
 * Fotomodus: Schnappschuss mit Rahmen. Rahmen wählen, als PNG speichern (Download) oder noch ein Foto machen.
 * Das Bild bleibt auf dem Gerät – es wird nicht hochgeladen oder im Spielstand gespeichert.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { formatDate, getSeason, SEASON_LABELS } from '../core/time';
import { drawFramedPhoto, FRAME_STYLES, type FrameStyle, photoFileName } from '../gfx/photoFrame';
import type { Session } from '../game/session';
import { showToast, ui } from './store';

export function PhotoPanel({ session, image }: { session: Session; image: string }) {
  const [style, setStyle] = useState<FrameStyle>('polaroid');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const holder = useRef<HTMLDivElement>(null);
  const framed = useRef<HTMLCanvasElement | null>(null);
  const close = () => ui.set({ panel: null });

  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = image;
  }, [image]);

  const now = session.clock();
  const caption = { date: `${formatDate(now)} ${now.getFullYear()}`, place: `${session.data?.villageName ?? ''} · ${SEASON_LABELS[getSeason(now)]}` };

  useEffect(() => {
    if (!img || !holder.current) return;
    const c = drawFramedPhoto(img, img.naturalWidth, img.naturalHeight, style, caption);
    c.className = 'photo-preview';
    framed.current = c;
    holder.current.replaceChildren(c);
  }, [img, style]);

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

  const save = () => {
    const c = framed.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photoFileName(session.clock());
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast('Foto gespeichert. 📷');
    }, 'image/png');
  };

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card photo-card pop-in">
        <h2 class="card-title">📷 Foto</h2>
        <div class="photo-frame" ref={holder} />
        <div class="photo-styles">
          {FRAME_STYLES.map((f) => (
            <button key={f.id} class={`chip small ${style === f.id ? 'active' : ''}`} onClick={() => setStyle(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Schließen
          </button>
          <button class="btn" onClick={() => session.bus.emit('foto:aufnehmen', undefined)}>
            🔄 Neues Foto
          </button>
          <button class="btn primary" disabled={!img} onClick={save}>
            💾 Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
