/**
 * Brabbelsprache (reine Logik): Aus einer Textzeile wird für einen Buchstaben eine kleine
 * Silbe – mit Mitlaut davor, Selbstlaut aus dem Text und der Satzmelodie (Frage geht hoch,
 * Aussage am Ende runter). Gespielt wird in `audio/Audio.ts`.
 */

export interface Syllable {
  /** Mitlaut am Silbenanfang (klein geschrieben) oder null */
  consonant: string | null;
  /** Selbstlaut, der klingt (a, e, i, o, u, ä, ö, ü) */
  vowel: string;
  /** Wie weit im Satz (0 = Anfang, 1 = Ende) */
  pos: number;
  /** Satz endet mit Fragezeichen */
  question: boolean;
  /** letzte Silbe vor dem Satzende */
  final: boolean;
  /** Ausruf (!) – etwas lebhafter */
  excited: boolean;
}

const VOWELS = 'aeiouäöüy';
const END = /[.!?…]/;

/** Silbe für den Buchstaben an `index` in `line`; `every` = jede wievielte Stelle brabbelt */
export function syllableAt(line: string, index: number, every = 3): Syllable {
  const chars = [...line];
  const ch = (chars[index] ?? 'a').toLowerCase();
  let vowel = VOWELS.includes(ch) ? ch : '';
  for (let j = index + 1; !vowel && j < Math.min(chars.length, index + 4); j++) {
    const c = chars[j].toLowerCase();
    if (VOWELS.includes(c)) vowel = c;
  }
  if (!vowel || vowel === 'y') vowel = vowel === 'y' ? 'ü' : 'e';
  // Satzgrenzen
  let start = index;
  while (start > 0 && !END.test(chars[start - 1])) start--;
  let end = index;
  while (end < chars.length && !END.test(chars[end])) end++;
  const mark = chars[end] ?? '';
  // gibt es danach im selben Satz noch eine brabbelnde Stelle (Buchstabe auf einem `every`-Index)?
  let more = false;
  for (let j = index + 1; j < end; j++) {
    if (j % every === 0 && /\p{L}/u.test(chars[j])) {
      more = true;
      break;
    }
  }
  return {
    consonant: VOWELS.includes(ch) ? null : ch,
    vowel,
    pos: end > start ? (index - start) / (end - start) : 0,
    question: mark === '?',
    final: !more,
    excited: mark === '!',
  };
}
