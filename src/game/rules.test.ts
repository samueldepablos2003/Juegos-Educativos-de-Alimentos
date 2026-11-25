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
  DIVIDER_MARGIN,
  FATS_SAFE_RADIUS,
  getStackDepthStyle,
  LEFT_SPLIT_BOWL_Y,
  MAX_FOOD_SCALE,
  MAX_VISIBLE_PER_SECTOR,
  MIN_FOOD_SCALE,
  OUTER_OVERFLOW_RADIUS,
  PlatedTransform,
  PlateFoodSector,
  reorganizarPlatoCoherente,
  RIGHT_SPLIT_BOWL_Y,
  sectorLocalToBowl,
} from './platingPhysics';

const byId = (id: string) => {
  const found = FOODS.find((f) => f.id === id);
  if (!found) throw new Error(`Missing food ${id}`);
  return found;
};

test('catalog has all 64 expected foods', () => {
  assert.equal(FOODS.length, 64);
});

test('places healthy foods into all 6 restructured groups and detects plate completion', () => {
  let plate = createInitialPlate();
  assert.equal(countFilledSlots(plate), 0);
  assert.equal(isPlateComplete(plate), false);

  const r1 = evaluateFoodPlacement(plate, byId('auyama'), 'vegetables');
  assert.equal(r1.accepted, true);
  plate = r1.updatedPlate;

  const r2 = evaluateFoodPlacement(plate, byId('fresa'), 'fruits');
  assert.equal(r2.accepted, true);
  assert.equal(r2.unlockedRainbow, true);
  plate = r2.updatedPlate;
  assert.equal(isRainbowPlate([...plate.vegetables, ...plate.fruits]), true);

  const r3 = evaluateFoodPlacement(plate, byId('arepa'), 'cereals');
  assert.equal(r3.accepted, true);
  plate = r3.updatedPlate;

  const r4 = evaluateFoodPlacement(plate, byId('caraotas'), 'protein');
  assert.equal(r4.accepted, true);
  plate = r4.updatedPlate;

  const r5 = evaluateFoodPlacement(plate, byId('aguacate'), 'fats');
  assert.equal(r5.accepted, true);
  assert.equal(r5.isPlateComplete, false);
  plate = r5.updatedPlate;

  const r6 = evaluateFoodPlacement(plate, byId('agua'), 'hydration');
  assert.equal(r6.accepted, true);
  assert.equal(r6.isPlateComplete, true);
  plate = r6.updatedPlate;

  assert.equal(countFilledSlots(plate), 6);
  assert.equal(isPlateComplete(plate), true);
});

test('same color vegetables and fruits do not unlock rainbow bonus', () => {
  let plate = createInitialPlate();
  plate = evaluateFoodPlacement(plate, byId('auyama'), 'vegetables').updatedPlate;
  const r2 = evaluateFoodPlacement(plate, byId('mango'), 'fruits');
  assert.equal(r2.accepted, true);
  assert.equal(r2.unlockedRainbow, false);
  assert.equal(
    isRainbowPlate([...r2.updatedPlate.vegetables, ...r2.updatedPlate.fruits]),
    false
  );
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
  assert.equal(res.targetSector, 'cereals');

  const fruitInVeg = evaluateFoodPlacement(plate, byId('fresa'), 'vegetables');
  assert.equal(fruitInVeg.accepted, false);
  assert.equal(fruitInVeg.reason, 'wrong_sector');
  assert.equal(fruitInVeg.targetSector, 'fruits');

  const fatInCereals = evaluateFoodPlacement(plate, byId('aceite'), 'cereals');
  assert.equal(fatInCereals.accepted, false);
  assert.equal(fatInCereals.reason, 'wrong_sector');
  assert.equal(fatInCereals.targetSector, 'fats');
});

test('removes food from plate cleanly', () => {
  let plate = createInitialPlate();
  plate = evaluateFoodPlacement(plate, byId('tomate'), 'vegetables').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('pepino'), 'vegetables').updatedPlate;
  assert.equal(plate.vegetables.length, 2);

  plate = removeFoodFromPlate(plate, 'vegetables', 0);
  assert.equal(plate.vegetables.length, 1);
  assert.equal(plate.vegetables[0].id, 'pepino');

  plate = evaluateFoodPlacement(plate, byId('aceite'), 'fats').updatedPlate;
  assert.equal(plate.fats.length, 1);
  plate = removeFoodFromPlate(plate, 'fats', 0);
  assert.equal(plate.fats.length, 0);
});

test('filters foods by mode and tab', () => {
  const freeAll = filterFoods(FOODS, 'free', 'all');
  assert.equal(freeAll.length, 64);

  const vegs = filterFoods(FOODS, 'free', 'vegetables');
  assert.equal(vegs.every((f) => f.category === 'vegetable'), true);
  assert.equal(vegs.length, 11);

  const fruits = filterFoods(FOODS, 'free', 'fruits');
  assert.equal(fruits.every((f) => f.category === 'fruit'), true);
  assert.equal(fruits.length, 15);

  const cereals = filterFoods(FOODS, 'free', 'cereals');
  assert.equal(cereals.every((f) => f.category === 'carb'), true);
  assert.equal(cereals.length, 11);

  const proteins = filterFoods(FOODS, 'free', 'protein');
  assert.equal(proteins.every((f) => f.category === 'protein'), true);
  assert.equal(proteins.length, 10);

  const fats = filterFoods(FOODS, 'free', 'fats');
  assert.equal(fats.every((f) => f.category === 'fat'), true);
  assert.equal(fats.some((f) => f.id === 'aceite'), true);
  assert.equal(fats.some((f) => f.id === 'aguacate'), true);
  assert.equal(fats.some((f) => f.id === 'mani'), true);

  const drinks = filterFoods(FOODS, 'free', 'drinks');
  assert.equal(drinks.some((f) => f.id === 'agua'), true);
  assert.equal(drinks.some((f) => f.id === 'leche'), true);
  assert.equal(drinks.some((f) => f.id === 'refresco'), true);
  assert.equal(drinks.some((f) => f.id === 'jugo_cajita'), true);

  const processed = filterFoods(FOODS, 'free', 'processed');
  assert.equal(processed.every((f) => f.category === 'distractor'), true);
  assert.equal(processed.some((f) => f.id === 'mayonesa'), true);
  assert.equal(processed.some((f) => f.id === 'helado'), true);
});

test('accumulates volunteer stats cleanly', () => {
  let stats = createInitialVolunteerStats();
  let plate = createInitialPlate();
  plate = evaluateFoodPlacement(plate, byId('tomate'), 'vegetables').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('guanabana'), 'fruits').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('arepa'), 'cereals').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('huevo'), 'protein').updatedPlate;
  plate = evaluateFoodPlacement(plate, byId('aguacate'), 'fats').updatedPlate;
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
    const res = evaluateFoodPlacement(plate, byId('zanahoria'), 'vegetables');
    assert.equal(res.accepted, true);
    plate = res.updatedPlate;
  }
  assert.equal(plate.vegetables.length, MAX_VISIBLE_PER_SECTOR);
});

test('plating physics keeps dropped foods inside sector boundaries across all 5 food sectors', () => {
  const safeVeg = clampToSectorSafeZone('vegetables', 99, 99);
  assert.ok(safeVeg.bowlX <= 50 - DIVIDER_MARGIN + 0.01);
  assert.ok(safeVeg.bowlY <= LEFT_SPLIT_BOWL_Y - DIVIDER_MARGIN + 0.01);
  assert.ok(Math.hypot(safeVeg.bowlX - 50, safeVeg.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.01);

  const safeFruit = clampToSectorSafeZone('fruits', 99, 0);
  assert.ok(safeFruit.bowlX <= 50 - DIVIDER_MARGIN + 0.01);
  assert.ok(safeFruit.bowlY >= LEFT_SPLIT_BOWL_Y + DIVIDER_MARGIN - 0.01);
  assert.ok(Math.hypot(safeFruit.bowlX - 50, safeFruit.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.01);

  const safeCereals = clampToSectorSafeZone('cereals', 0, 99);
  assert.ok(safeCereals.bowlX >= 50 + DIVIDER_MARGIN - 0.01);
  assert.ok(safeCereals.bowlY <= RIGHT_SPLIT_BOWL_Y - DIVIDER_MARGIN + 0.01);

  const safeProtein = clampToSectorSafeZone('protein', 0, 0);
  assert.ok(safeProtein.bowlX >= 50 + DIVIDER_MARGIN - 0.01);
  assert.ok(safeProtein.bowlY >= RIGHT_SPLIT_BOWL_Y + DIVIDER_MARGIN - 0.01);

  const safeFats = clampToSectorSafeZone('fats', 0, 0);
  assert.ok(Math.hypot(safeFats.bowlX - 50, safeFats.bowlY - 50) <= FATS_SAFE_RADIUS + 0.01);

  const transform = createPlatedTransform({
    instanceId: 'vegetables-zanahoria-1',
    foodId: 'zanahoria',
    sector: 'vegetables',
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
  const sectors: PlateFoodSector[] = ['vegetables', 'fruits', 'cereals', 'protein', 'fats'];
  const starts: Record<PlateFoodSector, { bowlX: number; bowlY: number }> = {
    vegetables: { bowlX: 28, bowlY: 36 },
    fruits: { bowlX: 32, bowlY: 82 },
    cereals: { bowlX: 70, bowlY: 30 },
    protein: { bowlX: 70, bowlY: 70 },
    fats: { bowlX: 50, bowlY: 50 },
  };

  for (const sector of sectors) {
    const startBowl = starts[sector];
    const local = bowlToSectorLocal(sector, startBowl.bowlX, startBowl.bowlY);
    const back = sectorLocalToBowl(sector, local.localX, local.localY);
    assert.ok(Math.abs(back.bowlX - startBowl.bowlX) < 0.01);
    assert.ok(Math.abs(back.bowlY - startBowl.bowlY) < 0.01);

    const movedExtreme = computeMovedSectorLocal({
      sector,
      startBowlX: startBowl.bowlX,
      startBowlY: startBowl.bowlY,
      deltaClientX: sector === 'vegetables' || sector === 'fruits' ? 900 : -900,
      deltaClientY: sector === 'vegetables' || sector === 'cereals' ? 900 : -900,
      bowlWidth: 500,
      bowlHeight: 500,
    });
    const clampedBowl = sectorLocalToBowl(sector, movedExtreme.localX, movedExtreme.localY);
    if (sector === 'fats') {
      assert.ok(Math.hypot(clampedBowl.bowlX - 50, clampedBowl.bowlY - 50) <= FATS_SAFE_RADIUS + 0.05);
    } else {
      assert.ok(Math.hypot(clampedBowl.bowlX - 50, clampedBowl.bowlY - 50) <= OUTER_OVERFLOW_RADIUS + 0.05);
    }
  }
});

test('wheel zoom scales smoothly within limits', () => {
  const grown = computeWheelScale(1, -100);
  assert.ok(grown > 1 && grown <= MAX_FOOD_SCALE);

  const shrunk = computeWheelScale(1, 100);
  assert.ok(shrunk < 1 && shrunk >= MIN_FOOD_SCALE);

  assert.equal(computeWheelScale(MAX_FOOD_SCALE, -100), MAX_FOOD_SCALE);
  assert.equal(computeWheelScale(MIN_FOOD_SCALE, 100), MIN_FOOD_SCALE);
});

test('bringTransformToFront assigns maxZIndex + 1 across all sectors', () => {
  const placements: Record<PlateFoodSector, PlatedTransform[]> = {
    vegetables: [
      {
        instanceId: 'v1',
        foodId: 'tomate',
        sector: 'vegetables',
        localX: 50,
        localY: 50,
        zIndex: 10,
        rotation: 0,
        scale: 1,
      },
    ],
    fruits: [
      {
        instanceId: 'f1',
        foodId: 'fresa',
        sector: 'fruits',
        localX: 50,
        localY: 50,
        zIndex: 12,
        rotation: 0,
        scale: 1,
      },
    ],
    cereals: [],
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
    fats: [
      {
        instanceId: 'g1',
        foodId: 'aguacate',
        sector: 'fats',
        localX: 50,
        localY: 50,
        zIndex: 14,
        rotation: 0,
        scale: 1,
      },
    ],
  };

  const { updated, nextZIndex } = bringTransformToFront(placements, 'vegetables', 'v1');
  assert.equal(nextZIndex, 16);
  assert.equal(updated.vegetables[0].zIndex, 16);
});

test('computeRotatedAngle supports smooth 360-degree manual rotation', () => {
  assert.equal(computeRotatedAngle(15, -90, -45), 60);
  assert.equal(computeRotatedAngle(10, 0, -30), 340);
  assert.equal(computeRotatedAngle(350, 0, 25), 15);
});

test('detectRadialGripZone separates inner drag zone (<= 0.6R) from outer rotate zone (> 0.6R)', async () => {
  const { detectRadialGripZone } = await import('./platingPhysics');
  const rect = { left: 100, top: 100, width: 100, height: 100 };

  const centerHit = detectRadialGripZone(rect, 150, 150);
  assert.equal(centerHit.zone, 'drag');
  assert.equal(centerHit.dist, 0);

  const innerBoundaryHit = detectRadialGripZone(rect, 180, 150);
  assert.equal(innerBoundaryHit.zone, 'drag');

  const outerEdgeHit = detectRadialGripZone(rect, 185, 150);
  assert.equal(outerEdgeHit.zone, 'rotate');
});

test('newly added Fresa, Durazno, Melón, Cebolla, Yogurt, Jojoto, Aguacate, Aceite, Maní, Mayonesa, and Helado validate properly', () => {
  let plate = createInitialPlate();

  const resCebolla = evaluateFoodPlacement(plate, byId('cebolla'), 'vegetables');
  assert.equal(resCebolla.accepted, true);
  plate = resCebolla.updatedPlate;

  const resFresa = evaluateFoodPlacement(plate, byId('fresa'), 'fruits');
  assert.equal(resFresa.accepted, true);
  assert.equal(resFresa.unlockedRainbow, true);
  plate = resFresa.updatedPlate;

  const resMelon = evaluateFoodPlacement(plate, byId('melon'), 'fruits');
  assert.equal(resMelon.accepted, true);
  plate = resMelon.updatedPlate;

  const resDurazno = evaluateFoodPlacement(plate, byId('durazno'), 'fruits');
  assert.equal(resDurazno.accepted, true);
  plate = resDurazno.updatedPlate;

  const resYogurt = evaluateFoodPlacement(plate, byId('yogurt'), 'protein');
  assert.equal(resYogurt.accepted, true);
  plate = resYogurt.updatedPlate;

  const resJojoto = evaluateFoodPlacement(plate, byId('jojoto'), 'cereals');
  assert.equal(resJojoto.accepted, true);
  plate = resJojoto.updatedPlate;

  for (const fatId of ['aguacate', 'aceite', 'mani']) {
    const resFat = evaluateFoodPlacement(plate, byId(fatId), 'fats');
    assert.equal(resFat.accepted, true);
    plate = resFat.updatedPlate;
  }

  for (const distractorId of ['mayonesa', 'helado', 'pastelito', 'perro_caliente', 'azucar']) {
    const res = evaluateFoodPlacement(plate, byId(distractorId), 'cereals');
    assert.equal(res.accepted, false);
    assert.equal(res.reason, 'distractor');
  }
});

test('reorganizarPlatoCoherente organizes all 5 sectors cleanly inside boundaries', () => {
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

  const organized = reorganizarPlatoCoherente(
    {
      vegetables: [
        makeTransform('v1', 'tomate', 'vegetables'),
        makeTransform('v2', 'repollo', 'vegetables'),
      ],
      fruits: [
        makeTransform('f1', 'fresa', 'fruits'),
        makeTransform('f2', 'mango', 'fruits'),
      ],
      cereals: [
        makeTransform('c1', 'arepa', 'cereals'),
        makeTransform('c2', 'jojoto', 'cereals'),
      ],
      protein: [makeTransform('p1', 'pollo', 'protein')],
      fats: [makeTransform('g1', 'aguacate', 'fats')],
    },
    { rng: () => 0.5 }
  );

  // Base repollo sits under detail tomate
  assert.ok(organized.vegetables[1].zIndex < organized.vegetables[0].zIndex);
  for (const sector of ['vegetables', 'fruits', 'cereals', 'protein', 'fats'] as const) {
    for (const item of organized[sector]) {
      assert.ok(item.rotation >= -20 && item.rotation <= 20);
      const { bowlX, bowlY } = sectorLocalToBowl(sector, item.localX, item.localY);
      if (sector === 'fats') {
        assert.ok(Math.hypot(bowlX - 50, bowlY - 50) <= FATS_SAFE_RADIUS + 0.05);
      } else {
        assert.ok(Math.hypot(bowlX - 50, bowlY - 50) <= 55.1);
      }
    }
  }
});
