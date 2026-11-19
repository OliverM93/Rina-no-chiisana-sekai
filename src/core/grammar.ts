/**
 * Kleine Grammatik-Helfer für zusammengesetzte Spieltexte.
 */

/**
 * Genitiv eines Namens für Besitzangaben: „Olafs“, aber „Lars’“ und „Jens’“
 * (nach s, ß, x, z steht laut Duden ein Apostroph statt eines weiteren s).
 */
export function possessive(name: string): string {
  return /[sßxz]$/i.test(name) ? `${name}’` : `${name}s`;
}
