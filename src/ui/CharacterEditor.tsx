/**
 * Charakter-Editor: Frisur, Haarfarbe, Hautton, Outfit, Farben – mit
 * Live-Vorschau. Beim neuen Spiel zusätzlich: Name des Dorfes.
 */
import { useState } from 'preact/hooks';
import {
  type Appearance,
  EYE_COLORS,
  HAIR_COLORS,
  SMILES,
  HAIR_STYLES,
  OUTFIT_COLORS,
  OUTFITS,
  SKIN_TONES,
} from '../core/appearance';
import { DEFAULT_VILLAGE_NAME } from '../core/save';
import { Preview3D } from './Preview3D';

const VILLAGE_IDEAS = [
  'Wolkenwiese',
  'Kirschblütental',
  'Sonnenhügel',
  'Muschelbucht',
  'Kleeblattdorf',
  'Mondscheinau',
  'Honigweiler',
  'Pusteblumenfeld',
  'Zuckerwattental',
  'Glühwürmchenhain',
];

interface Props {
  mode: 'new' | 'edit';
  initial: Appearance;
  initialVillage?: string;
  onDone: (appearance: Appearance, villageName: string) => void;
  onCancel: () => void;
}

export function CharacterEditor({ mode, initial, initialVillage, onDone, onCancel }: Props) {
  const [a, setA] = useState<Appearance>(initial);
  const [village, setVillage] = useState(initialVillage ?? DEFAULT_VILLAGE_NAME);
  const [angle, setAngle] = useState(0);

  const set = <K extends keyof Appearance>(key: K, value: Appearance[K]) => setA((prev) => ({ ...prev, [key]: value }));

  return (
    <div class="modal-layer">
      <div class="card editor pop-in">
        <h2 class="card-title">{mode === 'new' ? 'Wie sieht Lina heute aus?' : 'Aussehen ändern'}</h2>
        <div class="editor-body">
          <div class="editor-preview">
            <div class="preview-stage">
              <Preview3D appearance={a} angle={angle} />
            </div>
            <button class="btn small" onClick={() => setAngle((v) => v + Math.PI / 2)}>
              ⟲ Drehen
            </button>
          </div>
          <div class="editor-options">
            <OptionRow label="Frisur">
              {HAIR_STYLES.map((o) => (
                <Chip key={o.id} active={a.hairStyle === o.id} onClick={() => set('hairStyle', o.id)}>
                  {o.label}
                </Chip>
              ))}
            </OptionRow>
            <OptionRow label="Haarfarbe">
              {HAIR_COLORS.map((o) => (
                <Swatch key={o.id} color={o.id} title={o.label} active={a.hairColor === o.id} onClick={() => set('hairColor', o.id)} />
              ))}
            </OptionRow>
            <OptionRow label="Hautton">
              {SKIN_TONES.map((o) => (
                <Swatch key={o.id} color={o.id} title={o.label} active={a.skinTone === o.id} onClick={() => set('skinTone', o.id)} />
              ))}
            </OptionRow>
            <OptionRow label="Augenfarbe">
              {EYE_COLORS.map((o) => (
                <Swatch key={o.id} color={o.id} title={o.label} active={a.eyeColor === o.id} onClick={() => set('eyeColor', o.id)} />
              ))}
            </OptionRow>
            <OptionRow label="Lächeln">
              {SMILES.map((o) => (
                <Chip key={o.id} active={a.smile === o.id} onClick={() => set('smile', o.id)}>
                  {o.label}
                </Chip>
              ))}
            </OptionRow>
            <OptionRow label="Kleidung">
              {OUTFITS.map((o) => (
                <Chip key={o.id} active={a.outfit === o.id} onClick={() => set('outfit', o.id)}>
                  {o.label}
                </Chip>
              ))}
            </OptionRow>
            <OptionRow label="Lieblingsfarbe">
              {OUTFIT_COLORS.map((o) => (
                <Swatch key={o.id} color={o.id} active={a.outfitColor === o.id} onClick={() => set('outfitColor', o.id)} />
              ))}
            </OptionRow>
            <OptionRow label="Akzentfarbe">
              {OUTFIT_COLORS.map((o) => (
                <Swatch key={o.id} color={o.id} active={a.accentColor === o.id} onClick={() => set('accentColor', o.id)} />
              ))}
            </OptionRow>
            <OptionRow label="Extras">
              <Chip active={a.glasses} onClick={() => set('glasses', !a.glasses)}>
                👓 Brille
              </Chip>
              <Chip active={a.blush} onClick={() => set('blush', !a.blush)}>
                🌸 Bäckchen
              </Chip>
              <Chip active={a.freckles} onClick={() => set('freckles', !a.freckles)}>
                ✨ Sommersprossen
              </Chip>
            </OptionRow>
            {mode === 'new' && (
              <div class="option-row">
                <div class="option-label">Name deines Dorfes</div>
                <div class="village-input">
                  <input
                    type="text"
                    maxLength={24}
                    value={village}
                    onInput={(e) => setVillage((e.target as HTMLInputElement).value)}
                    aria-label="Name deines Dorfes"
                  />
                  <button
                    class="btn small"
                    title="Idee würfeln"
                    onClick={() => {
                      const options = VILLAGE_IDEAS.filter((v) => v !== village);
                      setVillage(options[Math.floor(Math.random() * options.length)]);
                    }}
                  >
                    🎲
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={onCancel}>
            {mode === 'new' ? 'Zurück' : 'Abbrechen'}
          </button>
          <button class="btn primary" onClick={() => onDone(a, village)}>
            {mode === 'new' ? 'Einziehen! 🏡' : 'Fertig ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionRow({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div class="option-row">
      <div class="option-label">{label}</div>
      <div class="option-items">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: preact.ComponentChildren }) {
  return (
    <button class={`chip ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

function Swatch({ color, active, onClick, title }: { color: string; active: boolean; onClick: () => void; title?: string }) {
  return (
    <button
      class={`swatch ${active ? 'active' : ''}`}
      style={{ background: color }}
      onClick={onClick}
      title={title ?? color}
      aria-label={title ?? color}
      aria-pressed={active}
    />
  );
}
