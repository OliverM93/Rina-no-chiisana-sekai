/**
 * Olafs Dorfkasse: Hausausbau bestellen (als zinsloser Kredit) und
 * zurückzahlen – wann und wie viel man möchte – oder vom Sparbuch bezahlen
 * („Olafs Bausparen“: Papa legt 25 % dazu). Das Sparbuch bringt jeden Montag Zinsen.
 */
import { useEffect } from 'preact/hooks';
import { HOUSE_STAGES } from '../data/house';
import { formatMoney } from '../game/gameplay';
import { depositSavings, nextStage, orderExpansion, repayLoan, withdrawSavings } from '../game/home';
import { bausparShare, INTEREST_CAP, INTEREST_RATE, interestFor } from '../core/bank';
import type { Session, UiPanel } from '../game/session';
import { showToast, ui, useSessionVersion } from './store';

export function BankPanel({ session, panel }: { session: Session; panel: Extract<UiPanel, { kind: 'bank' }> }) {
  useSessionVersion(session);
  const close = () => {
    ui.set({ panel: null });
    panel.onClose?.();
  };
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
  const house = data.house;
  const loan = data.bank.loan;
  const money = data.money;
  const next = nextStage(session);
  const current = HOUSE_STAGES[house.stage];

  const order = (pay: 'kredit' | 'sparbuch') => {
    const r = orderExpansion(session, pay);
    if (r === 'ok' && pay === 'sparbuch') showToast(`Bezahlt vom Sparbuch – Papa hat ${formatMoney(next ? next.price - bausparShare(next.price) : 0)} dazugelegt! In ein paar Minuten ist alles fertig. 🔨`);
    else if (r === 'ok') showToast('Abgemacht! In ein paar Minuten ist dein Ausbau fertig. 🔨');
    else if (r === 'kredit-offen') showToast('Erst den alten Kredit abbezahlen – dann bauen wir weiter.');
    else if (r === 'zu-wenig-gespart') showToast('Auf dem Sparbuch liegt noch nicht genug.');
  };
  const savings = data.bank.savings;
  const put = (amount: number) => {
    const n = depositSavings(session, amount);
    if (n > 0) showToast(`${formatMoney(n)} aufs Sparbuch gelegt. 📒`);
    else showToast('Gerade hast du keine Sternchen dabei.');
  };
  const take = (amount: number) => {
    const n = withdrawSavings(session, amount);
    if (n > 0) showToast(`${formatMoney(n)} abgehoben. Viel Spaß damit!`);
  };
  const pay = (amount: number) => {
    const paid = repayLoan(session, amount);
    if (paid > 0) showToast(`Danke! ${formatMoney(paid)} zurückgezahlt.`);
    else showToast('Gerade hast du keine Sternchen dabei.');
  };

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card bank pop-in">
        <h2 class="card-title">🏦 Dorfkasse</h2>
        <p class="soft center">„Hier bekommst du alles für deinen Hausausbau – ganz ohne Zinsen. Und was übrig ist, legen wir aufs Sparbuch!“ – Olaf</p>
        <div class="bank-cols">
        <div class="bank-col">
        <div class="bank-row">
          <span>Dein Haus:</span>
          <b>{current.name}</b>
        </div>
        <div class="bank-row">
          <span>Offener Kredit:</span>
          <b>{loan > 0 ? formatMoney(loan) : 'keiner 🎉'}</b>
        </div>
        <div class="bank-row">
          <span>Deine Sternchen:</span>
          <b>{formatMoney(money)}</b>
        </div>

        {house.pending ? (
          <div class="bank-box">🔨 Gerade wird gebaut: <b>{HOUSE_STAGES[house.pending.stage].name}</b> – in ein paar Minuten ist alles fertig!</div>
        ) : next ? (
          <div class="bank-box">
            <div class="item-name">Nächster Ausbau: {next.name}</div>
            <div class="item-desc">{next.description}</div>
            <div class="item-price">Kosten: {formatMoney(next.price)}</div>
            <div class="bank-order">
              <button class="btn primary" disabled={loan > 0 || data.bank.savings < bausparShare(next.price)} onClick={() => order('sparbuch')} title="Olafs Bausparen: Papa legt 25 % dazu">
                📒 Vom Sparbuch: {formatMoney(bausparShare(next.price))}
              </button>
              <button class="btn" disabled={loan > 0} onClick={() => order('kredit')}>
                🔨 Als Kredit
              </button>
            </div>
            <div class="soft small-text">
              Olafs Bausparen: Zahlst du vom Sparbuch, legt Papa 25 % dazu ({formatMoney(next.price - bausparShare(next.price))}).
              {data.bank.savings < bausparShare(next.price) ? ` Noch ${formatMoney(bausparShare(next.price) - data.bank.savings)} sparen.` : ''}
            </div>
            {loan > 0 && <div class="soft small-text">Erst den offenen Kredit abbezahlen, dann geht es weiter.</div>}
          </div>
        ) : (
          <div class="bank-box">Dein Haus ist fertig ausgebaut! So ein schönes Zuhause. 🏡</div>
        )}

        {loan > 0 && (
          <div class="bank-pay">
            <span>Zurückzahlen:</span>
            {[1000, 5000].map((a) => (
              <button key={a} class="btn small" disabled={money <= 0} onClick={() => pay(a)}>
                {formatMoney(Math.min(a, loan))}
              </button>
            ))}
            <button class="btn small primary" disabled={money <= 0} onClick={() => pay(loan)}>
              Alles, was geht
            </button>
          </div>
        )}

        </div>
        <div class="bank-col">
        <h3 class="bank-sub">📒 Sparbuch</h3>
        <div class="bank-row">
          <span>Guthaben:</span>
          <b>{formatMoney(savings)}</b>
        </div>
        <div class="soft small-text">
          Jeden Montag gibt es {Math.round(INTEREST_RATE * 100)} % Zinsen (höchstens {formatMoney(INTEREST_CAP)} pro Woche).
          {savings > 0 && interestFor(savings) > 0 ? ` Nächstes Mal: etwa ${formatMoney(interestFor(savings))}.` : ''}
          {data.bank.lastInterest > 0 ? ` Zuletzt: ${formatMoney(data.bank.lastInterest)}.` : ''}
        </div>
        <div class="bank-pay">
          <span>Einzahlen:</span>
          {[1000, 5000].map((a) => (
            <button key={a} class="btn small" disabled={money <= 0} onClick={() => put(a)}>
              {formatMoney(a)}
            </button>
          ))}
          <button class="btn small primary" disabled={money <= 0} onClick={() => put(money)}>
            Alles
          </button>
        </div>
        {savings > 0 && (
          <div class="bank-pay">
            <span>Abheben:</span>
            {[1000, 5000].map((a) => (
              <button key={a} class="btn small" onClick={() => take(a)}>
                {formatMoney(Math.min(a, savings))}
              </button>
            ))}
            <button class="btn small" onClick={() => take(savings)}>
              Alles
            </button>
          </div>
        )}
        </div>
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
