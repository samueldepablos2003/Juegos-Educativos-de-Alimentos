import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyTimedPlacementDelta,
  applyTimedRemovalDelta,
  formatNutriPlatoTime,
  isNutriPlatoTimeUrgent,
  NUTRIPLATO_TIMED_DURATIONS_MIN,
} from './nutriplatoModes';

test('NUTRIPLATO_TIMED_DURATIONS_MIN exposes 1, 2, 3, and 5 minute presets', () => {
  assert.deepEqual([...NUTRIPLATO_TIMED_DURATIONS_MIN], [1, 2, 3, 5]);
});

test('applyTimedPlacementDelta raises progress by +20% on valid placements and completes at 100%', () => {
  let progress = 0;
  for (let step = 1; step <= 4; step++) {
    const res = applyTimedPlacementDelta(progress, true);
    assert.equal(res.nextProgress, step * 20);
    assert.equal(res.delta, 20);
    assert.equal(res.isComplete, false);
    progress = res.nextProgress;
  }

  const finalRes = applyTimedPlacementDelta(progress, true);
  assert.equal(finalRes.nextProgress, 100);
  assert.equal(finalRes.delta, 20);
  assert.equal(finalRes.isComplete, true);
});

test('applyTimedPlacementDelta lowers progress by -15% on mistakes and clamps at 0%', () => {
  const fromZero = applyTimedPlacementDelta(0, false);
  assert.equal(fromZero.nextProgress, 0);
  assert.equal(fromZero.delta, 0);
  assert.equal(fromZero.isComplete, false);

  const fromForty = applyTimedPlacementDelta(40, false);
  assert.equal(fromForty.nextProgress, 25);
  assert.equal(fromForty.delta, -15);
  assert.equal(fromForty.isComplete, false);

  const fromTen = applyTimedPlacementDelta(10, false);
  assert.equal(fromTen.nextProgress, 0);
  assert.equal(fromTen.delta, -10);
});

test('applyTimedRemovalDelta deducts 20% clamped at 0% to prevent progress farming', () => {
  assert.equal(applyTimedRemovalDelta(60), 40);
  assert.equal(applyTimedRemovalDelta(15), 0);
  assert.equal(applyTimedRemovalDelta(0), 0);
});

test('formatNutriPlatoTime and isNutriPlatoTimeUrgent handle MM:SS formatting and last-15s urgency', () => {
  assert.equal(formatNutriPlatoTime(180), '03:00');
  assert.equal(formatNutriPlatoTime(65), '01:05');
  assert.equal(formatNutriPlatoTime(9), '00:09');
  assert.equal(formatNutriPlatoTime(0), '00:00');
  assert.equal(formatNutriPlatoTime(-5), '00:00');

  assert.equal(isNutriPlatoTimeUrgent(16), false);
  assert.equal(isNutriPlatoTimeUrgent(15), true);
  assert.equal(isNutriPlatoTimeUrgent(1), true);
  assert.equal(isNutriPlatoTimeUrgent(0), false);
});
