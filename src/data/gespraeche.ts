/**
 * Spontane Gespräche zwischen Bewohnern: Begegnen sich zwei draußen, bleiben sie kurz stehen und unterhalten sich
 * (Sprechblasen über den Köpfen, Lina kann mithören). Spricht Lina einen der beiden währenddessen an, geht er darauf ein.
 *
 * Schlüssel = „erster+zweiter“ Sprecher. Jeder Austausch: [erster, zweiter, optional wieder der erste].
 * Keine erfundenen Familiengeschichten – nur Eigenheiten, die die Figuren ohnehin haben.
 */
export type Exchange = readonly [string, string] | readonly [string, string, string];

export const PAIR_CHATS: Readonly<Record<string, readonly Exchange[]>> = {
  'gisela+olaf': [
    ['Olaf, deine Weste sitzt schief.', 'Gisela, sie sitzt exakt nach Schnittmuster.'],
    ['Olaf, es fehlen drei Kekse.', 'Ich hab nachgezählt, Gisela. Es fehlen vier.', '… Das war die Qualitätskontrolle.'],
  ],
  'gisela+christin': [
    ['Christin, Kind, setz dich mal hin.', 'Gleich, Gisela. Erst die Bank abwischen.'],
    ['Christin, du hast meine Wolle sortiert. Ich find nichts mehr.', 'Das ist ein gutes Zeichen, Gisela. Du hast gesucht.'],
  ],
  'olaf+christin': [
    ['Christin, ich habe die Haushaltskasse geprüft.', 'Und? Stimmt alles?', 'Ja. Ich war fast enttäuscht.'],
    ['Olaf, deine Schuhe stehen nicht im Regal.', 'Sie stehen im Flur. Der Flur ist ein Regal. Fast.'],
  ],
  'oli+lars': [
    ['Lars, hast du schon was gegessen?', 'Oli, medizinisch ist Kaffee keine Mahlzeit.', 'Er ist mein Frühstück.'],
    ['Oli, mach die Hände locker beim Training.', 'Ich bin locker!', 'Du hältst die Kaffeetasse mit der Faust.'],
  ],
  'thalia+jens': [
    ['Jens, dein Hoodie hat genau die Farbe meiner Trainingshose.', 'Ma chérie, das ist ein Kompliment. Sag es nochmal!'],
    ['Thalia, ich male dich als Tänzerin.', 'Dann bitte mit Konfetti. Richtig viel, nicht nur Pastell.'],
  ],
  'thalia+lars': [
    ['Lars, ich war heute schon zweimal laufen.', 'Und ich bin nicht sicher, ob ich das wissen musste.', 'Musstest du nicht. Aber jetzt weißt du es.'],
    ['Thalia, trink mal was.', 'Ich trinke. Wasser. Ernsthaft.'],
  ],
  'jens+lars': [
    ['Lars, mon cher, du musst mehr essen.', 'Jens, ich bin Arzt. Ich ernähre mich ausgewogen.', 'Dann iss Croissants. Butter links, Zucker rechts – ausgewogen.'],
    ['Jens, dein Menü hat zu viel Butter.', 'Butter ist ein Lebensgefühl, Lars.'],
  ],
  'gisela+jens': [
    ['Jens, trägst du schon wieder diese Hose?', 'Gisela, das ist Mode.', 'Das ist eine Hose.'],
    ['Soll ich dir was aus Paris mitbringen, Gisela?', 'Eine anständige Wollmütze.'],
  ],
  'oli+thalia': [
    ['Oli, Hardcore und Techno haben dieselbe Bruchkante.', 'Das stimmt nicht, Thalia.', 'Gefühlt.'],
    ['Thalia, hast du schon mal einen Moshpit gesehen?', 'Ja. Das ist Tanzen mit Körpereinsatz. Ich bin Fan.'],
  ],
  'gisela+lars': [
    ['Lars, hast du wieder jemandem Geld abgenommen?', 'Oma, ich hab nur eine Rechnung geschrieben.'],
    ['Lars, die Ärzte wollen nur mein Geld.', 'Oma, ich bin Arzt. Ich will nur deinen Blutdruck.'],
  ],
  'olaf+jens': [
    ['Jens, ich bin der Pünktlichere.', 'Und ich bin der Hübschere, Olaf.'],
    ['Jens, deine Zahlen stimmen nicht.', 'Meine Zahlen sind künstlerisch, Olaf.'],
  ],
  'christin+thalia': [
    ['Thalia, deine Karten liegen nicht gerade.', 'Sie liegen topografisch korrekt, Christin.'],
    ['Thalia, möchtest du einen Kaffee?', 'Ja. Aber bitte nicht auf die Karte.'],
  ],
  'oli+olaf': [
    ['Olaf, danke für den Haushaltsplan.', 'Gern, Oli. Mit Diagrammen.'],
    ['Oli, du trinkst zu viel Kaffee.', 'Olaf, das ist eine Investition.'],
  ],
};

/** Gespräch zweier Bewohner (Reihenfolge egal): Schlüssel + ob die Sprecher getauscht werden müssen */
export function pairChatKey(a: string, b: string): { key: string; swapped: boolean } | null {
  if (PAIR_CHATS[`${a}+${b}`]) return { key: `${a}+${b}`, swapped: false };
  if (PAIR_CHATS[`${b}+${a}`]) return { key: `${b}+${a}`, swapped: true };
  return null;
}
