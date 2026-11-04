/**
 * Oma Gisela – Linas Oma.
 *
 * Herzlich, frech, misstrauisch, hat zu allem eine starke Meinung
 * („köstlich!“ – „pfui!“) und IMMER das letzte Wort. Sitzt gern auf ihrer
 * Bank vorm Haus, verteilt Weisheiten und Kekse.
 * Likörchen & Zigarette: nur dezent und humorvoll, nie glorifizierend.
 */
import { LOOKS } from './looks';
import type { NpcDef } from './types';

const PLATZ = { x: 23, y: 16, w: 9, h: 7 };
const STRAND = { x: 18, y: 30, w: 16, h: 3 };

export const GISELA: NpcDef = {
  id: 'gisela',
  name: 'Oma Gisela',
  personality: 'herzlich, frech, misstrauisch, starke Meinungen, immer das letzte Wort; Witwe von Ludwig (Sportlehrer, Sportfan), an den sie gern zurückdenkt',
  appearance: LOOKS.gisela,
  home: 'haus-gisela',
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:00', label: 'Morgenkaffee auf der Bank', activity: { kind: 'sitzen', bench: 'bank-gisela' } },
    { from: '10:30', label: 'Bummel über den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '12:30', label: 'kocht Mittagessen', activity: { kind: 'zuhause' } },
    { from: '14:00', label: 'Kaffee und Kuchen auf der Bank', activity: { kind: 'sitzen', bench: 'bank-gisela' } },
    { from: '17:00', label: 'Abendspaziergang am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '19:00', label: 'Feierabend auf der Bank', activity: { kind: 'sitzen', bench: 'bank-gisela' } },
    { from: '22:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['pfirsich', 'herzmuschel', 'wildblumen', 'rose', 'vergissmeinnicht', 'hering', 'ei', 'apfelkuchen', 'lavendelkekse', 'kamillentee', 'kraeutermischung'],
    likes: ['wachtelei', 'apfel', 'jakobsmuschel', 'schneckenhaus', 'seestern', 'glitzerstein', 'tulpe', 'lavendel', 'sonnenblume', 'scholle', 'dorsch', 'marienkaefer', 'zitronenfalter'],
    dislikes: ['birne', 'ast', 'stein', 'waldameise', 'weinbergschnecke', 'maikaefer', 'heupferd', 'grashuepfer', 'ohrenqualle', 'aal', 'wels', 'strandkrabbe'],
  },

  dialogue: {
    greetings: [
      { text: ['Morgen, Kindchen!', 'Vor meinem ersten Kaffee red ich eigentlich mit niemandem.', '… Mit dir mach ich mal eine Ausnahme.'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Na, Lina? Schon was Ordentliches gegessen?', 'Du siehst so dünn aus. … Doch, tust du.'], when: { phases: ['morgen', 'mittag'] } },
      { text: ['Da bist du ja! Ich hab dich schon von Weitem gesehen.', 'Ich seh alles. Merk dir das.'] },
      { text: ['Lina, Schätzchen! Komm her, lass dich anschauen.', 'Hm. Die Haare könnten mal wieder gekämmt werden. Aber sonst: hübsch wie immer.'] },
      { text: ['Ah, Besuch! Endlich passiert hier mal was.'], when: { phases: ['nachmittag'] } },
      { text: ['So spät noch unterwegs?', 'Na, ich sag nichts. … Doch: Zieh dir eine Jacke an.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Sonntag! Da gibt\'s Kuchen. Das ist Gesetz.', 'Wer das Gesetz gemacht hat? Ich. Gerade eben.'], when: { weekdays: [0] }, weight: 2 },
      { text: ['Montag.', 'Ich hab beschlossen, dass Montage dieses Jahr ausfallen. Hat aber keiner auf mich gehört.'], when: { weekdays: [1] }, weight: 2 },
      { text: ['Alles Liebe zum Geburtstag, mein Schatz! 🎂', 'Wie alt bist du jetzt? … Nein, sag nichts. Für mich bleibst du sowieso mein kleines Mäuschen.', 'Ende der Diskussion.'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Bei dem Regen gehst du raus?', 'Ohne Schirm?! Du holst dir noch was weg!', '… Na ja, wenigstens werden die Blumen gegossen.'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Hörst du das Donnern? Da oben wird Möbel gerückt.', 'Hat meine Mutter immer gesagt. Und die hatte auch immer das letzte Wort.'], when: { tags: ['wetter-gewitter'] }, weight: 3 },
      { text: ['Schnee! Wie früher.', 'Da sind wir mit dem Schlitten zur Schule. Bergauf. In beide Richtungen.'], when: { tags: ['wetter-schnee'] }, weight: 3 },
      { text: ['Hast du den Regenbogen gesehen?', 'Am Ende liegt ein Topf voll Gold, sagt man.', 'Wenn du ihn findest: Halbe-halbe!'], when: { tags: ['regenbogen'] }, weight: 4 },
      { text: ['Kindchen! Mein Lieblingsbesuch.', '… Ja, ich weiß, du bist mein einziger Besuch. Trotzdem.'], when: { minHearts: 2 } },
    ],
    chat: [
      { text: ['Mein Enkel ist jetzt Arzt im Dorf.', 'Ich trau ihm trotzdem nicht. Ärzte wollen nur dein Geld!', '… Er nimmt aber gar keins von mir. Verdächtig, oder?'], when: { tags: ['lars-da'] }, weight: 3 },
      { text: ['Lars hat mir Tabletten verschrieben.', 'Ich hab ihm Kamillentee verschrieben. Wir werden sehen, wer recht hat.', '… Ich. Natürlich.'], when: { tags: ['lars-da'] }, weight: 3 },
      { text: ['Der Jens mit seinem Bistro …', 'Seine Croissants sind köstlich. Seine Hemden: pfui!', 'Aber sag ihm nichts. Er ist ja ein Guter.'], when: { tags: ['jens-da'] }, weight: 2 },
      { text: ['Du hast Hühner? Wie Opa Ludwig damals!', 'Der hatte eins, das hieß Frieda. Frieda hat jeden Morgen um fünf gekräht. Obwohl sie ein Huhn war.'], when: { tags: ['huehner'] }, weight: 3 },
      { text: ['Wachteln! Die sind ja winzig.', 'Für ein Spiegelei brauchst du davon ungefähr zwölf. Sag ich nur.'], when: { tags: ['wachteln'] }, weight: 3 },
      { text: ['Neben deinem Haus steht noch Opas alte Werkbank.', 'Ludwig hat da früher alles Mögliche gebaut. Aus Ästen! Aus Steinen! Einmal sogar einen Stuhl, der gehalten hat.'], weight: 2 },
      { text: ['Weißt du, was dein Opa Ludwig immer gesagt hat?', '„Wer rastet, der rostet!“', 'Er war ja Sportlehrer. Mit Leib und Seele. … Und mit Trillerpfeife.'], weight: 2 },
      { text: ['Ludwig hat jedes Fußballspiel im Radio gehört.', 'Und jedes Mal so laut mitgeschimpft, dass die Nachbarn dachten, wir streiten.', 'Ach, ich vermiss das. Sogar das Schimpfen.'], weight: 2 },
      { text: ['Wenn ich auf meiner Bank sitze, denk ich oft an Ludwig.', 'Er saß immer links. Deshalb sitz ich rechts.', 'Der Platz bleibt frei. Ende der Diskussion.'], weight: 2 },
      { text: ['Dein Opa hätte dich jetzt eine Runde um den Dorfplatz laufen lassen.', '„Knie hoch, Lina! Und lächeln!“', 'Er hat dich immer „meine kleine Sprinterin“ genannt.'], weight: 2 },
      { text: ['Ludwig hat mir seinen Antrag gemacht – auf dem Sportplatz, in der Halbzeitpause.', 'Ich hab Ja gesagt. Und er hat sich so gefreut, dass er die zweite Halbzeit verpasst hat.', 'Das erste und einzige Mal.'], when: { minHearts: 2 }, weight: 2 },
      { text: ['Bei so einem Wetter hat Ludwig trotzdem seine Runden gedreht.', 'Und ich hab ihm danach Tee gekocht. Mit einem Schuss Rum.', '… Für die Gesundheit natürlich.'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Siehst du die Sterne?', 'Ludwig hat immer gesagt, der hellste da oben ist der, der beim Weitsprung geschummelt hat.', '… Ich glaube, er meinte sich selbst.'], when: { phases: ['abend', 'nacht'] }, weight: 2 },
      { text: ['Dein Winston ist ein feiner Hund.', 'Er hat mir heute zugehört. Ganz ohne Widerworte. Das kann hier sonst keiner.'] },
      { text: ['Winston hat mich vorhin angeguckt, als hätte er seit Wochen nichts gegessen.', 'Ich hab ihm ein Stückchen Leberwurstbrot gegeben. Sag\'s nicht weiter.'] },
      { text: ['Weißt du, was ich von Ärzten halte?', 'Die wollen nur dein Geld! Die Hälfte der Behandlungen ist gar nicht nötig.', 'Ein Löffel Honig und früh ins Bett – fertig. Kostet nix.'] },
      { text: ['Dein Bruder, der Herr Doktor, meint, ich soll weniger Zucker essen.', 'Pah! Ich esse seit Jahrzehnten Zucker und lebe noch. Und zwar prächtig.'] },
      { text: ['Diese neumodischen Avocados …', 'Pfui! Schmeckt wie eingeschlafene Füße.'] },
      { text: ['Pfannkuchen mit Apfelmus. Das ist richtiges Essen!', 'Köstlich. Da braucht man keine Avocado.'] },
      { text: ['Kaffee muss so stark sein, dass der Löffel drin stehen bleibt.', 'Alles andere ist braunes Wasser.'] },
      { text: ['Weißt du, was das Schöne am Älterwerden ist?', 'Man hat immer recht.', 'Und falls nicht: siehe Punkt eins.'] },
      { text: ['Dieser Brunnen da auf dem Platz …', 'Wer weiß, wer da alles reinspuckt. Ich trink da nix draus. Nie im Leben.'] },
      { text: ['Hast du deine Haustür abgeschlossen?', 'Man weiß nie! Hier läuft ja jeder rum. … Also, du und ich. Aber trotzdem.'] },
      { text: ['Die Möwen am Strand haben es auf meine Kekse abgesehen.', 'Ich hab sie im Blick. Alle.'] },
      { text: ['Fertigessen aus der Packung?', 'Pfui! Da ist doch nur Chemie drin. Komm lieber zu mir, ich koch dir was.'] },
      { text: ['Stricken beruhigt die Nerven.', 'Und man hat gleich zwei Nadeln zur Hand, falls jemand frech wird.', '… War ein Scherz. Halb.'] },
      { text: ['Wenn du an den Bäumen rüttelst, fällt manchmal Obst runter.', 'Pfirsiche sind köstlich. Birnen … pfui. Die sind immer so mehlig.'] },
      { text: ['Was du nicht brauchst, steckst du in die Verkaufskiste vor deinem Haus.', 'Und die Sternchen gibst du nicht gleich alle aus! Sparen, Kindchen, sparen.'] },
      { text: ['Am Strand liegen jeden Tag neue Muscheln.', 'Die Herzmuscheln sind die schönsten. Nur, falls du mal nicht weißt, was du mir schenken sollst.'] },
      { text: ['Ein Likörchen am Abend – rein medizinisch, versteht sich.', 'Und erzähl das bloß nicht deinem Bruder.'], when: { phases: ['abend', 'abenddaemmerung'] }, weight: 2 },
      { text: ['Was guckst du so? Das ist mein Pfefferminzbonbon.', '… Na gut, und ein klitzekleines Likörchen.', 'Und du fängst mit sowas gar nicht erst an, hörst du? Wasser ist für junge Leute.'], when: { phases: ['abend', 'abenddaemmerung'] }, weight: 2 },
      { text: ['Ich rauch nur noch eine am Tag. Und die ist schon lange her.', 'Fang du bloß nie damit an! Sonst krieg ich Ärger – mit mir selbst.'], when: { phases: ['nachmittag', 'abend'] } },
      { text: ['Bei dem Wind fliegt mir noch die Frisur weg.', 'Und die war beim Friseur! Für teures Geld!'], when: { seasons: ['herbst'] } },
      { text: ['Zieh dir was Warmes an, sonst holst du dir den Tod!', '… Doch, das geht schneller, als du denkst.'], when: { seasons: ['winter'] } },
      { text: ['Viel trinken bei der Hitze, Kind!', 'Wasser. Nicht diese bunte Limo – da ist nur Chemie drin.'], when: { seasons: ['sommer'] } },
      { text: ['Die Blumen blühen, die Vögel zwitschern …', '… und ich hab Heuschnupfen. Typisch.'], when: { seasons: ['fruehling'] } },
      { text: ['Ich strick dir einen Schal. Welche Farbe willst du?', '… Ach, ich nehm Rosa. Rosa steht dir.', 'Ende der Diskussion.'], when: { minHearts: 1, maxHearts: 2 } },
      { text: ['Weißt du, ich bin froh, dass du hier bist.', '…', 'So. Genug geschmust. Geh spielen.'], when: { minHearts: 3 } },
      { text: ['Du bist mein Lieblingsenkelkind.', 'Sag\'s bloß nicht weiter.'], when: { minHearts: 4 } },
      { text: ['Lina, du siehst blass aus.', '… Doch. Keine Widerrede.', 'Ich hab das letzte Wort. Das hab ich mir verdient.'] },
      { text: ['Hast du schon was gefangen mit Opas Angel?', 'Ludwig hat früher Hechte rausgezogen, so groß wie ich!', '… Na gut, wie mein Arm. Aber trotzdem.'] },
      { text: ['Dein Beet! Gieß es ordentlich.', 'Aber nicht zu viel. Und nicht zu wenig. Genau richtig eben.', 'Wie viel genau richtig ist? Das weiß man einfach.'] },
      { text: ['Ein Hering in Sahnesoße mit Pellkartoffeln.', 'Köstlich! Da kommen mir die Tränen.'] },
      { text: ['Fass mir bloß keine Krabbeltiere an und bring die dann zu mir!', 'Außer Marienkäfer. Die bringen Glück.'] },
      { text: ['Hast du dein Häuschen schon schön eingerichtet?', 'Ein Kotatsu? Ein Tisch mit Decke drunter? Was es nicht alles gibt …', '… Na gut. Klingt eigentlich ganz gemütlich. Aber erzähl\'s keinem.'] },
      { text: ['Dein Vater wohnt jetzt also auch hier.', 'Ich hab ihm gleich gesagt, dass seine Weste schief sitzt.', 'Christin hat sie dann gerade gezogen. Die gefällt mir. Ordentliches Mädchen.'], when: { tags: ['olaf-da'] }, weight: 2 },
      { text: ['Olaf will mir ein Sparbuch einrichten.', 'Ich hab gesagt: Mein Geld ist unterm Kopfkissen am sichersten.', 'Ende der Diskussion.'], when: { tags: ['olaf-da'] } },
      { text: ['Diese Winkekatze in den Katalogen …', 'Die guckt einen so an. Ein bisschen unheimlich, wenn du mich fragst.', 'Ich hab das letzte Wort: unheimlich.'] },
    ],
    gifts: {
      liebt: [
        ['Ach, Kindchen! Das ist ja … das ist ja köstlich! 😍', 'Das bekommt einen Ehrenplatz auf der Fensterbank.'],
        ['Na, du weißt, was sich gehört! Genau sowas mag ich.', 'Komm her, lass dich drücken. … So, genug jetzt.'],
      ],
      mag: [
        ['Oh, wie nett! Danke, Schätzchen.', 'Das kann ich gut gebrauchen. Ganz bestimmt.'],
        ['Hm! Nicht schlecht. Gar nicht schlecht.', 'Du hast Geschmack. Den hast du von mir.'],
      ],
      neutral: [
        ['Aha. Danke.', '… Ich leg\'s mal da hin. Irgendwohin.'],
        ['Na ja. Der Gedanke zählt, sagt man ja.'],
      ],
      'mag-nicht': [
        ['Pfui! Was soll ich denn damit?', '… Na gut, ich nehm\'s trotzdem. Weil du\'s bist.'],
        ['Das mag ich gar nicht. Gar nicht!', 'Aber danke, Kindchen. Nächstes Mal bringst du mir was Ordentliches, ja?'],
      ],
    },
    giftsByItem: {
      birne: ['Birnen? Pfui! Die sind immer so mehlig.', 'Na gut. Vielleicht back ich einen Kuchen draus. Vielleicht.'],
      ast: ['Einen Ast?', 'Soll ich mir einen Spazierstock schnitzen? Ich bin doch noch nicht alt!'],
      stein: ['Ein Stein. Danke.', 'Den kann ich nach den Möwen werfen. … Nein, natürlich nicht. Aber sie müssen das ja nicht wissen.'],
      keks: ['Das ist doch mein eigener Keks!', 'Ach, du willst teilen. Wie lieb.', 'Den ess ich jetzt aber selbst.'],
      seestern: ['Ein Seestern! Sowas hab ich zuletzt gesehen, da war ich so klein wie du damals.', 'Den häng ich mir an die Tür. Damit alle sehen, was meine Enkelin findet.'],
      glitzerstein: ['Oh, der funkelt ja!', 'Den versteck ich gut. Hier gibt\'s bestimmt Diebe. … Möwen zum Beispiel.'],
      pfirsich: ['Ein Pfirsich! Köstlich! 😋', 'Die aus dem Laden sind alle gespritzt. Die hier sind ehrlich.'],
      hering: ['Ein Hering! Wie früher an der Ostsee!', 'Köstlich! Den leg ich gleich ein. Mit Zwiebeln.'],
      rose: ['Eine Rose … für mich?', 'Ach, Kindchen. Das hat schon lange keiner mehr gemacht.', '… Ich hab nur was im Auge. Gar nichts ist.'],
      marienkaefer: ['Ein Marienkäfer! Der bringt Glück.', 'Den lass ich gleich im Garten fliegen. Flieg, Käferchen, flieg!'],
      weinbergschnecke: ['Pfui! Eine Schnecke!', 'Die frisst mir doch den ganzen Salat weg! Bring die bloß weit weg!'],
      ohrenqualle: ['Iiih! Das glibbert ja!', 'Pfui Teufel. Damit gehst du sofort zurück ins Meer!'],
      aal: ['Ein Aal! Der zappelt ja noch!', 'Pfui! Der sieht aus wie eine Schlange. Nimm den weg!'],
    },
    giftRepeat: ['Schon wieder ein Geschenk? Du verwöhnst mich ja!', 'Aber jetzt ist Schluss, sonst werd ich noch eitel.'],
    heartUp: [
      ['Weißt du was, Lina?', 'Du bist ein gutes Kind. Hab ich immer gesagt.', 'Na ja. Fast immer.'],
      ['Ich hab dich lieb, Mäuschen. 💕', '… Was? Ich hab gar nichts gesagt.'],
    ],
    atHome: [
      ['Du klopfst. Drinnen dudelt ein Radio.', '„Ich bin beschäftigt! Komm später wieder!“', '„… Oder komm rein, ich hab Kuchen!“', 'Die Tür bleibt trotzdem zu. Typisch Oma.'],
      ['Aus dem Fenster duftet es nach Bratkartoffeln.', '„Lina? Ich koche! Nicht stören! Später gibt\'s was!“'],
    ],
    atHomeSleeping: [
      ['Hinter der Tür hört man ein gemütliches Schnarchen. 😴', 'Oma Gisela schläft. Morgen ist auch noch ein Tag.'],
      ['Alles dunkel. Auf der Fußmatte steht: „Nach 22 Uhr nur im Notfall klingeln. Und das ist KEIN Notfall.“'],
    ],
    goodbye: ['Na, dann lauf mal.', 'Und denk dran: Jacke an!', 'Bis später, Kindchen. Ich hab das letzte Wort: Tschüss!'],
  },

  dailyTreat: {
    itemId: 'keks',
    chance: 0.4,
    lines: ['Hier, ein Keks. Du siehst hungrig aus.', 'Keine Widerrede!'],
  },

  letters: [
    { id: 'kekse', subject: 'Zu viele Kekse', body: 'Liebe Lina,\n\nich hab zu viele Kekse gebacken. Also eigentlich genau richtig viele – für dich. Iss nicht alle auf einmal!\n\nDeine Oma', gift: { itemId: 'keks', count: 3 } },
    { id: 'warm', subject: 'Zieh dich warm an!', body: 'Liebe Lina,\n\ndenk dran, dich warm anzuziehen. Und iss was Ordentliches. Und ruf mal an.\n\nAch so, du wohnst ja jetzt nebenan. Dann komm halt vorbei!\n\nOma' },
    { id: 'muschel', subject: 'Strandfund', body: 'Lina, Schätzchen!\n\nAm Strand hab ich eine Muschel gefunden, die sah aus wie du, wenn du schmollst. Ich leg sie dir bei.\n\nOma Gisela', gift: { itemId: 'herzmuschel', count: 1 } },
    { id: 'wasser', subject: 'Gesundheitstipp', body: 'Liebe Lina,\n\nheute hat mir jemand gesagt, ich soll mehr Wasser trinken. Ich hab gesagt: Kaffee ist auch Wasser.\n\nEnde der Diskussion.\n\nDeine Oma' },
    { id: 'pfirsich', subject: 'Aus meinem Vorrat', body: 'Liebe Lina,\n\nhier ein Pfirsich aus meinem Vorrat. Der ist besser als die aus dem Laden. Die im Laden sind nur gespritzt.\n\nOma', gift: { itemId: 'pfirsich', count: 1 } },
    { id: 'sparen', subject: 'Ein guter Rat', body: 'Liebe Lina,\n\nein guter Rat von deiner Oma: Wer den Pfennig nicht ehrt, ist des Sternchens nicht wert.\n\nSo. Jetzt weißt du\'s.\n\nOma Gisela' },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Streng geheim!', body: 'Liebe Lina,\n\ndu kommst mich so oft besuchen – das gefällt mir. Hier ist mein Keksrezept.\n\nStreng geheim! Wehe, du zeigst es jemandem.\n\nOma Gisela', gift: { itemId: 'keksrezept', count: 1 } },
    2: { id: 'herz-2', subject: 'Für den kleinen Herrn', body: 'Liebe Lina,\n\ndein Winston schläft ja überall – auf der Wiese, auf dem Futon, auf meinen Füßen.\n\nHier ist eine Anleitung für ein ordentliches Körbchen. Dein Opa Ludwig hat damals so eins für unseren Waldi gebaut – zwischen zwei Fußballspielen. Die Werkbank steht ja noch neben deinem Haus.\n\nDeine Oma', gift: { itemId: 'rezept-hundekoerbchen', count: 1 } },
    3: { id: 'herz-3', subject: 'Für kalte Tage', body: 'Liebe Lina,\n\nich hab dir einen Schal gestrickt. Rosa.\n\nIch weiß, du wolltest vielleicht eine andere Farbe. Aber Rosa steht dir. Ende der Diskussion.\n\nDeine Oma', gift: { itemId: 'strickschal', count: 1 } },
    4: { id: 'herz-4', subject: 'Für die Piepmätze', body: 'Liebe Lina,\n\nich sitze so gern auf meiner Bank und schaue den Vögeln zu. Die Meisen sind die frechsten – die erinnern mich an dich.\n\nHier ist Opas Bauplan für ein Vogelhäuschen. Bau es ordentlich, sonst zieht keiner ein!\n\nDeine Oma', gift: { itemId: 'rezept-vogelhaus', count: 1 } },
    5: { id: 'herz-5', subject: 'Damit du mich nicht vergisst', body: 'Liebe Lina,\n\nich hab dir ein Foto von mir beigelegt. Damit du mich nicht vergisst.\n\nNicht, dass das ginge.\n\nDeine Oma, die dich sehr lieb hat.\n(Das bleibt unter uns!)', gift: { itemId: 'omas-foto', count: 1 } },
  },
};

/** Begrüßungsszene beim Einzug (direkt nach Linas Ankunft). */
export const GISELA_WELCOME: readonly string[] = [
  'Lina! Da bist du ja endlich. Ich warte schon seit Stunden!',
  '… Na gut, seit zehn Minuten. Aber gefühlt seit Stunden.',
  'Ich bin nämlich auch gerade eingezogen. Das lila Häuschen hinter der Brücke – mit der Bank davor.',
  'Die Bank ist meine. Nur, damit das klar ist.',
  'Du bist ja ganz dünn! Hier, ein Keks. Keine Widerrede.',
  'Und da ist ja auch Winston! Na, du kleine Wurst? Pass schön auf mein Enkelkind auf.',
];

export const GISELA_WELCOME_2: readonly string[] = [
  'Und hör zu: Wenn du an den Bäumen rüttelst, fällt manchmal Obst runter. Am Strand liegen Muscheln.',
  'Was du nicht brauchst, steckst du in die Verkaufskiste vor deinem Haus. Dafür gibt\'s Sternchen.',
  'So. Ich geh jetzt Kaffee kochen. Besuch mich mal!',
  '… Und zwar bald. Ich hab das letzte Wort.',
];

/** Oma Gisela gibt Lina Werkzeuge (beim Einzug bzw. nach dem M4-Update beim nächsten Gespräch) */
export const GISELA_TOOLS: readonly string[] = [
  'Ach, und warte mal. Ich hab hier noch was für dich.',
  'Opa Ludwigs alte Angel. Die hat er gehütet wie seinen Augapfel. Gleich nach seiner Trillerpfeife.',
  'Dazu ein Kescher für Schmetterlinge – aber bring mir keine Krabbeltiere ins Haus!',
  'Und eine Gießkanne. In Rosa. Rosa steht dir.',
  'Und ein paar Blumensamen für das Beet neben deinem Haus. Gießen nicht vergessen!',
  'Mit den Tasten 1, 2 und 3 nimmst du die Sachen in die Hand. Q steckt sie wieder weg.',
  '… Woher ich das weiß? Ich weiß alles. Ende der Diskussion.',
];
