import test from 'node:test';
import assert from 'node:assert/strict';
import { FOODS } from '../data/foods';
import { SEMAFORO_FOODS } from '../data/semaforoFoods';
import {
  computeSemaforoProgress,
  dealSemaforoRound,
  DEFAULT_TIMED_DURATION_MINUTES,
  evaluateSemaforoDrop,
  formatSemaforoCountdown,
  GOAL_SEMAFORO_POINTS,
  isCountdownUrgent,
  isSemaforoComplete,
  SEMAFORO_TIMED_DURATIONS_MIN,
} from './semaforoRules';

test('SEMAFORO_FOODS covers every single food in FOODS plus extras with valid hints', () => {
  const semaforoFoodIds = new Set(SEMAFORO_FOODS.map((f) => f.foodId));
  for (const appFood of FOODS) {
    assert.ok(
      semaforoFoodIds.has(appFood.id),
      `Missing app food ${appFood.id} in SEMAFORO_FOODS`
    );
  }

  const reds = SEMAFORO_FOODS.filter((f) => f.light === 'red');
  const yellows = SEMAFORO_FOODS.filter((f) => f.light === 'yellow');
  const greens = SEMAFORO_FOODS.filter((f) => f.light === 'green');

  assert.ok(reds.length >= 10);
  assert.ok(yellows.length >= 15);
  assert.ok(greens.length >= 20);

  for (const food of SEMAFORO_FOODS) {
    assert.ok(food.name.trim().length > 0);
    assert.ok(food.hintIfWrong.trim().length > 0);
    assert.ok(food.successNote.trim().length > 0);
  }
});

test('dealSemaforoRound loads the full database shuffled via Fisher-Yates', () => {
  const round = dealSemaforoRound(SEMAFORO_FOODS);

  assert.equal(round.totalItems, SEMAFORO_FOODS.length);
  assert.equal(round.tray.length, SEMAFORO_FOODS.length);
  assert.equal(round.lanes.red.length, 0);
  assert.equal(round.lanes.yellow.length, 0);
  assert.equal(round.lanes.green.length, 0);
  assert.equal(round.progressPoints, 0);
  assert.equal(round.goalPoints, GOAL_SEMAFORO_POINTS);
  assert.equal(computeSemaforoProgress(round), 0);
  assert.equal(isSemaforoComplete(round), false);
});

test('evaluateSemaforoDrop advances on correct light, retreats on wrong light (min 0%), and completes at 100%', () => {
  let state = dealSemaforoRound(SEMAFORO_FOODS);
  const firstRed = state.tray.find((e) => e.item.light === 'red')!.item;

  // Mistake at 0% clamps cleanly to 0% without negative values
  const wrongAtZero = evaluateSemaforoDrop(state, firstRed.id, 'green');
  assert.equal(wrongAtZero.accepted, false);
  assert.equal(wrongAtZero.message, firstRed.hintIfWrong);
  assert.equal(wrongAtZero.progressDelta, 0);
  assert.equal(computeSemaforoProgress(wrongAtZero.nextState), 0);
  assert.equal(wrongAtZero.nextState.tray.length, SEMAFORO_FOODS.length);
  state = wrongAtZero.nextState;

  // Correct drop advances progress
  const correct1 = evaluateSemaforoDrop(state, firstRed.id, 'red');
  assert.equal(correct1.accepted, true);
  assert.equal(correct1.progressDelta, 1);
  assert.equal(computeSemaforoProgress(correct1.nextState), 5);
  state = correct1.nextState;

  // Wrong drop on another food retreats progress back to 0% while keeping item in tray
  const firstGreen = state.tray.find((e) => e.item.light === 'green')!.item;
  const wrongAfterHit = evaluateSemaforoDrop(state, firstGreen.id, 'red');
  assert.equal(wrongAfterHit.accepted, false);
  assert.equal(wrongAfterHit.progressDelta, -1);
  assert.equal(computeSemaforoProgress(wrongAfterHit.nextState), 0);
  assert.ok(wrongAfterHit.nextState.tray.some((e) => e.item.id === firstGreen.id));
  state = wrongAfterHit.nextState;

  // Classifying goalPoints foods correctly hits 100% and completes the round
  for (let i = 0; i < state.goalPoints; i += 1) {
    const nextItem = state.tray[0].item;
    const res = evaluateSemaforoDrop(state, nextItem.id, nextItem.light);
    assert.equal(res.accepted, true);
    state = res.nextState;
  }

  assert.equal(computeSemaforoProgress(state), 100);
  assert.equal(isSemaforoComplete(state), true);
});

test('Contrarreloj timer helpers format MM:SS cleanly and trigger urgency in last 15 seconds', () => {
  assert.deepEqual([...SEMAFORO_TIMED_DURATIONS_MIN], [2, 5, 10, 15]);
  assert.equal(DEFAULT_TIMED_DURATION_MINUTES, 5);
  assert.equal(formatSemaforoCountdown(120), '02:00');
  assert.equal(formatSemaforoCountdown(300), '05:00');
  assert.equal(formatSemaforoCountdown(600), '10:00');
  assert.equal(formatSemaforoCountdown(900), '15:00');
  assert.equal(formatSemaforoCountdown(15), '00:15');
  assert.equal(formatSemaforoCountdown(0), '00:00');
  assert.equal(formatSemaforoCountdown(-5), '00:00');

  assert.equal(isCountdownUrgent(16), false);
  assert.equal(isCountdownUrgent(15), true);
  assert.equal(isCountdownUrgent(1), true);
  assert.equal(isCountdownUrgent(0), false);
});
