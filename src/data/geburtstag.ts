/**
 * Geburtstage im Dorf: abends die kleine Geburtstagsrunde vor dem Haus des Geburtstagskinds,
 * Linas selbst gebackener Geburtstagskuchen und was die Gäste dabei sagen.
 * Alles freiwillig: Wer den Tag verpasst, verpasst nur einen schönen Abend – nichts geht verloren.
 * Logik: `game/geburtstag.ts`. Die Geburtstage selbst stehen bei den Bewohnern (`NpcDef.birthday`).
 */

/** Die Runde trifft sich von … bis … Uhr (Samstagsparty und Sonntagsessen gehen vor bzw. werden ersetzt) */
export const BIRTHDAY_EVENING: readonly [number, number] = [18, 21];

/** Linas selbst gebackener Kuchen: am Geburtstag das schönste Geschenk */
export const BIRTHDAY_CAKE = 'geburtstagskuchen';

/** Was Gäste in der Runde sagen ({host} = Name des Geburtstagskinds). Lina hat ihre eigenen Zeilen. */
export const GUEST_LINES: Readonly<Record<string, readonly (readonly string[])[]>> = {
  gisela: [
    ['Ich hab einen Kuchen mitgebracht. {host} kriegt das größte Stück.', 'Das zweitgrößte krieg ich. Ich bin die Älteste. Ende der Diskussion.'],
    ['Auf {host}! Mein Ludwig hätte jetzt ein Lied angestimmt.', 'Falsch, aber laut. So muss das.'],
  ],
  olaf: [
    ['Ich hab nachgerechnet: {host} wird dieses Jahr noch netter. Prognose stabil.', 'Christin sagt, ich soll aufhören, Geburtstage zu bilanzieren. Ich hör gleich auf.'],
    ['Schöne Runde, oder?', 'Christin hat Servietten gefaltet. Ich hab sie nur getragen. Ohne Knick.'],
  ],
  christin: [
    ['Ich hab die Teller nach Größe sortiert.', 'Niemand hat’s gemerkt. Aber es fühlt sich richtig an.'],
    ['Ein Geburtstag draußen – herrlich.', 'Solange keiner Krümel ins Haus trägt. Ich hab ein Auge drauf.'],
  ],
  oli: [
    ['Lini, ich hab {host} ein Lied geschrieben. Hardcore-Version.', 'Keine Sorge, ich sing es nicht. Ich schrei es nur leise.'],
    ['Schön, dass alle da sind.', 'Ich steh am liebsten neben dir, Lini. Auch auf fremden Geburtstagen.'],
  ],
  jens: [
    ['Bon anniversaire, {host}! Ich hab Crémant mitgebracht. Aus dem Elsass, nu glar.', 'Das erste Glas kriegt meine Kleene. Wer sonst.'],
    ['Ein Geburtstag ohne Torte ist wie Paris ohne Eiffelturm.', 'Man kann hin. Aber warum sollte man.'],
  ],
  lars: [
    ['Ich hab {host} untersucht: ein Jahr älter. Prognose: Feiern hilft.', 'Ich verschreib zwei Stück Kuchen. Mindestens.'],
    ['Prost auf {host}!', 'Ein Bier zum Anstoßen. Eins. Ärztlich vertretbar.'],
  ],
  thalia: [
    ['Ich hab eine Playlist nur für {host} gemacht!', 'Drei Stunden. Mit Tanzpause. Die Tanzpause ist auch getanzt.'],
    ['Geburtstag ist wie Party, nur mit Kerzen.', 'Und Kerzen sind wie Discolicht. Nur langsamer.'],
  ],
};

/** Was die Gäste an Linas eigenem Geburtstag in der Runde sagen */
export const LINA_GUEST_LINES: Readonly<Record<string, readonly string[]>> = {
  gisela: ['Mein Mäuschen hat Geburtstag, und alle sind gekommen.', 'Na, siehste. So gehört sich das.'],
  olaf: ['Alles Gute, mein Schatz. Ich bin sehr stolz auf dich.', 'Das ist keine Bilanz. Das ist einfach so.'],
  christin: ['Wir haben ein bisschen geschmückt, Lina.', 'Die Ballons hängen alle auf derselben Höhe. Ich hab nachgemessen.'],
  oli: ['Alle sind wegen dir hier, Lini.', 'Ich auch. Aber ich wär sowieso hier. Ich wohn ja hier.'],
  jens: ['Meine Kleene hat Geburtstag! Nu, da hammer uns doch alle schick gemacht.', 'Ich ganz besonders. Natürlich.'],
  lars: ['Herzlichen Glückwunsch, Schwesterherz.', 'Ich hab dir nichts verschrieben. Heute ist ärztlich alles erlaubt. Fast alles.'],
  thalia: ['Lina! Das ist DEIN Abend!', 'Ich hab einen Tanz für dich einstudiert. Du tanzt mit. Keine Widerrede.'],
};

/** Dank für Linas selbst gebackenen Geburtstagskuchen am Geburtstag (statt der üblichen Geschenk-Zeilen) */
export const CAKE_THANKS: Readonly<Record<string, readonly string[]>> = {
  gisela: ['Selbst gebacken? Für mich?', 'Na … der ist ja beinahe so gut wie meiner. Beinahe. Komm her, mein Mäuschen.'],
  olaf: ['Ein Kuchen, selbst gebacken!', 'Den Wert kann man gar nicht ausrechnen. Ich versuch’s trotzdem: unbezahlbar.'],
  christin: ['Oh, Lina, der ist ja wunderschön.', 'Und so gleichmäßig geschnitten. Ich bin ein bisschen gerührt.'],
  oli: ['Lini … du hast mir einen Kuchen gebacken?', 'Ich ess ihn nicht. Ich guck ihn nur an. … Okay, ich ess ihn. Aber langsam.'],
  jens: ['Ma chérie! Ein Geburtstagskuchen, selbst gebacken!', 'Nu freilich kommt der in die Galerie. Für fünf Minuten. Dann ess ich ihn.'],
  lars: ['Selbst gebacken? Das ist das beste Rezept, das ich je bekommen hab.', 'Und ich hab schon viele Rezepte ausgestellt.'],
  thalia: ['Lina! Ein Kuchen! Für MICH!', 'Ich ess ihn nach dem Training. Oder vorher. Oder beides.'],
};

/** Album: Lina erzählt, wenn sie zum ersten Mal einen Geburtstag mitgefeiert hat (Geschenk am Geburtstag) */
export const BIRTHDAY_MOMENTS: Readonly<Record<string, string>> = {
  gisela: 'Omas Geburtstag. Sie hat behauptet, sie will keine Geschenke. Dann hat sie jedes einzeln bewundert.',
  olaf: 'Papas Geburtstag, am selben Tag wie Onkel Jens. Die beiden haben sich gegenseitig „Frère“ zugeprostet.',
  christin: 'Christins Geburtstag. Die Ballons hingen alle gleich hoch. Sie hat es bemerkt und sich gefreut.',
  oli: 'Olis Geburtstag. Er hat den ganzen Abend gestrahlt, und ich glaube, ich auch.',
  jens: 'Onkel Jens hatte Geburtstag, am selben Tag wie Papa. Doppelt Kuchen, doppelt Trubel.',
  lars: 'Lars’ Geburtstag. Er hat für jeden Gast einen eigenen Spruch gehabt. Für mich zwei.',
  thalia: 'Thalias Geburtstag. Erst Kerzen auspusten, dann bis spät tanzen. Genau so wollte sie es.',
};
