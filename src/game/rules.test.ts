import test from 'node:test';
import assert from 'node:assert/strict';
import { FOODS } from '../data/foods';
import {
  countFilledSlots,
  createInitialPlate,
  createInitialVolunteerStats,
  evaluateFoodPlacement,
  filterFoods,
  isPlateComplete,
  isRainbowPlate,
  recordCompletedPlateStats,
  recordDistractorLessonStats,
  removeFoodFromPlate,
} from './rules';

import {
  BASE_PLATE_Z_INDEX,
  bowlToSectorLocal,
  bringTransformToFront,
  clampToSectorSafeZone,
  computeMovedSectorLocal,
  computeRotatedAngle,
  computeWheelScale,
  createPlatedTransform,
  getStackDepthStyle,
  MAX_FOOD_SCALE,
  MAX_VISIBLE_PER_SECTOR,
  MIN_FOOD_SCALE,
  OUTER_OVERFLOW_RADIUS,
  PlatedTransform,
  PlateFoodSector,
  reorganizarPlatoCoherente,
  sectorLocalToBowl,
} from './platingPhysics';

const byId = (id: string) => {
  const found = FOODS.find((f) => f.id === id);
  if (!found) throw new Error(`Missing food ${id}`);
  return found;
};

test('catalog has all 44 expected foods', () => {
  assert.equal(FOODS.length, 44);
});

test('places healthy foods into matching sectors and detects plate completion', () => {
  let plate = createInitialPlate();
  assert.equal(countFilledSlots(plate), 0);
  assert.equal(isPlateComplete(plate), false);

  const r1 = evaluateFoodPlacement(plate, byId('auyama'), 'shield');
  assert.equal(r1.accepted, true);
  plate = r1.updatedPlate;

  const r2 = evaluateFoodPlacement(plate, byId('brocoli'), 'shield');
  assert.equal(r2.accepted, true);
  assert.equal(r2.unlockedRainbow, true);
  plate = r2.updatedPlate;
  assert.equal(isRainbowPlate(plate.shield), true);

  const r3 = evaluateFoodPlacement(plate, byId('caraotas'), 'protein');
  assert.equal(r3.accepted, true);
  plate = r3.updatedPlate;

  const r4 = evaluateFoodPlacement(plate, byId('arepa'), 'energy');
  assert.equal(r4.accepted, true);
  plate = r4.updatedPlate;

  const r5 = evaluateFoodPlacement(plate, byId('agua'), 'hydration');
  assert.equal(r5.accepted, true);
  assert.equal(r5.isPlateComplete, true);
  plate = r5.updatedPlate;

  assert.equal(countFilledSlots(plate), 5);
  assert.equal(isPlateComplete(plate), true);
});

test('same color vegetables do not unlock rainbow bonus', () => {
  let plate = createInitialPlate();
  plate = evaluateFoodPlacement(plate, byId('auyama'), 'shield').updatedPlate;
  const r2 = evaluateFoodPlacement(plate, byId('zanahoria'), 'shield');
  assert.equal(r2.accepted, true);
  assert.equal(r2.unlockedRainbow, false);
  assert.equal(isRainbowPlate(r2.updatedPlate.shield), false);
});

test('rejects distractors with educational message', () => {
  const plate = createInitialPlate();
  const res = evaluateFoodPlacement(plate, byId('refresco'), 'hydration');
  assert.equal(res.accepted, false);
  assert.equal(res.reason, 'distractor');
  assert.equal(countFilledSlots(res.updatedPlate), 0);
  assert.match(res.message, /azúcar/i);
});

test('guides child when food is dropped in the wrong sector', () => {
  const plate = createInitialPlate();
  const res = evaluateFoodPlacement(plate, byId('arepa'), 'protein');
  assert.equal(res.accepted, false);
  assert.equal(res.reason, 'wrong_sector');
  assert.equal(res.targetSector, 'energy');
});

test('removes food from plate cleanly', () => {
  let plate = createInitialPlate();
  plate = evaluateFoodPlacement(plate, byId('tomate'), 'shield').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('pepino'), 'shield').updatedPlate;
  assert.equal(plate.shield.length, 2);

  plate = removeFoodFromPlate(plate, 'shield', 0);
  assert.equal(plate.shield.length, 1);
  assert.equal(plate.shield[0].id, 'pepino');
});

test('filters foods by mode and tab', () => {
  const freeAll = filterFoods(FOODS, 'free', 'all');
  assert.equal(freeAll.length, 44);

  const drinks = filterFoods(FOODS, 'free', 'drinks');
  assert.equal(drinks.some((f) => f.id === 'agua'), true);
  assert.equal(drinks.some((f) => f.id === 'leche'), true);
  assert.equal(drinks.some((f) => f.id === 'refresco'), true);
  assert.equal(drinks.some((f) => f.id === 'jugo_cajita'), true);

  const processed = filterFoods(FOODS, 'free', 'processed');
  assert.equal(processed.every((f) => f.category === 'distractor'), true);
  assert.equal(processed.some((f) => f.id === 'refresco'), true);
  assert.equal(processed.some((f) => f.id === 'charcuteria'), true);
  assert.equal(processed.some((f) => f.id === 'caramelos'), true);
  assert.equal(processed.some((f) => f.id === 'salchicha'), true);
  assert.equal(processed.some((f) => f.id === 'galletas'), true);
  assert.equal(processed.some((f) => f.id === 'dona'), true);
  assert.equal(processed.some((f) => f.id === 'chucheria'), true);

  const breakfastAll = filterFoods(FOODS, 'breakfast', 'all');
  assert.equal(breakfastAll.some((f) => f.id === 'arepa'), true);
  assert.equal(breakfastAll.some((f) => f.id === 'huevo'), true);
});

test('accumulates volunteer stats cleanly', () => {
  let stats = createInitialVolunteerStats();
  let plate = createInitialPlate();
  plate = evaluateFoodPlacement(plate, byId('tomate'), 'shield').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('pepino'), 'shield').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('huevo'), 'protein').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('arepa'), 'energy').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('agua'), 'hydration').updatedPlate;

  stats = recordCompletedPlateStats(stats, plate, 'breakfast', '2026-11-15T12:00:00Z');
  stats = recordDistractorLessonStats(stats, '2026-11-15T12:01:00Z');

  assert.equal(stats.totalPlatesCompleted, 1);
  assert.equal(stats.rainbowPlatesAchieved, 1);
  assert.equal(stats.waterChosenCount, 1);
  assert.equal(stats.distractorLessonsCount, 1);
  assert.equal(stats.byMode.breakfast, 1);
});

test('allows cumulative stacking of repeated foods up to visual cap without overflowing', () => {
  let plate = createInitialPlate();
  for (let i = 0; i < MAX_VISIBLE_PER_SECTOR + 3; i++) {
    const res = evaluateFoodPlacement(plate, byId('zanahoria'), 'shield');
    assert.equal(res.accepted, true);
    plate = res.updatedPlate;
  }
  assert.equal(plate.shield.length, MAX_VISIBLE_PER_SECTOR);
});

test('plating physics keeps dropped foods inside sector boundaries with outer rim overflow allowed and strict dividers', () => {
  const safeShield = clampToSectorSafeZone('shield', 0, 0);
  assert.ok(safeShield.bowlX <= 41);
  assert.ok(Math.hypot(safeShield.bowlX - 50, safeShield.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.01);

  const safeProtein = clampToSectorSafeZone('protein', 99, 99);
  assert.ok(safeProtein.bowlX >= 59 && safeProtein.bowlY <= 41);
  assert.ok(Math.hypot(safeProtein.bowlX - 50, safeProtein.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.01);

  const safeEnergy = clampToSectorSafeZone('energy', 52, 52);
  assert.ok(safeEnergy.bowlX >= 59 && safeEnergy.bowlY >= 59);
  assert.ok(Math.hypot(safeEnergy.bowlX - 50, safeEnergy.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.01);

  const transform = createPlatedTransform({
    instanceId: 'shield-zanahoria-1',
    foodId: 'zanahoria',
    sector: 'shield',
    zIndex: BASE_PLATE_Z_INDEX,
    dropContext: {
      clientX: 220,
      clientY: 260,
      bowlRect: { left: 100, top: 100, width: 400, height: 400 },
    },
  });
  assert.equal(transform.zIndex, 10);
  assert.ok(transform.rotation >= -15 && transform.rotation <= 15);
  assert.ok(transform.scale >= 1.4 && transform.scale <= 1.48);

  const topLayer = getStackDepthStyle(4, 5);
  const deepLayer = getStackDepthStyle(0, 5);
  assert.equal(topLayer.depthScale, 1);
  assert.equal(topLayer.brightness, 1);
  assert.ok(deepLayer.depthScale < 1);
  assert.ok(deepLayer.brightness < 1);
});

test('free repositioning clamps dragged foods inside their own sector and plate boundaries', () => {
  const sectors: PlateFoodSector[] = ['shield', 'protein', 'energy'];
  for (const sector of sectors) {
    const startBowl = sector === 'shield' ? { bowlX: 28, bowlY: 50 } : sector === 'protein' ? { bowlX: 70, bowlY: 30 } : { bowlX: 70, bowlY: 70 };
    const local = bowlToSectorLocal(sector, startBowl.bowlX, startBowl.bowlY);
    const back = sectorLocalToBowl(sector, local.localX, local.localY);
    assert.ok(Math.abs(back.bowlX - startBowl.bowlX) < 0.01);
    assert.ok(Math.abs(back.bowlY - startBowl.bowlY) < 0.01);

    // Drag wildly outside plate and across dividers
    const movedExtreme = computeMovedSectorLocal({
      sector,
      startBowlX: startBowl.bowlX,
      startBowlY: startBowl.bowlY,
      deltaClientX: sector === 'shield' ? 900 : -900,
      deltaClientY: sector === 'protein' ? 900 : -900,
      bowlWidth: 500,
      bowlHeight: 500,
    });
    const clampedBowl = sectorLocalToBowl(sector, movedExtreme.localX, movedExtreme.localY);
    assert.ok(Math.hypot(clampedBowl.bowlX - 50, clampedBowl.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.05);
    if (sector === 'shield') {
      assert.ok(clampedBowl.bowlX <= 41.05);
    } else if (sector === 'protein') {
      assert.ok(clampedBowl.bowlX >= 58.95 && clampedBowl.bowlY <= 41.05);
    } else {
      assert.ok(clampedBowl.bowlX >= 58.95 && clampedBowl.bowlY >= 58.95);
    }
  }
});

test('wheel zoom scales smoothly within [0.7, 2.2] limits', () => {
  const grown = computeWheelScale(1, -100);
  assert.ok(grown > 1 && grown <= MAX_FOOD_SCALE);

  const shrunk = computeWheelScale(1, 100);
  assert.ok(shrunk < 1 && shrunk >= MIN_FOOD_SCALE);

  assert.equal(computeWheelScale(MAX_FOOD_SCALE, -100), MAX_FOOD_SCALE);
  assert.equal(computeWheelScale(MIN_FOOD_SCALE, 100), MIN_FOOD_SCALE);
});

test('bringTransformToFront assigns maxZIndex + 1 across all sectors', () => {
  const placements: Record<PlateFoodSector, PlatedTransform[]> = {
    shield: [
      {
        instanceId: 's1',
        foodId: 'tomate',
        sector: 'shield',
        localX: 50,
        localY: 50,
        zIndex: 10,
        rotation: 0,
        scale: 1,
      },
      {
        instanceId: 's2',
        foodId: 'brocoli',
        sector: 'shield',
        localX: 55,
        localY: 55,
        zIndex: 12,
        rotation: 0,
        scale: 1,
      },
    ],
    protein: [
      {
        instanceId: 'p1',
        foodId: 'pollo',
        sector: 'protein',
        localX: 50,
        localY: 50,
        zIndex: 15,
        rotation: 0,
        scale: 1,
      },
    ],
    energy: [],
  };

  const { updated, nextZIndex } = bringTransformToFront(placements, 'shield', 's1');
  assert.equal(nextZIndex, 16);
  assert.equal(updated.shield[0].zIndex, 16);
  assert.equal(updated.shield[1].zIndex, 12);
});

test('computeRotatedAngle supports smooth 360-degree manual rotation', () => {
  // Dragging clockwise by 45 degrees from initial 15 degrees -> 60 degrees
  assert.equal(computeRotatedAngle(15, -90, -45), 60);
  // Dragging counter-clockwise past 0 wraps cleanly into [0, 360)
  assert.equal(computeRotatedAngle(10, 0, -30), 340);
  // Dragging clockwise past 360 wraps cleanly into [0, 360)
  assert.equal(computeRotatedAngle(350, 0, 25), 15);
});

test('detectRadialGripZone separates inner drag zone (<= 0.6R) from outer rotate zone (> 0.6R)', async () => {
  const { detectRadialGripZone } = await import('./platingPhysics');
  const rect = { left: 100, top: 100, width: 100, height: 100 }; // center (150, 150), R = 50, threshold = 30

  const centerHit = detectRadialGripZone(rect, 150, 150);
  assert.equal(centerHit.zone, 'drag');
  assert.equal(centerHit.dist, 0);

  const innerBoundaryHit = detectRadialGripZone(rect, 180, 150); // dist = 30 === 0.6 * 50
  assert.equal(innerBoundaryHit.zone, 'drag');

  const outerEdgeHit = detectRadialGripZone(rect, 185, 150); // dist = 35 > 30
  assert.equal(outerEdgeHit.zone, 'rotate');

  const diagonalOuterHit = detectRadialGripZone(rect, 175, 175); // hypot(25, 25) = 35.35 > 30
  assert.equal(diagonalOuterHit.zone, 'rotate');
});

test('newly added Guanábana and Pan validate in shield and energy sectors', () => {
  let plate = createInitialPlate();
  const resGuanabana = evaluateFoodPlacement(plate, byId('guanabana'), 'shield');
  assert.equal(resGuanabana.accepted, true);
  plate = resGuanabana.updatedPlate;

  const wrongPan = evaluateFoodPlacement(plate, byId('pan'), 'protein');
  assert.equal(wrongPan.accepted, false);
  assert.equal(wrongPan.targetSector, 'energy');

  const resPan = evaluateFoodPlacement(plate, byId('pan'), 'energy');
  assert.equal(resPan.accepted, true);
});

test('newly added Berenjena, Manzana, Charcutería, and Caramelos validate properly', () => {
  let plate = createInitialPlate();
  const resBerenjena = evaluateFoodPlacement(plate, byId('berenjena'), 'shield');
  assert.equal(resBerenjena.accepted, true);
  plate = resBerenjena.updatedPlate;

  const resManzana = evaluateFoodPlacement(plate, byId('manzana'), 'shield');
  assert.equal(resManzana.accepted, true);
  assert.equal(resManzana.unlockedRainbow, true);

  const resCharcuteria = evaluateFoodPlacement(plate, byId('charcuteria'), 'protein');
  assert.equal(resCharcuteria.accepted, false);
  assert.equal(resCharcuteria.reason, 'distractor');

  const resCaramelos = evaluateFoodPlacement(plate, byId('caramelos'), 'energy');
  assert.equal(resCaramelos.accepted, false);
  assert.equal(resCaramelos.reason, 'distractor');
});

test('newly added Aguacate, Parchita, Leche Líquida, Salchicha, and Galletas validate properly', () => {
  let plate = createInitialPlate();
  const resAguacate = evaluateFoodPlacement(plate, byId('aguacate'), 'shield');
  assert.equal(resAguacate.accepted, true);
  plate = resAguacate.updatedPlate;

  const resParchita = evaluateFoodPlacement(plate, byId('parchita'), 'shield');
  assert.equal(resParchita.accepted, true);
  assert.equal(resParchita.unlockedRainbow, true);
  plate = resParchita.updatedPlate;

  const resLeche = evaluateFoodPlacement(plate, byId('leche'), 'protein');
  assert.equal(resLeche.accepted, true);
  plate = resLeche.updatedPlate;

  const resSalchicha = evaluateFoodPlacement(plate, byId('salchicha'), 'protein');
  assert.equal(resSalchicha.accepted, false);
  assert.equal(resSalchicha.reason, 'distractor');

  const resGalletas = evaluateFoodPlacement(plate, byId('galletas'), 'energy');
  assert.equal(resGalletas.accepted, false);
  assert.equal(resGalletas.reason, 'distractor');
});

test('reorganizarPlatoCoherente scales adaptively, layers base foods under detail foods, and respects internal dividers', () => {
  const makeTransform = (
    instanceId: string,
    foodId: string,
    sector: PlateFoodSector
  ): PlatedTransform => ({
    instanceId,
    foodId,
    sector,
    localX: 50,
    localY: 50,
    zIndex: 10,
    rotation: 0,
    scale: 1,
  });

  // Few items (1..3): scale in [1.35, 1.75], base lower zIndex than detail
  const fewPlate = reorganizarPlatoCoherente(
    {
      shield: [
        makeTransform('s1', 'tomate', 'shield'),
        makeTransform('s2', 'repollo', 'shield'),
      ],
      protein: [makeTransform('p1', 'pollo', 'protein')],
      energy: [
        makeTransform('e1', 'platano', 'energy'),
        makeTransform('e2', 'arroz', 'energy'),
        makeTransform('e3', 'yuca', 'energy'),
      ],
    },
    { rng: () => 0.5 }
  );

  // repollo (base, index 1) should have lower zIndex than tomate (detail, index 0)
  assert.equal(fewPlate.shield[0].foodId, 'tomate');
  assert.equal(fewPlate.shield[1].foodId, 'repollo');
  assert.ok(fewPlate.shield[1].zIndex < fewPlate.shield[0].zIndex);
  assert.ok(fewPlate.shield[1].scale > fewPlate.shield[0].scale);

  for (const sector of ['shield', 'protein', 'energy'] as const) {
    for (const item of fewPlate[sector]) {
      assert.ok(item.scale >= 1.35 && item.scale <= 1.75);
      assert.ok(item.rotation >= -20 && item.rotation <= 20);
      const { bowlX, bowlY } = sectorLocalToBowl(sector, item.localX, item.localY);
      assert.ok(Math.hypot(bowlX - 50, bowlY - 50) <= 54.5);
      if (sector === 'shield') assert.ok(bowlX <= 41);
      if (sector === 'protein') assert.ok(bowlX >= 59 && bowlY <= 41);
      if (sector === 'energy') assert.ok(bowlX >= 59 && bowlY >= 59);
    }
  }

  // Many items (10 in shield): scale in [0.95, 1.40], strict divider boundaries
  const manyShieldIds = [
    'tomate',
    'pepino',
    'repollo',
    'brocoli',
    'auyama',
    'zanahoria',
    'guayaba',
    'naranja',
    'patilla',
    'remolacha',
  ];
  const manyPlate = reorganizarPlatoCoherente({
    shield: manyShieldIds.map((id, i) => makeTransform(`ms-${i}`, id, 'shield')),
    protein: [
      makeTransform('mp-0', 'huevo', 'protein'),
      makeTransform('mp-1', 'caraotas', 'protein'),
      makeTransform('mp-2', 'pollo', 'protein'),
      makeTransform('mp-3', 'queso', 'protein'),
    ],
    energy: [],
  });

  for (const item of manyPlate.shield) {
    assert.ok(item.scale >= 0.95 && item.scale <= 1.4);
    assert.ok(item.rotation >= -20 && item.rotation <= 20);
    const { bowlX } = sectorLocalToBowl('shield', item.localX, item.localY);
    assert.ok(bowlX <= 41);
  }
  // Base pollo (index 2) sits underneath detail huevo (index 0) & caraotas (index 1)
  assert.ok(manyPlate.protein[2].zIndex < manyPlate.protein[0].zIndex);
  assert.ok(manyPlate.protein[2].zIndex < manyPlate.protein[1].zIndex);
});
