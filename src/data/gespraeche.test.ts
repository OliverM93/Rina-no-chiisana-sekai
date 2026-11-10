import { describe, expect, it } from 'vitest';
import { NPC_BY_ID } from './npcs';
import { pairChatKey, PAIR_CHATS } from './gespraeche';

describe('Spontane Gespräche', () => {
  it('nur zwischen existierenden Bewohnern, jeweils mindestens zwei Austausche', () => {
    for (const [key, list] of Object.entries(PAIR_CHATS)) {
      const [a, b] = key.split('+');
      expect(NPC_BY_ID[a], key).toBeTruthy();
      expect(NPC_BY_ID[b], key).toBeTruthy();
      expect(list.length, key).toBeGreaterThanOrEqual(2);
      for (const ex of list) expect(ex.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('Schlüssel lässt sich in beiden Reihenfolgen finden', () => {
    expect(pairChatKey('olaf', 'gisela')).toEqual({ key: 'gisela+olaf', swapped: true });
    expect(pairChatKey('gisela', 'olaf')).toEqual({ key: 'gisela+olaf', swapped: false });
    expect(pairChatKey('olaf', 'winston')).toBeNull();
  });
});
