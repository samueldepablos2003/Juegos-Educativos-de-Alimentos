import test from 'node:test';
import assert from 'node:assert/strict';
import { SUPERPOWER_CARDS } from '../data/superpowerCards';
import {
  dealRandomTrioRound,
  dealThreeCards,
  isCatalogCompleted,
  markCardSeen,
  TOTAL_ROUNDS,
} from './superpowerRules';

test('superpower catalog contains valid educational cards across all 3 food groups', () => {
  assert.ok(SUPERPOWER_CARDS.length >= 18);
  assert.ok(SUPERPOWER_CARDS.filter((c) => c.group === 'shield').length >= 6);
  assert.ok(SUPERPOWER_CARDS.filter((c) => c.group === 'protein').length >= 6);
  assert.ok(SUPERPOWER_CARDS.filter((c) => c.group === 'energy').length >= 6);

  for (const card of SUPERPOWER_CARDS) {
    assert.ok(card.superpowerTitle.trim().length > 0);
    assert.ok(card.superpowerDesc.trim().length > 0);
    assert.ok(card.familyTip.trim().length > 0);
  }
});

test('deals 3 cards belonging to the exact same group', () => {
  const round = dealThreeCards(
    SUPERPOWER_CARDS,
    'protein',
    new Set(),
    () => 0.25
  );
  assert.equal(round.group, 'protein');
  assert.equal(round.cards.length, 3);
  assert.equal(
    round.cards.every((c) => c.group === 'protein'),
    true
  );
});

test('prefers unseen cards without repeating until group unseen pool drops below 3', () => {
  const shieldCards = SUPERPOWER_CARDS.filter((c) => c.group === 'shield');
  const seen = new Set([shieldCards[0].id, shieldCards[1].id, shieldCards[2].id]);

  const round = dealThreeCards(SUPERPOWER_CARDS, 'shield', seen, () => 0.5);
  assert.equal(round.cards.length, 3);
  assert.equal(
    round.cards.every((c) => !seen.has(c.id)),
    true
  );
});

test('pads with seen cards from the same group when fewer than 3 unseen remain', () => {
  const energyCards = SUPERPOWER_CARDS.filter((c) => c.group === 'energy');
  const seen = new Set(energyCards.slice(0, energyCards.length - 1).map((c) => c.id));

  const round = dealThreeCards(SUPERPOWER_CARDS, 'energy', seen, () => 0.4);
  assert.equal(round.cards.length, 3);
  assert.equal(
    round.cards.some((c) => c.id === energyCards[energyCards.length - 1].id),
    true
  );
});

test('tracks seen cards and detects full catalog completion', () => {
  let seen = new Set<string>();
  assert.equal(isCatalogCompleted(SUPERPOWER_CARDS, seen), false);

  for (const card of SUPERPOWER_CARDS) {
    seen = markCardSeen(seen, card.id);
  }
  assert.equal(isCatalogCompleted(SUPERPOWER_CARDS, seen), true);
});

test('dealRandomTrioRound deals 3 unique random cards across 10 rounds avoiding immediate repeats', () => {
  assert.equal(TOTAL_ROUNDS, 10);
  const used = new Set<string>();
  let prev = new Set<string>();

  for (let r = 0; r < TOTAL_ROUNDS; r++) {
    const trio = dealRandomTrioRound(SUPERPOWER_CARDS, used, prev, () => 0.37);
    assert.equal(trio.length, 3);
    assert.equal(new Set(trio.map((c) => c.id)).size, 3);
    for (const c of trio) {
      assert.equal(prev.has(c.id), false);
      used.add(c.id);
    }
    prev = new Set(trio.map((c) => c.id));
  }
  assert.ok(used.size >= Math.min(SUPERPOWER_CARDS.length, TOTAL_ROUNDS * 3));
});
