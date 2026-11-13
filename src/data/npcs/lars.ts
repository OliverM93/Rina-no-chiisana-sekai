/**
 * Lars – Linas großer Bruder. Arzt mit Praxis & kleiner Apotheke am Dorfplatz.
 * Groß, kräftig, rotblonder Vollbart – und immer einen (Wort-)Witz auf Lager.
 * Mit Oma Gisela liefert er sich liebevolle Wortgefechte („Die Ärzte wollen nur dein Geld!“).
 */
import { LOOKS } from './looks';
import { STYLE_ARRIVAL_LINES } from '../catalog';
import type { NpcDef } from './types';

const STRAND = { x: 20, y: 30, w: 14, h: 3 };

export const LARS: NpcDef = {
  id: 'lars',
  name: 'Lars',
  personality: 'großer Bruder, Arzt mit Praxis & Apotheke, herzlich, beschützend, immer einen Wortwitz auf Lager',
  appearance: LOOKS.lars,
  home: 'praxis-lars',
  movesIn: 'larsEingezogen',
  birthday: { day: 3, month: 1 },
  birthdayLines: {
    greeting: ['Schwesterherz! Heute ist mein Geburtstag. 🎂', 'Ich sag\'s nur, damit du\'s nicht vergisst. Nein, ich sag\'s, weil ich mich über dein Gesicht freue, wenn du\'s merkst.', 'Medizinisch gesehen ist Kuchen am Geburtstag erlaubt. Dringend empfohlen.'],
    thanks: ['Ein Geschenk? Für mich?', 'Danke, Schwesterherz. Ärztlich bestätigt: Das hilft gegen jedes Alter.'],
  },
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:30', label: 'Joggen am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '09:00', label: 'Praxis geöffnet', activity: { kind: 'stehen', x: 24, y: 14, facing: 'down' } },
    { from: '12:30', label: 'Mittagspause zu Hause', activity: { kind: 'zuhause' } },
    { from: '14:00', label: 'Praxis geöffnet', activity: { kind: 'stehen', x: 24, y: 14, facing: 'down' } },
    { from: '17:30', label: 'Feierabend-Runde am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '19:00', label: 'Feierabend', activity: { kind: 'zuhause' } },
    { from: '23:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['thymiantee', 'pfefferminztee', 'fischbroetchen', 'apfelkuchen', 'dorsch', 'hecht', 'gruener-salat', 'karottensuppe', 'strauss-kraeuter'],
    likes: ['apfel', 'birne', 'ei', 'ruehrei', 'obstsalat', 'kamillentee', 'barsch', 'hering', 'pfefferminze', 'kamille', 'hirschkaefer', 'glitzerstein', 'karotte', 'salat', 'tomate', 'kuerbissuppe', 'kartoffelsuppe', 'petersilie', 'strauss-sonne', 'strauss-lavendel', 'strauss-bunt', 'dorsch-gemuese', 'forelle-kraeuter'],
    dislikes: ['weinbergschnecke', 'ohrenqualle', 'aal'],
  },
  dialogue: {
    greetings: [
      { text: ['Tanzen ist gesund!', 'Ärztliche Empfehlung. Ich zeig dir gleich meinen Robot. Patentiert.'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Moin, Schwesterherz!', 'Gut geschlafen? Ich frag aus medizinischen Gründen. Und weil ich dein Bruder bin.'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Na, Kleine?', 'Weißt du, was ein Arzt im Garten macht? Er pflanzt Rezepte. 🌱'] },
      { text: ['Hey Lina!', 'Ich hab heute schon drei Leute behandelt. Zwei davon waren Oma. Sie kam zweimal, um mir zu sagen, dass sie nicht krank ist.'] },
      { text: ['Lina! Gut siehst du aus.', 'Diagnose: kerngesund. Nebenwirkungen: gute Laune.'] },
      { text: ['Na, Feierabend?', 'Ich auch. Ab jetzt bin ich nur noch Bruder. Ohne Kittel. Mit Witzen.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Alles Gute zum Geburtstag, Schwesterherz! 🎂', 'Ich hab dich gründlich untersucht: Du bist ein Jahr älter. Aber kein bisschen weniger toll.'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Bei dem Regen: Schirm nicht vergessen!', 'Sonst bist du nachher nicht nur nass, sondern auch noch erkältet. Und dann musst du zu mir. Und ich bin teuer. … Spaß.'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Schnee! Schal an, Mütze auf!', 'Ärztliche Anordnung. Und brüderliche auch.'], when: { tags: ['wetter-schnee'] }, weight: 3 },
    ],
    chat: [
      { text: ['Schlaf ist die älteste Medizin.', 'Wer gern und viel schläft, macht medizinisch gesehen vieles richtig. Ich sag das nicht nur, weil ich dich kenne.'] },
      { text: ['Eine Wärmflasche ist ein wunderbares Hausmittel.', 'Ich verschreibe sie ungern, weil sie gar nicht auf Rezept ist. Aber sie hilft mehr als manche Tablette.'] },
      { text: ['Du baust Gemüse an? Sehr gut.', 'Karotten, Salat, Kräuter. Als Arzt sage ich: Das ist die beste Medizin. Als Bruder sage ich: Bitte nicht nur Pfannkuchen.'], weight: 3 },
      { text: ['Petersilie, Schnittlauch, Thymian …', 'Ich hab das alles in der Apotheke getrocknet. Zählt als Hausmittel. Oma schwört drauf.'] },
      { text: ['Dr. No aus „Schwerer Weg“ – kennst du den?', 'Fachlich gesehen: streng, aber fair. Genau so einen Chefarzt hätte ich mir manchmal gewünscht. Ich würde mit ihm einen Kaffee trinken.'] },
      { text: ['Auf der Weihnachtsfeier im Krankenhaus wollte jede Kollegin neben mir sitzen.', 'Ich hab gesagt: „Platz ist genug für alle.“ … Das war, glaub ich, nicht die richtige Antwort.'] },
      { text: ['Eine Ärztin hat mich gefragt, ob ich mal „was Privates“ mit ihr besprechen will.', 'Ich hab gesagt: „Gern! Termin nächsten Dienstag.“ … Jetzt versteh ich, warum sie so komisch geguckt hat.'] },
      { text: ['Zwei Krankenschwestern haben mir Kuchen auf den Tisch gestellt. Beide. Gleichzeitig. Mit Zettelchen.', 'Ich hab beide gegessen. Aus Höflichkeit. Und um das Gleichgewicht auf der Station zu halten.'] },
      { text: ['Lina: „Mein Bruder, der Herzensbrecher.“', 'Lars: „Ich bin Herzspezialist. Das ist was ganz anderes.“ – „Ja, ja.“ – „Ehrlich!“'], weight: 2 },
      { text: ['Im Krankenhaus nennen sie mich „Dr. Lars“.', 'Ich hab den Verdacht, es liegt nicht am Kittel. Es ist der Bart. Verrat das niemandem.'] },
      { text: ['Oma sagt, ich bin „ein Fang“.', 'Ich bin kein Fisch, Oma! … Auch wenn ich zugeben muss: Ich beiße manchmal an. Meistens an Kuchen.'] },
      { text: ['Eine Kollegin hat mir ihre Telefonnummer auf einen Rezeptblock geschrieben.', 'Ich hab sie als „Magenschmerzen, dringend“ in die Akte gelegt. Man weiß ja nie.'] },
      { text: ['Du hast wieder Horrorfilme geguckt, oder?', 'Medizinisch gesehen: Gruseln ist gut für den Kreislauf. Kein Rezept nötig. Aber Popcorn in Maßen!'] },
      { text: ['Du guckst so gern diese Dokus über Menschen, die abnehmen wollen, oder?', 'Ehrlich, als Arzt: Die Leute dort sind echte Helden. Das ist so harte Arbeit.'] },
      { text: ['Tanzen ist gesund!', 'Ärztliche Empfehlung. Ich zeig dir gleich meinen Robot. Patentiert.'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Wie schreibt man eigentlich „Praxis Lars“ richtig?', 'Mit Lars und Praxis.', '… So, und nicht mit e, sonst ist es ein See.'], weight: 2 },
      { text: ['Ich hab einen Witz über Chemie.', 'Aber da kommt eh keine Reaktion.'] },
      { text: ['Was ist grün und klopft an die Tür?', 'Ein Klopfsalat. 🥬'] },
      { text: ['Wie nennt man einen Bumerang, der nicht zurückkommt?', 'Stock.'] },
      { text: ['Warum können Seeräuber keinen Kreis zeichnen?', 'Weil sie Pi raten. 🏴‍☠️'] },
      { text: ['Was liegt unter einem Baum und duftet nach Keks?', 'Ein schattiges Plätzchen.'] },
      { text: ['Mein Lieblingsinstrument?', 'Das Stethoskop. Da hör ich immer die besten Herztöne. ❤️'] },
      { text: ['Ich hab Oma heute den Blutdruck gemessen.', 'Sie hat mir dabei erklärt, dass Ärzte nur dein Geld wollen.', 'Ihr Blutdruck war super. Meiner danach nicht mehr.'] },
      { text: ['Oma sagt, gegen alles hilft Kamillentee.', 'Das Schlimme ist: Manchmal hat sie recht. Sag ihr das bloß nicht.'] },
      { text: ['Ich hab Winston untersucht.', 'Diagnose: zu kurze Beine, zu langer Körper, zu viel Niedlichkeit. Unheilbar.'] },
      { text: ['Jens hat mir einen Smoothie gemixt.', 'Grün. Mit Glitzer. Ich hab nicht gefragt, was drin war. Medizinisch gesehen ein Fehler.'], when: { tags: ['jens-da'] } },
      { text: ['Oli hat mich gefragt, ob ich mit ins Gym komme.', 'Ich hab Ja gesagt. Ich bin Arzt – ich weiß, wo die Muskelkater wohnen.'], when: { tags: ['oli-da'] } },
      { text: ['Weißt du noch, wie ich dir früher Pflaster auf jedes Knie geklebt hab?', 'Auch wenn gar nichts war. Hauptsache, du hast gelacht.', 'Mach ich heute noch so. Nur mit mehr Ahnung.'], when: { minHearts: 2 } },
      { text: ['Ich bin froh, dass ich hier bin, Schwesterherz.', 'Ein Dorf mit dir drin – das ist das beste Rezept, das ich kenne.'], when: { minHearts: 3 } },
      { text: ['Im Frühling kommen die Heuschnupfen-Patienten in die Praxis.', 'Ich verschreibe Taschentücher und Geduld. Beides ist selten vorrätig.'], when: { seasons: ['fruehling'] } },
      { text: ['Sonnenschutz, Lina! Zwei Stunden in der Sonne ohne Creme – und du siehst aus wie ein Hummer.', 'Ich sag das als Bruder und als Arzt. Beides mit Nachdruck.'], when: { seasons: ['sommer'] } },
      { text: ['Der Herbst bringt Schnupfen und Kürbisse.', 'Medizinisch gesehen: Kürbissuppe ist die bessere Behandlung. Und kostet weniger Zuzahlung.'], when: { seasons: ['herbst'] } },
      { text: ['Im Winter sage ich meinen Patienten immer dasselbe:', 'Warm anziehen, viel trinken, genug schlafen. Und dann sagen sie: „Gibt’s dafür keine Tablette?“ Nein. Aber Tee.'], when: { seasons: ['winter'] } },
      { text: ['Bei dem Wetter bleibt man am besten drin.', 'Ich hab gerade zwei Stunden in der Praxis gesessen und niemand ist krank geworden. Medizinisch ein perfekter Tag.'], when: { tags: ['wetter-regen'] }, weight: 2 },
      { text: ['Abends versuche ich, keinen Fachkram mehr zu lesen.', 'Heute Abend zum Beispiel: Kochbuch. Ich lerne also noch immer – nur an Zwiebeln statt an Organen.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Ich zocke gerade wieder „Fallout 3“. Alles verstrahlt, aber die Leute sind nett.','Wie im Wartezimmer. Nur mit besseren Waffen.'] },
      { text: ['Bei „Halo“ ruft Oli immer: „Pass auf links!“','Ich bin Arzt, ich weiß, wo links ist. Ich stehe bloß aus Prinzip rechts.'] },
      { text: ['Als Arzt sage ich: Ein Feierabendbier ist völlig okay.','Zwei sind eine Meinung. Drei sind ein Fall für mich. … Ich zähle gerade nicht mit.'] },
      { text: ['Meine kleine Schwester wird nach einem Bier richtig lustig.','Letztens hat sie Winston ihre Lieblings-Diagnose gestellt. „Akuter Dackelblick.“ Sehr treffend.'] },
      { text: ['Lina will Thalia verkuppeln. Ich halte mich raus.','Ärztliche Schweigepflicht. … Okay, ich halte mich nur raus, solange es lustig bleibt.'] },
      { text: ['In Tschechien soll es hervorragendes Bier geben.','Rein wissenschaftlich interessant. Lina und Thalia waren ja eine Woche dort. Ich erwarte einen Bericht. Mit Quellenangaben.'] },
      { text: ['Mein Kumpel Ronny ist Polizist. Wenn ich zu schnell rede, sagt er: „Führerschein und Fahrzeugpapiere, bitte.“', 'Ich hab ihm einmal meinen Arztausweis gezeigt. Er hat trotzdem gepustet. Ich auch – war ein Witz.'] },
      { text: ['Ich hab gestern Sumo geguckt. Zwei Riesen, ein Kreis, drei Sekunden.', 'Effizienter als jede Sprechstunde. Und keiner fragt nach einem Rezept.'] },
      { text: ['Beim Sumo werfen sie vor dem Kampf Salz in den Ring. Zur Reinigung.', 'Ich hab überlegt, das im Wartezimmer einzuführen. Christin würde sofort den Staubsauger holen.'] },
      { text: ['Lina, das wievielte Monster White ist das heute?', 'Ich frag als Arzt. Und als Bruder klau ich dir gleich eins.'] },
    ],
    gifts: {
      liebt: [['Oh, Lina! Das ist ja großartig!', 'Das verschreib ich mir ab sofort selbst. Dreimal täglich.']],
      mag: [['Danke, Kleine!', 'Das ist richtig lieb von dir.']],
      neutral: [['Für mich? Danke!', 'Ich leg das mal ins Wartezimmer. Da freut sich bestimmt jemand.']],
      'mag-nicht': [['Hm. Danke …', 'Ich hab das untersucht. Diagnose: nicht so meins. Aber die Geste war gesund!']],
    },
    giftsByItem: {
      pfefferminztee: ['Pfefferminztee! Mein Lieblingstee.', 'Gut für den Magen, gut für die Nerven – und gut für Brüder, die Wortwitze machen.'],
      kamillentee: ['Kamillentee …', 'Hat Oma dich geschickt? … Danke trotzdem. Er ist ja wirklich gut. Pssst.'],
    },
    giftRepeat: ['Noch was? Du verwöhnst mich, Schwesterherz!', 'Das notier ich in deiner Akte. Unter „lieb“.'],
    heartUp: [['Weißt du was, Lina?', 'Als großer Bruder ist es mein Job, auf dich aufzupassen.', 'Aber ehrlich gesagt passt du mindestens genauso gut auf mich auf.']],
    atHome: [['Aus der Praxis kommt leises Gelächter.', '„Bin gleich da! Ich erzähl gerade dem Skelett einen Witz. Es lacht sich schon krumm!“']],
    atHomeSleeping: [['Die Praxis ist dunkel.', 'An der Tür: „Sprechstunde morgen ab 9. Bei Notfällen: Oma fragen. Die weiß eh alles besser.“']],
    goodbye: ['Bis dann, Schwesterherz!', 'Pass auf dich auf – ärztliche Anordnung!', 'Tschüss, Kleine! Und viel Wasser trinken!'],
  },
  dailyTreat: { itemId: 'samen-kamille', chance: 0.35, lines: ['Ach, hier – Kamillensamen.', 'Für dein Beet. Und wenn Oma fragt: Die sind von mir. Ich bin nämlich auch für Kräuter.'] },
  letters: [
    { id: 'tipp', subject: 'Gesundheitstipp vom Bruder', body: 'Schwesterherz,\n\nheute schon Wasser getrunken? Nein? Dann jetzt!\n\nUnd danach einen Apfel. An apple a day keeps the doctor away.\n\n… Wobei ich ja der Doctor bin. Dann lieber zwei Äpfel und mich trotzdem besuchen.\n\nDein Lars', gift: { itemId: 'apfel', count: 2 } },
    { id: 'witz', subject: 'Witz des Tages', body: 'Lina,\n\nkommt ein Pferd in die Praxis. Sagt der Arzt: „Warum so ein langes Gesicht?“\n\nSo. Jetzt hast du gelacht. Das ist gesund.\n\nDein Lars 😄' },
    { id: 'kraeuter', subject: 'Kräuter für dein Beet', body: 'Schwesterherz,\n\nhier sind Pfefferminzsamen. Daraus kannst du in meiner Apotheke Tee machen.\n\nOma behauptet, sie hätte mir das beigebracht. Hat sie nicht. … Okay, ein bisschen.\n\nLars', gift: { itemId: 'samen-pfefferminze', count: 2 } },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Omas Lieblingstee', body: 'Lina,\n\nich hab dir aufgeschrieben, wie man eine richtig gute Kräutermischung macht. Kamille, Minze und Lavendel.\n\nOma sagt, das wäre ihr Rezept. Es ist ihr Rezept. Ich geb\'s zu.\n\nDein Lars', gift: { itemId: 'rezept-kraeutermischung', count: 1 } },
    2: { id: 'herz-2', subject: 'Ärztlicher Rat', body: 'Schwesterherz,\n\nmein Hausmittel gegen Husten, Schnupfen und schlechte Laune: Thymiantee. Zwei Zweige Thymian, heißes Wasser, ein Löffel Honig.\n\nOma sagt, das hätte sie mir beigebracht. Das stimmt nicht.\n\n… Okay, das stimmt.\n\nDein Lars', gift: { itemId: 'rezept-thymiantee', count: 1 } },
    3: { id: 'herz-3', subject: 'Für dein Badezimmer', body: 'Schwesterherz,\n\nein kleiner Erste-Hilfe-Schrank. Mit Pflastern in Rosa. Mit Herzchen drauf.\n\nNicht, weil du sie brauchst. Sondern weil sie hübsch sind.\n\nDein großer Bruder', gift: { itemId: 'erste-hilfe', count: 1 } },
    4: { id: 'herz-4', subject: 'Ein neuer Mitbewohner', body: 'Schwesterherz,\n\ndarf ich vorstellen: Knochen-Kalle. Er hat mich durchs ganze Studium begleitet und kennt jeden Knochen beim Namen. Seinen eigenen sowieso.\n\nIch hab ihm eine Fliege umgebunden, damit er bei dir nicht so nackt herumsteht.\n\nWenn Oli nachts erschrickt: Das ist Kalle. Der tut nix. Der ist ja nur Skelett. So, und nicht mit „Skelet“ – sonst fehlt ihm was.\n\nDein Lars', gift: { itemId: 'skelett-kalle', count: 1 } },
    5: { id: 'herz-5', subject: 'Für die Wand', body: 'Lina,\n\nich hab dir ein Schild machen lassen. Da steht mein Lieblingsspruch drauf: „So, und nicht mit e, sonst ist es ein See.“\n\nHäng es irgendwo hin, wo Oma es sieht. Sie wird sagen, das sei kein Humor, das sei ein Rechtschreibfehler.\n\nDein großer Bruder', gift: { itemId: 'spruchtafel-lars', count: 1 } },
  },
};

export const LARS_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Doktor kommt!',
  body: 'Schwesterherz,\n\nich hab eine Praxis gefunden – in eurem Dorf! Mit kleiner Apotheke.\n\nIch bin schon unterwegs, gleich zieh ich ein. Bring gute Laune mit, die ist ansteckend. Und ich bin Arzt, ich muss das wissen.\n\nDein Lars 🩺',
};

export const LARS_WELCOME: readonly string[] = [
  'Lina! Schwesterherz! 🤗',
  'Lass dich drücken. … Okay, du bist kleiner geworden. Oder ich größer.',
  'Meine Praxis steht jetzt am Dorfplatz – mit einer kleinen Apotheke drin.',
  'Da kannst du aus Kräutern Tee machen. Kamille, Pfefferminze … Samen schenk ich dir.',
  STYLE_ARRIVAL_LINES.lars,
  'Und einmal am Tag check ich dich durch. Ärztliche Anordnung!',
  'So. Und jetzt muss ich zu Oma. Die hat schon dreimal angerufen, dass sie gesund ist.',
];

/** Gesundheits-Check (einmal am Tag) */
export const CHECKUP_LINES: readonly (readonly string[])[] = [
  ['Mund auf, Zunge raus, „Aaah“ sagen.', '… Sehr schön. Und jetzt „Bäääh“. Rein aus Spaß.', 'Diagnose: kerngesund! 💚'],
  ['Ich hör mal dein Herz ab.', '… Bumm-bumm. Bumm-bumm. Ganz regelmäßig.', 'Und ganz schön groß, dieses Herz. Für alle im Dorf.'],
  ['Reflexe testen!', '*klopft aufs Knie* … Ah, das Bein zuckt. Und du hast gekichert.', 'Beides völlig normal. Bestens!'],
  ['Augen auf! Folge meinem Finger.', 'Links … rechts … oben … Winston.', 'Ah, beim Dackel bist du hängen geblieben. Verständlich. Alles prima!'],
];

/** Kleine Belohnung nach dem Check */
export const CHECKUP_GIFTS = ['apfel', 'samen-kamille', 'samen-pfefferminze', 'keks'] as const;
