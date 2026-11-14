/**
 * Lina an der Hantelbank: der Gag – süßes Gemüt, brutal schwere Hantel.
 * Reine Spielerei, keine Pflicht und keine Belohnung außer Olis Begeisterung.
 */

/** Toasts während des Satzes (Gewicht steigt – ironisch hoch) */
export const TRAINING_REPS: readonly string[] = [
  '20 kg … Aufwärmen. 🌸',
  '60 kg … locker. 💪',
  '100 kg … hm, geht noch. 😌',
  '140 kg … Lina lächelt dabei. 🙂',
  '180 kg … das Lächeln bleibt. 😊',
  '220 kg!! … Die Hantel biegt sich. Lina nicht. 💪✨',
];

/** Lina allein (Oli nicht im Zimmer) */
export const TRAINING_SOLO: readonly (readonly string[])[] = [
  ['Puh! Das war ein guter Satz. Winston guckt beeindruckt – oder er will ein Leckerli.', '„Nur noch ein Satz“, sagt man. Ich weiß jetzt, was Oli meint.'],
  ['Geschafft! Ein Satz mit richtig viel Gewicht. Die Hantel ist so schwer, die Wärmflasche wäre neidisch.', 'Ich sollte Oli davon erzählen. Er würde ausflippen.'],
];

/** Oli ist dabei und ist begeistert */
export const TRAINING_OLI: readonly (readonly string[])[] = [
  ['Oli: „LINI?! Das waren über 200 Kilo!“', 'Oli: „Und du hast dabei gelächelt! Ich bin so stolz auf dich – und ein bisschen eingeschüchtert.“'],
  ['Oli: „Wow. Wow. WOW. Wer hätte das gedacht, bei so einem süßen Pulli!“', 'Lina: „Eben.“ 😌', 'Oli: „Ich nehm dich jetzt immer als Trainingspartnerin.“'],
  ['Oli: „Das war … unfair. Ich quäle mich mit 80 und du so?“', 'Lina: „Technik, Oli.“', 'Oli: „Ich liebe dich, Lini. Und ich hab ein bisschen Angst.“'],
];

/** Bei Thalia: sie steht neben der Bank und feuert an (ohne Freundschaftspunkte, ein Moment unter Freundinnen) */
export const TRAINING_THALIA_LEAD: readonly string[] = [
  'Thalia klopft auf die Hantelbank. „Komm, Lina, eine Runde! Ich pass auf.“',
  'Die Gewichte heißen Gustav, Ingrid und der kleine Dieter. Heute ist Ingrid dran.',
];

/** Thalia ist gerade nicht zu Hause */
export const TRAINING_THALIA_ABSENT: readonly string[] = [
  'Thalias Hantelbank. Allein macht das nur halb so viel Spaß. Ich komme wieder, wenn sie da ist. 💪',
];

export const TRAINING_THALIA: readonly (readonly string[])[] = [
  ['Thalia: „Das war … Moment. Das waren über 200 Kilo? Bei diesem Lächeln?“', 'Lina: „Technik.“', 'Thalia: „Okay. Nächste Woche trainierst du mich.“'],
  ['Thalia: „Und eins, und zwei – Lina, du bist ein Wunder in Oversize!“', 'Thalia: „Sag mal, wollen wir danach Pizza? Ich lade ein. Dieter hat sich das verdient.“'],
  ['Thalia: „Ich wusste, dass du das kannst. Ich wollte es nur live sehen.“', 'Lina: „Und du hast nicht mal gezittert, als du gespottet hast.“', 'Thalia: „Ich bin Profi. Und ein kleines bisschen beeindruckt.“'],
];
