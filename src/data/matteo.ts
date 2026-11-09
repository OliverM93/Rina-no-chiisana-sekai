/**
 * Pater Matteo – Thalias Brieffreund (Herzenswunsch „Ein Brieffreund aus Italien“).
 *
 * Eine **ausgedachte** Figur: Pfarrer in einem Bergdorf, schreibt gern über Steine und Wanderwege, hat Humor
 * und ist bescheiden. Er taucht nie im Dorf auf – er schreibt nur Briefe an Lina und Thalia (keine echte Person).
 * Thalia findet ihn „wissenschaftlich irrelevant, aber nicht uninteressant“; alles bleibt herzlich und respektvoll.
 */

export const MATTEO_NAME = 'Pater Matteo';
/** Das (ausgedachte) Bergdorf */
export const MATTEO_VILLAGE = 'Montecielo';

export interface MatteoLetter {
  id: string;
  /** so viele Tage nach Thalias erfülltem Wunsch kommt der Brief */
  afterDays: number;
  subject: string;
  body: string;
  gift?: { itemId: string; count: number };
}

export const MATTEO_LETTERS: readonly MatteoLetter[] = [
  {
    id: 'matteo-1',
    afterDays: 2,
    subject: 'Buongiorno aus Montecielo',
    body: 'Liebe Lina, liebe Thalia,\n\nIhr Päckchen ist angekommen, und ich muss gestehen: Ich habe es erst auf dem Küchentisch umkreist wie ein Kater, bevor ich es zu öffnen wagte.\n\nDer Bergkristall liegt jetzt im Fenster der Sakristei und fängt das Morgenlicht. Die Lavendelkekse hat meine Haushälterin Signora Rosa nach drei Minuten „zur Prüfung“ beschlagnahmt. Sie sagt, sie waren gut. Ich habe leider nur die Krümel gesehen.\n\nGrazie di cuore!\n\nPater Matteo\n\nPS: Aus dem Pfarrgarten: etwas Basilikum. Er wächst überall, selbst auf meinen Notizen.',
    gift: { itemId: 'samen-basilikum', count: 3 },
  },
  {
    id: 'matteo-2',
    afterDays: 10,
    subject: 'Vom Berg',
    body: 'Liebe Lina, liebe Thalia,\n\nbei uns ist gerade Tomatenzeit. Das heißt: Jeder im Dorf hat zu viele Tomaten und verschenkt sie mit großer Geste. Ich habe heute morgen neun bekommen. Ich predige trotzdem von Bescheidenheit.\n\nThalia, Sie erwähnten Fossilien. Ich besitze einen Ammoniten, den ich als Türstopper missbrauche. Ich schäme mich ein wenig und mache es trotzdem. Er hält die Tür hervorragend.\n\nBuona giornata,\nPater Matteo\n\nPS: Beiliegend Tomatensamen aus dem Pfarrgarten. Für Linas Beet. Mit Segen, aber ohne Garantie.',
    gift: { itemId: 'samen-tomate', count: 3 },
  },
  {
    id: 'matteo-3',
    afterDays: 25,
    subject: 'Eine Frage zur Geologie',
    body: 'Liebe Lina, liebe Thalia,\n\nich habe am Wanderweg hinter der Kirche einen rosafarbenen Stein gefunden und bin unsicher: Rosenquarz oder nur ein sehr hübscher Kiesel mit Ambitionen? Ich schicke Ihnen eine Hälfte zur Begutachtung. Die andere behalte ich, zum Staunen.\n\nIn Ihrem Dorf gibt es, wie ich höre, ein Meer. Wir haben nur einen Berg. Dafür redet der Berg selten dazwischen.\n\nCon affetto,\nPater Matteo',
    gift: { itemId: 'rosenquarz', count: 1 },
  },
  {
    id: 'matteo-4',
    afterDays: 50,
    subject: 'Eine Einladung',
    body: 'Liebe Lina, liebe Thalia,\n\nim Herbst feiern wir in Montecielo das Fest des Heiligen Michael. Es gibt Musik, zu viel Essen und die berüchtigte Tombola des Bürgermeisters, bei der man regelmäßig einen Esel gewinnt, den niemand haben möchte.\n\nIch würde mich freuen, wenn Sie einmal vorbeikämen. Bis dahin lege ich Ihnen eine Tasse bei, die Signora Rosa für Besucher aufhebt. Sie sagt, sie sei „für besondere Gäste“. Ich glaube, Sie sind jetzt welche.\n\nBuona notte und Gottes Segen,\nPater Matteo',
    gift: { itemId: 'tasse-stadt-montecielo', count: 1 },
  },
];
