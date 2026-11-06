/**
 * Winterzauber: Olis Adventskalender, Schneebälle auf der Wiese und der Punschstand
 * am Weihnachtsbaum. Regeln in `game/winter.ts`.
 */

export interface AdventDoor {
  /** Brieftext (Oli nennt Lina „Lini“) */
  body: string;
  gift?: { itemId: string; count: number };
}

/** Wie viele Schneebälle jeden Wintertag auf der Wiese liegen */
export const SNOWBALLS_PER_DAY = 9;

/** Olis Adventskalender: ein Türchen pro Tag vom 1. bis 24. Dezember (Index 0 = 1. Dezember) */
export const ADVENT_DOORS: readonly AdventDoor[] = [
  { body: 'Türchen 1!\n\nIch hab dir einen Adventskalender gebastelt, Lini. 24 Türchen, 24 Briefe. Das hier ist der erste.\n\nDrin: ein Keks. Ich hab ihn bei Oma stibitzt. Sag ihr nichts.', gift: { itemId: 'keks', count: 1 } },
  { body: 'Türchen 2!\n\nHeute ist kein Geschenk drin. Nur ein Zettel:\n\n„Ich hab dich lieb.“\n\nIch weiß, sehr kreativ. Aber wahr.' },
  { body: 'Türchen 3!\n\nEin Rezept! Bratäpfel. Apfel aushöhlen, Keks rein, ab in den Ofen. Das ganze Haus riecht dann nach Weihnachten.\n\nMachst du mir einen? Bitte? 🥺', gift: { itemId: 'rezept-bratapfel', count: 1 } },
  { body: 'Türchen 4!\n\nDrei Schneebälle. Frisch gerollt. Ich hab sie im Gefrierfach aufbewahrt, damit sie bis zu dir halten.\n\nBau was Schönes draus. Oder wirf einen nach Lars. Er hat es verdient.', gift: { itemId: 'schneeball', count: 3 } },
  { body: 'Türchen 5!\n\nEin roter Apfel. Ich hab ihn so lange poliert, bis ich mich drin spiegeln konnte. Hab dabei Grimassen geschnitten. Winston war beeindruckt.', gift: { itemId: 'apfel', count: 2 } },
  { body: 'Türchen 6 – Nikolaus! 🎅\n\nHast du deine Stiefel rausgestellt? Ich hab sie gefüllt: mit Keksen.\n\nUnd ich hab sie geputzt. Das macht der Nikolaus nämlich auch. Steht so in den Regeln.', gift: { itemId: 'keks', count: 3 } },
  { body: 'Türchen 7!\n\nEin Glitzerstein, den ich am Fluss gefunden hab. Er funkelt fast so wie deine Augen, wenn du von einer neuen Horrorserie erzählst.', gift: { itemId: 'glitzerstein', count: 1 } },
  { body: 'Türchen 8!\n\nHeute ein Gutschein: „Einmal Füße wärmen. Einlösbar jederzeit. Auch nachts. Auch mit kalten Zehen.“\n\nIch bereue es schon ein bisschen. Aber nur ein bisschen.' },
  { body: 'Türchen 9!\n\nZimtsterne! Das Rezept hab ich Oma abgeschwatzt. Sie hat gesagt: „Aber nur, weil es für Lina ist.“\n\nIch glaub, sie mag mich langsam.', gift: { itemId: 'rezept-zimtsterne', count: 1 } },
  { body: 'Türchen 10!\n\nVergissmeinnicht-Samen. Für den Frühling. Damit du im Winter schon was hast, worauf du dich freuen kannst.', gift: { itemId: 'samen-vergissmeinnicht', count: 2 } },
  { body: 'Türchen 11!\n\nKein Geschenk, sondern eine Liste. „Dinge, die ich an Lini liebe“, Teil 1 von unendlich:\n\n1. Wie du lachst, wenn im Horrorfilm jemand in den Keller geht.\n2. Deine Sommersprossen.\n3. Wie du kochst und dabei summst.' },
  { body: 'Türchen 12!\n\nZwei Eier. Für Plätzchen. Oder Rührei. Ich will dich nicht beeinflussen.\n\n(Rührei.)', gift: { itemId: 'ei', count: 2 } },
  { body: 'Türchen 13!\n\nEin Ast. Ein sehr schöner Ast. Ich hab zwanzig Minuten nach dem perfekten gesucht.\n\nFür die Arme von deinem Schneemann. Ich hoffe, er winkt damit.', gift: { itemId: 'ast', count: 2 } },
  { body: 'Türchen 14!\n\nEine Rose. Im Dezember! Frag nicht, wie ich das geschafft hab. Thalia hat geholfen. Und ein Gewächshaus.', gift: { itemId: 'rose', count: 1 } },
  { body: 'Türchen 15!\n\nWinston hat dieses Türchen gemacht. Er hat einen Keks reingelegt und dann den halben Keks wieder rausgegessen.\n\nEs ist also ein halber Keks. Mit Liebe. Und Sabber.', gift: { itemId: 'keks', count: 1 } },
  { body: 'Türchen 16!\n\nEin Gutschein für einen Filmabend. Du suchst aus. Auch wenn es wieder der mit der Puppe ist.\n\nIch halte mir dann einfach das Kissen vors Gesicht. Wie immer.' },
  { body: 'Türchen 17!\n\nHerzmuschel vom Strand. Sie war ganz allein da unten im kalten Sand. Jetzt hat sie dich.', gift: { itemId: 'herzmuschel', count: 1 } },
  { body: 'Türchen 18!\n\nNoch sechs Tage! Ich bin aufgeregter als Winston, wenn es Leberwurst gibt.\n\nDrin: zwei Pfirsiche aus Omas Vorrat. Sie hat sie mir „geliehen“. Ich glaub nicht, dass ich sie zurückgeben muss.', gift: { itemId: 'pfirsich', count: 2 } },
  { body: 'Türchen 19!\n\n„Dinge, die ich an Lini liebe“, Teil 2:\n\n4. Wie du Winston in einer Babystimme fragst, ob er ein guter Junge ist.\n5. Dass er es jedes Mal ist.\n6. Dass du mich jeden Tag ein bisschen glücklicher machst.' },
  { body: 'Türchen 20!\n\nSonnenblumenkerne. Für die Vögel. Oder fürs Beet. Oder für mich, wenn wir Datingshows gucken. Ich knabber dann so nervös.', gift: { itemId: 'samen-sonnenblume', count: 3 } },
  { body: 'Türchen 21!\n\nDer kürzeste Tag des Jahres. Ab morgen wird es wieder heller.\n\nAber ehrlich gesagt: Mit dir ist es eh nie richtig dunkel. Kitschig? Ja. Ernst gemeint? Auch ja.' },
  { body: 'Türchen 22!\n\nDrei Kekse. Diesmal hat Oma sie mir freiwillig gegeben. Sie hat gesagt: „Für das Mädchen. Nicht für dich.“\n\nIch hab trotzdem einen gegessen. Es sind also zwei. Psst.', gift: { itemId: 'keks', count: 2 } },
  { body: 'Türchen 23!\n\nMorgen ist Heiligabend! Ich hab das letzte Türchen schon fertig und muss mich sehr zusammenreißen, es nicht heute schon zu verraten.\n\nNur so viel: Es schneit darin. 🤫' },
  { body: 'Türchen 24 – Frohe Weihnachten, Lini! 🎄💕\n\nEine Schneekugel. Mit uns drin: du, ich und Winston vor unserem kleinen Haus.\n\nSchüttel sie mal. Es schneit Herzchen.\n\nDanke, dass du mein Zuhause bist.\n\nDein Oli', gift: { itemId: 'schneekugel-wir', count: 1 } },
];

/** Punschstand am Weihnachtsbaum: in der Adventszeit nachmittags & abends geöffnet */
export const PUNSCH_HOURS: readonly [number, number] = [15, 22];

export interface PunschDrink {
  id: 'kinderpunsch' | 'gluehwein' | 'kakao';
  label: string;
  price: number;
  lines: readonly string[];
}

export const PUNSCH_DRINKS: readonly PunschDrink[] = [
  { id: 'kinderpunsch', label: '🍹 Kinderpunsch', price: 20, lines: ['Ein dampfender Becher Kinderpunsch mit Orangenscheibe.', 'Mmh … warm und süß. Die Finger tauen langsam wieder auf.'] },
  { id: 'kakao', label: '☕ Heißer Kakao', price: 25, lines: ['Heißer Kakao mit einem Berg Sahne obendrauf.', 'Jetzt hast du einen Sahnebart. Steht dir.'] },
  { id: 'gluehwein', label: '🍷 Glühwein', price: 30, lines: ['Ein kleiner Becher Glühwein, nach Zimt und Nelken duftend.', 'Schön warm im Bauch. Einer reicht – sonst sagt Lars wieder was.'] },
];
