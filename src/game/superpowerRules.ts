import {
  CardGroup,
  CategoryFilter,
  SuperpowerCard,
} from '../data/superpowerCards';

export interface DealtRound {
  group: CardGroup;
  cards: SuperpowerCard[];
}

export function dealThreeCards(
  catalog: SuperpowerCard[],
  filter: CategoryFilter,
  seenIds: Set<string>,
  rng: () => number = Math.random
): DealtRound {
  const groups: CardGroup[] = ['shield', 'protein', 'energy'];

  let chosenGroup: CardGroup;
  if (filter !== 'random') {
    chosenGroup = filter;
  } else {
    // Prefer groups that still have unseen cards
    const groupsWithUnseen = groups.filter((g) =>
      catalog.some((c) => c.group === g && !seenIds.has(c.id))
    );
    const poolGroups = groupsWithUnseen.length > 0 ? groupsWithUnseen : groups;
    chosenGroup = poolGroups[Math.floor(rng() * poolGroups.length)];
  }

  const groupCards = catalog.filter((c) => c.group === chosenGroup);
  const unseen = shuffleCards(
    groupCards.filter((c) => !seenIds.has(c.id)),
    rng
  );
  const seen = shuffleCards(
    groupCards.filter((c) => seenIds.has(c.id)),
    rng
  );

  // Always pick unseen first, then pad with already-seen cards from the same group if < 3 unseen remain
  const selected = [...unseen, ...seen].slice(0, 3);

  return {
    group: chosenGroup,
    cards: selected,
  };
}

export function shuffleCards<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function markCardSeen(
  seenIds: Set<string>,
  cardId: string
): Set<string> {
  const next = new Set(seenIds);
  next.add(cardId);
  return next;
}

export const TOTAL_ROUNDS = 10;

export function dealRandomTrioRound(
  catalog: SuperpowerCard[],
  usedIds: Set<string>,
  previousRoundIds: Set<string> = new Set(),
  rng: () => number = Math.random
): SuperpowerCard[] {
  const fresh = shuffleCards(
    catalog.filter((c) => !usedIds.has(c.id)),
    rng
  );

  if (fresh.length >= 3) {
    return fresh.slice(0, 3);
  }

  const chosen = [...fresh];
  const chosenIds = new Set(chosen.map((c) => c.id));

  const nonImmediatePool = shuffleCards(
    catalog.filter((c) => !chosenIds.has(c.id) && !previousRoundIds.has(c.id)),
    rng
  );

  for (const card of nonImmediatePool) {
    if (chosen.length >= 3) break;
    chosen.push(card);
    chosenIds.add(card.id);
  }

  if (chosen.length < 3) {
    const fallbackPool = shuffleCards(
      catalog.filter((c) => !chosenIds.has(c.id)),
      rng
    );
    for (const card of fallbackPool) {
      if (chosen.length >= 3) break;
      chosen.push(card);
    }
  }

  return chosen;
}

export function isCatalogCompleted(
  catalog: SuperpowerCard[],
  seenIds: Set<string>
): boolean {
  return catalog.every((c) => seenIds.has(c.id));
}
