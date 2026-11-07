/**
 * Linas Fernseher: sechs Sender mit ausgedachten Sendungen im Stil ihrer
 * Lieblingsformate (keine echten Sendungsnamen, keine echten Fälle oder Personen).
 * Jeden Tag läuft pro Sender eine andere Folge (reproduzierbar). Ist Oli zu Hause,
 * schaut er mit.
 *
 * Bewusst KEIN Kuschelfernsehen: Das Programm zeigt ernste Themen nüchtern und
 * ehrlich – als ironischer Bruch mit der Pastell-Welt draußen vor dem Fenster.
 * Grenzen: nichts Explizites, keine Gewaltdetails, niemand wird verspottet.
 * Die Doku nimmt ihre Protagonisten ernst – Scham, Rückschläge, Krankheit inklusive.
 */

export interface TvEpisode {
  title: string;
  lines: readonly string[];
  /** Kochshow: diese Folge bringt ein Rezept bei */
  recipe?: string;
  /** Linas eigene Reaktion (wird nach der Folge angezeigt) */
  lina?: readonly string[];
  /** Oli sagt zu dieser Folge etwas Eigenes (statt der Sprüche des Senders) */
  oli?: readonly string[];
}

export interface TvChannel {
  id: string;
  name: string;
  show: string;
  /** Bildschirm: Farben + Symbol */
  colors: readonly [string, string];
  icon: string;
  episodes: readonly TvEpisode[];
  /** Was Oli dazu sagt (wenn er mitschaut) */
  oli: readonly string[];
}

export const TV_CHANNELS: readonly TvChannel[] = [
  {
    id: 'nachrichten',
    name: 'Nachrichten',
    show: 'Die Nachrichten um Acht',
    colors: ['#1e2a3a', '#3a4a5e'],
    icon: '📰',
    episodes: [
      { title: 'Hitzesommer', lines: ['Guten Abend. Der dritte Hitzesommer in Folge: In mehreren Landkreisen ist das Grundwasser so niedrig wie nie seit Beginn der Messungen.', 'Landwirte melden Ernteausfälle von bis zu vierzig Prozent. Gemeinden bitten, keine Rasenflächen mehr zu sprengen.', 'Und nun das Wetter: weiterhin trocken. Keine Aussicht auf Regen.'] },
      { title: 'Pflegenotstand', lines: ['In einem Pflegeheim im Norden kümmern sich nachts zwei Fachkräfte um achtundsechzig Bewohnerinnen und Bewohner.', 'Eine Pflegerin sagt in die Kamera: „Ich gehe jeden Morgen mit dem Gefühl nach Hause, dass ich jemanden vergessen habe.“', 'Das Ministerium kündigt eine Arbeitsgruppe an. Sie soll im nächsten Jahr erste Ergebnisse vorlegen.'] },
      { title: 'Wohnungsmarkt', lines: ['Auf eine Zweizimmerwohnung in der Innenstadt kommen im Schnitt dreihundertvierzig Bewerbungen.', 'Eine alleinerziehende Mutter erzählt, dass sie seit zwei Jahren sucht und mit ihren Kindern bei ihrer Schwester auf dem Sofa schläft.', 'Die Mieten sind im letzten Jahr erneut gestiegen. Die Löhne nicht im gleichen Maß.'] },
      { title: 'Werksschließung', lines: ['Das Werk in der Kreisstadt schließt Ende des Jahres. Eintausendzweihundert Menschen verlieren ihre Arbeit.', 'Vor dem Tor stehen Kerzen. Ein Mann sagt, sein Vater habe hier schon gearbeitet, und dessen Vater auch.', 'Die Unternehmensführung spricht von einer „schmerzhaften, aber notwendigen Neuausrichtung“.'] },
      { title: 'Einsamkeit', lines: ['Jeder fünfte Mensch über siebzig fühlt sich laut einer neuen Studie dauerhaft einsam.', 'Eine Frau zeigt ihren Kalender: In den letzten drei Wochen hat sie mit niemandem gesprochen außer mit der Kassiererin im Supermarkt.', 'Fachleute sprechen von einem unterschätzten Gesundheitsrisiko – vergleichbar mit Rauchen.'] },
    ],
    oli: ['Oli schaut zum Fenster hinaus, wo gerade ein Schmetterling an der Scheibe vorbeigaukelt. „Krass, wie das da draußen alles weitergeht.“', 'Oli: „Lini … ruf morgen mal Oma Gisela an. Einfach so.“', 'Oli schaltet nicht um, aber er nimmt deine Hand.', 'Oli: „Und wir überlegen, ob das Sofa lieber rosa oder mint sein soll.“'],
  },
  {
    id: 'herzklopfen',
    name: 'Kanal Herzklopfen',
    show: 'Blind Date am Leuchtturm',
    colors: ['#5a3a48', '#a8566e'],
    icon: '💔',
    episodes: [
      { title: 'Manfred, 63', lines: ['Manfred (63) ist seit vierzehn Monaten Witwer. Er hat noch nie ein Date gehabt, bei dem seine Frau nicht dabei war.', 'Beim Hauptgang erzählt er nur von ihr. Seine Verabredung hört zu, freundlich und geduldig. Irgendwann schweigen beide.', 'Am Ende: „Ich glaube, ich bin noch nicht so weit.“ Er zahlt für beide und geht allein zum Auto.'] },
      { title: 'Jessica, 34', lines: ['Jessica (34) erzählt, dass sie in den letzten Jahren vor allem gelernt hat, wie man nach einem Date nicht mehr zurückgeschrieben wird.', 'Ihr Gegenüber schaut während des Essens dreimal aufs Handy. Einmal lächelt er dabei.', 'Im Abschlussinterview sagt er, sie sei „voll nett“. Sie sagt nichts. Die Kamera bleibt etwas zu lange auf ihrem Gesicht.'] },
      { title: 'Tobias, 29', lines: ['Tobias (29) hat seit der Trennung vor drei Jahren eine Angststörung. Er sagt das gleich am Anfang, weil er es nicht verstecken will.', 'Seine Verabredung findet das mutig. Dann wird das Gespräch schwierig, Pausen werden länger, er entschuldigt sich für alles.', 'Sie wollen sich wiedersehen. „Als Freunde.“ Er nickt, als hätte er das erwartet.'] },
      { title: 'Petra & Uwe', lines: ['Petra (58) und Uwe (61) verstehen sich auf Anhieb. Sie lachen über dieselben Dinge, bestellen dasselbe Dessert.', 'Dann erwähnt Uwe beiläufig, dass er noch verheiratet ist. „Auf dem Papier.“', 'Petra steht auf, bedankt sich höflich für den Abend und geht. Das Dessert kommt. Uwe isst beide.'] },
    ],
    oli: ['Oli, leise: „Puh. Das tat weh beim Zuschauen.“', 'Oli: „Lini, wenn ich mal so aufs Handy gucke beim Essen – hau mir bitte auf die Finger.“', 'Oli starrt auf den Bildschirm. „Der arme Manfred.“ Dann holt er Taschentücher. Für sich.', 'Oli: „Und das läuft unter Unterhaltung, ja?“'],
  },
  {
    id: 'doku',
    name: 'Doku-Kanal',
    show: 'Schwerer Weg',
    colors: ['#2e3e3a', '#4f6a5e'],
    icon: '🩺',
    episodes: [
      { title: 'Ronny, 280 Kilo', lines: ['Ronny (38) wiegt 280 Kilo. Er hat das Haus seit elf Monaten nicht verlassen. Die Treppe ist zu schmal für die Trage.', 'Die Ärztin sagt ihm sehr ruhig, dass sein Herz das nicht mehr lange mitmacht, wenn sich nichts ändert. Er nickt und weint.', 'Er beginnt ein Programm mit Ernährung, Bewegung und Therapie. Nach drei Monaten: minus 24 Kilo. Er sagt, die Kilos seien leichter gewesen als die Gespräche über seine Kindheit.'] },
      { title: 'Sabine, 230 Kilo', lines: ['Sabine (45) wurde in der Schule jahrelang gemobbt. Sie sagt: „Essen war das Einzige, das nie gemein zu mir war.“', 'Nach der Magen-OP gibt es Komplikationen. Zwei Wochen Intensivstation. Ihre Tochter sitzt jeden Tag am Bett.', 'Ein halbes Jahr später geht sie zum ersten Mal wieder spazieren, mit Stöcken, zwanzig Minuten. Sie sagt, das sei mehr wert als jede Zahl auf der Waage.'] },
      { title: 'Rückfall', lines: ['Dennis (41) hatte im letzten Jahr 90 Kilo abgenommen. Dann starb seine Mutter. Er hat fast alles wieder zugenommen.', 'Er schämt sich, vor der Kamera zu sprechen. Er tut es trotzdem, weil er will, dass andere sehen, dass so etwas passiert.', 'Seine Therapeutin sagt: „Ein Rückfall ist kein Scheitern. Er ist ein Teil der Krankheit.“ Dennis fängt noch einmal an.'] },
      { title: 'In Erinnerung an Marco', lines: ['Diese Folge ist Marco gewidmet, der in der letzten Staffel dabei war. Er ist im Frühjahr an Herzversagen gestorben. Er wurde 36.', 'Seine Schwester erzählt von ihm: laut, lustig, der beste Onkel. Und davon, wie lange er sich nicht getraut hat, Hilfe zu suchen.', 'Sie engagiert sich jetzt in einer Selbsthilfegruppe. „Damit es bei anderen früher anfängt.“'] },
      // Dr. No – die (ausgedachte) Hommage an Linas Lieblingsarzt aus dem Fernsehen. Streng, ruhig, gütig; die Patienten
      // werden ernst genommen. Das Porträt gibt es im Möbelkatalog (`bild-dr-no`).
      { title: 'Sprechstunde bei Dr. No', lines: ['Heiko (52) hat sich acht Monate nicht in die Praxis getraut. Dr. No, seit dreißig Jahren Chirurg in der Stadt, schaut sich die Akte an und legt sie weg.', 'Er sagt mit tiefer, ruhiger Stimme: „Ich operiere keinen Menschen, der aufgibt. Und ich gebe keinen Menschen auf. Das ist die Abmachung.“', 'Er schreibt Heiko keinen Diätplan auf. Er schreibt ihm nur einen Satz auf einen Zettel: „Ein Schritt. Dann noch einer.“ Heiko steckt den Zettel in die Brusttasche.'], lina: ['Du sitzt kerzengerade auf dem Sofa. Die Brauen. Die Stimme. Der Zettel. Du verehrst diesen Mann, und das ist völlig in Ordnung.'], oli: ['Oli: „Lini, du hast schon wieder dieses Gesicht. Das Dr.-No-Gesicht.“', 'Oli: „Ich bin nicht eifersüchtig auf einen Fernseharzt. … Ich bin nur ein bisschen eifersüchtig auf seinen Mantel.“'] },
      { title: 'Zwei Kilo mehr', lines: ['Anja (47) hat sich vorgenommen, bei der Kontrolle gut dazustehen. Die Waage zeigt zwei Kilo mehr als beim letzten Mal.', 'Dr. No legt die Brille auf den Tisch. „Ich bin nicht böse. Ich bin besorgt. Das ist ein Unterschied.“', 'Er fragt, was in der letzten Woche war. Anja erzählt von der Scheidung. Er hört zu, ohne auf die Uhr zu sehen. Am Ende sagt er: „Wir fangen nächste Woche noch einmal an. Ich bin da.“'], lina: ['Du hast Gänsehaut. „Ich bin besorgt. Das ist ein Unterschied.“ Du schreibst dir den Satz auf.'], oli: ['Oli, leise: „Der kann Strenge und Wärme gleichzeitig. Das ist echt selten.“', 'Oli: „Wenn du mal den Dr.-No-Blick brauchst, schau mich einfach an. Ich versuch’s. … Wie war’s?“'] },
      { title: 'Der Tag nach der OP', lines: ['Willi (60) wacht nach der Operation auf. Dr. No steht am Bett und sagt nur: „Es ist vorbei. Sie haben es geschafft. Der Rest ist Arbeit, und die machen wir zusammen.“', 'Willi weint. Der Arzt reicht ihm ein Taschentuch und schaut taktvoll zum Fenster.', 'Später sagt Dr. No zur Kamera: „Ich bin stolz auf ihn. Schreiben Sie das nicht auf.“ Dann geht er schnell weiter. Der Schnitt zeigt, wie er sich auf dem Flur kurz die Augen wischt.'], lina: ['Du drückst ein Kissen an dich. „Schreiben Sie das nicht auf.“ Natürlich schreibst du es auf.'], oli: ['Oli: „Der Typ ist ein Held. Und er weiß es nicht mal.“', 'Oli reicht dir Taschentücher. Er hat selbst schon welche in der Hand.'] },
    ],
    oli: ['Oli, still: „Das ist eine echte Krankheit. Und alle tun immer so, als wär’s nur fehlende Disziplin.“', 'Oli legt den Arm um dich und sagt eine ganze Weile gar nichts.', 'Oli: „Respekt, dass er das vor der Kamera erzählt. Ich könnte das nicht.“', 'Oli: „Lini … du weinst ja. Komm her.“'],
  },
  {
    id: 'krimi',
    name: 'Krimikanal',
    show: 'Wahre Fälle vom Land',
    colors: ['#1c1c26', '#4a4a64'],
    icon: '🔍',
    episodes: [
      { title: 'Der Heimweg', lines: ['Herbst 1997. Eine 19-Jährige fährt nach der Disco mit dem Fahrrad nach Hause, vier Kilometer über Feldwege. Sie kommt nie an.', 'Ihr Fahrrad wird zwei Tage später im Graben gefunden. Die Ermittlungen laufen jahrelang ins Leere. Ihre Mutter lässt das Licht im Flur an.', 'Dreiundzwanzig Jahre später führt eine neue DNA-Analyse zu einem Mann aus dem Nachbardorf. Die Mutter hat das Urteil nicht mehr erlebt.'] },
      { title: 'Dreimal angezeigt', lines: ['Eine Frau hat ihren Ex-Partner dreimal wegen Bedrohung angezeigt. Die Verfahren wurden eingestellt, „mangels öffentlichen Interesses“.', 'Ihre Freundin liest im Interview die Nachrichten vor, die sie damals bekommen hat. Sie muss zweimal abbrechen.', 'Der Fall hat zu einer Gesetzesänderung geführt. Für sie selbst kam sie zu spät. Die Sendung blendet am Ende eine Telefonnummer für Hilfe ein.'] },
      { title: 'Der Enkeltrick', lines: ['Ein Anruf: „Oma, ich hatte einen Unfall, ich brauche sofort Geld.“ Die 84-Jährige hebt ihr gesamtes Erspartes ab. 38.000 Euro.', 'Ein Abholer klingelt, freundlich, gut angezogen. Sie macht ihm sogar noch einen Kaffee.', 'Die Bande wird gefasst, das Geld bleibt verschwunden. Sie erzählt, dass sie sich seitdem nicht mehr traut, ans Telefon zu gehen.'] },
      { title: 'Der falsche Mann', lines: ['1989 wird ein Mann wegen Brandstiftung mit Todesfolge verurteilt. Er beteuert seine Unschuld. Niemand glaubt ihm.', 'Neunzehn Jahre Haft. Seine Kinder wachsen ohne ihn auf. Seine Frau lässt sich scheiden.', 'Ein neues Gutachten zeigt: Es war ein technischer Defekt. Er bekommt eine Entschädigung. Er sagt, er wisse nicht, was er mit den Jahren hätte anfangen sollen, die man ihm nicht zurückgeben kann.'] },
    ],
    oli: ['Oli: „Ich hab Gänsehaut. Und nicht die gute.“', 'Oli schaut kurz zur Tür, ob sie abgeschlossen ist. Ganz unauffällig.', 'Oli: „Lini, du hast schon wieder diesen Ermittlerinnen-Blick.“', 'Oli: „Ruf bitte morgen Oma an und sag ihr, sie soll nie jemandem Geld geben, der anruft. Nie.“'],
  },
  {
    id: 'grusel',
    name: 'Gruselkanal',
    show: 'Gänsehaut um Mitternacht',
    colors: ['#140e1c', '#4a1e2a'],
    icon: '🕯️',
    episodes: [
      { title: 'Das Haus am Ende des Feldwegs', lines: ['Ein Ehepaar zieht nach dem Tod seines Sohnes in ein altes Bauernhaus, um neu anzufangen. Jede Nacht um 3:07 Uhr klopft es dreimal an der Kellertür.', 'Die Frau beginnt, nachts mit der Tür zu sprechen. Ihr Mann schläft im Auto.', 'Kein Happy End. Der Abspann läuft über einem leeren Kinderzimmer.'] },
      { title: 'Die Puppe auf dem Dachboden', lines: ['Eine Porzellanpuppe sitzt jeden Morgen an einem anderen Platz. Die Familie stellt sie zurück. Sie sitzt wieder woanders.', 'Die Mutter installiert eine Kamera. Die Aufnahmen zeigen nichts. Nur die Tochter, die nachts mit offenen Augen vor der Puppe steht.', 'Das Mädchen sagt: „Sie hat gesagt, wir dürfen nicht mehr gehen.“ Schwarzbild.'] },
      { title: 'Nebel über dem Moor', lines: ['Vier Freunde verirren sich im Moor. Irgendwo pfeift jemand eine Melodie. Immer dieselbe, immer näher.', 'Einer sagt: „Wir sollten uns trennen.“ Lina ruft: „NEIN!“ Natürlich trennen sie sich.', 'Am Morgen findet die Suchmannschaft drei Rucksäcke. Und einen Zettel mit den Noten der Melodie.'] },
      { title: 'Zimmer 13', lines: ['Ein Hotel ohne 13. Stock. Der Fahrstuhl hat trotzdem einen Knopf dafür, und er leuchtet.', 'Die Nachtportierin drückt ihn. Die Türen öffnen sich auf einen Flur, der genauso aussieht wie ihrer. Nur dass am Ende jemand steht, der aussieht wie sie.', 'Bing. Die Türen schließen sich. Am nächsten Morgen sitzt sie wieder an der Rezeption. Sie lächelt etwas zu breit.'] },
    ],
    oli: ['Oli hält sich ein Kissen vor die Augen: „Sag Bescheid, wenn’s vorbei ist, Lini.“', 'Oli: „Ich hab überhaupt keine Angst. Ich halte nur deine Hand, damit DU keine Angst hast.“', 'Oli: „Warum gehen die IMMER in den Keller? Warum?!“', 'Oli: „Heute schlafen wir mit Licht. Nur so. Aus … Gemütlichkeit.“'],
  },
  {
    id: 'kochen',
    name: 'Kochkanal',
    show: 'Kochen ums Überleben',
    colors: ['#3a2a1c', '#8a5a2e'],
    icon: '🍳',
    episodes: [
      { title: 'Apfelpfannkuchen', recipe: 'apfelpfannkuchen', lines: ['Küchenchef Bernd (52) zeigt Apfelpfannkuchen: zwei Eier, ein Apfel, Mehl, Milch. Im Hintergrund bewertet ein Gerichtsvollzieher die Kühltruhe.', 'Bernd erklärt, dass sein Restaurant nach 21 Jahren schließt, die Energiekosten haben sich verdreifacht. Der Pfannkuchen gelingt perfekt.', '„Das hier kann mir keiner nehmen“, sagt er und tippt sich an die Stirn. Lina schreibt das Rezept mit. 📝'] },
      { title: 'Fischsuppe', recipe: 'fischsuppe', lines: ['Eine Fischsuppe mit Barsch und frischer Minze. Die Köchin bereitet sie auf einem Kutter vor, der nächsten Monat verschrottet wird.', 'Die Fangquoten wurden wieder gesenkt, ihr Mann fährt jetzt Pakete aus. Sie schneidet die Minze sehr fein, sehr langsam.', '„Mein Opa hat die schon so gekocht.“ Sie probiert und sagt nichts. Lina schreibt mit. 📝'] },
      { title: 'Blumige Salatschüssel', recipe: 'blumensalat', lines: ['Essbare Blüten auf einem Salat: Sonnenblumenblätter, Vergissmeinnicht. Gedreht in einer Gemeinschaftsküche, wo dreimal die Woche umsonst gekocht wird.', 'Die Schlange draußen ist länger als im letzten Jahr, sagt der Koch. Viele davon arbeiten Vollzeit.', '„Wir essen mit den Augen zuerst“, sagt er. „Manche hier zum ersten Mal seit Tagen überhaupt.“ Lina schreibt mit. 📝'] },
    ],
    oli: ['Oli: „Lini, das kochen wir am Wochenende. Und wir laden Oma ein.“', 'Oli schaut eine Weile still auf den Bildschirm. „Ich geb nächste Woche was bei der Tafel ab.“', 'Oli: „Der Pfannkuchen sah echt gut aus. Der Rest … puh.“'],
  },
];

export const TV_BY_ID: Readonly<Record<string, TvChannel>> = Object.fromEntries(TV_CHANNELS.map((c) => [c.id, c]));
