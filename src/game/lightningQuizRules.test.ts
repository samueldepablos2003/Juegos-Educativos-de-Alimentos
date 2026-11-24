import test from 'node:test';
import assert from 'node:assert/strict';
import { FOODS } from '../data/foods';
import { LIGHTNING_QUIZ_QUESTIONS } from '../data/lightningQuizQuestions';
import {
  advanceIndividualQuestion,
  advanceTeamTurn,
  computeIndividualProgress,
  computeTeamAccuracyProgress,
  computeTeamProgress,
  createIndividualQuizSession,
  createTeamQuizSession,
  dealQuizQuestions,
  DEFAULT_LIGHTNING_CONFIG,
  expireActiveTeamTurn,
  formatQuizCountdown,
  hasDefinitiveTeamWinner,
  isQuizCountdownUrgent,
  LIGHTNING_QUESTION_COUNTS,
  LIGHTNING_TIMED_DURATIONS_MIN,
  markIndividualTimeExpired,
  markTeamTimeExpired,
  submitIndividualAnswer,
  submitTeamAnswer,
  willAdvanceFinishTeamMatch,
} from './lightningQuizRules';

test('LIGHTNING_QUIZ_QUESTIONS has at least 100 valid unique questions covering all 46 app foods and balanced difficulties', () => {
  assert.ok(
    LIGHTNING_QUIZ_QUESTIONS.length >= 100,
    `Expected >= 100 questions, got ${LIGHTNING_QUIZ_QUESTIONS.length}`
  );

  const ids = new Set<string>();
  const validFoodIds = new Set(FOODS.map((f) => f.id));
  const coveredFoods = new Set<string>();

  for (const q of LIGHTNING_QUIZ_QUESTIONS) {
    assert.equal(ids.has(q.id), false, `Duplicate question id: ${q.id}`);
    ids.add(q.id);

    assert.ok(q.question.trim().length >= 12, `Question too short: ${q.id}`);
    assert.equal(q.options.length, 3, `Expected 3 options for ${q.id}`);
    assert.equal(
      new Set(q.options.map((o) => o.trim().toLowerCase())).size,
      3,
      `Duplicate options in ${q.id}`
    );
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 2);
    assert.ok(
      validFoodIds.has(q.foodId),
      `Unknown foodId "${q.foodId}" in ${q.id}`
    );
    assert.ok(q.foodName.trim().length > 0);
    assert.ok(q.explanation.trim().length > 10);
    coveredFoods.add(q.foodId);
  }

  for (const appFood of FOODS) {
    assert.ok(
      coveredFoods.has(appFood.id),
      `App food "${appFood.id}" is not covered by any question in LIGHTNING_QUIZ_QUESTIONS`
    );
  }

  const facil = LIGHTNING_QUIZ_QUESTIONS.filter((q) => q.difficulty === 'facil');
  const medio = LIGHTNING_QUIZ_QUESTIONS.filter((q) => q.difficulty === 'medio');
  const dificil = LIGHTNING_QUIZ_QUESTIONS.filter((q) => q.difficulty === 'dificil');

  assert.ok(facil.length >= 40, `Expected >= 40 facil questions, got ${facil.length}`);
  assert.ok(medio.length >= 40, `Expected >= 40 medio questions, got ${medio.length}`);
  assert.ok(dificil.length >= 40, `Expected >= 40 dificil questions, got ${dificil.length}`);
});

test('dealQuizQuestions deals unique questions filtered by difficulty with valid shuffled options', () => {
  for (const difficulty of ['facil', 'medio', 'dificil', 'mixto'] as const) {
    for (const count of LIGHTNING_QUESTION_COUNTS) {
      const dealt = dealQuizQuestions(LIGHTNING_QUIZ_QUESTIONS, difficulty, count);
      assert.equal(dealt.length, count);
      assert.equal(new Set(dealt.map((q) => q.id)).size, count);

      if (difficulty !== 'mixto') {
        assert.equal(
          dealt.every((q) => q.difficulty === difficulty),
          true
        );
      }

      for (const q of dealt) {
        const original = LIGHTNING_QUIZ_QUESTIONS.find((o) => o.id === q.id)!;
        assert.equal(
          q.options[q.correctIndex],
          original.options[original.correctIndex]
        );
      }
    }
  }
});

test('Individual mode tracks wrong attempts, advances progress on right answers, and reaches 100% victory', () => {
  let session = createIndividualQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'individual',
    timeMode: 'normal',
    difficulty: 'facil',
    questionCount: 5,
  });

  assert.equal(session.questions.length, 5);
  assert.equal(computeIndividualProgress(session), 0);
  assert.equal(session.status, 'playing');

  // Wrong answer on question 1 marks option wrong, increments wrongCount, does not advance progress
  const q0 = session.questions[0];
  const wrongIdx = (q0.correctIndex + 1) % 3;
  const resWrong = submitIndividualAnswer(session, wrongIdx);
  assert.equal(resWrong.isCorrect, false);
  assert.equal(resWrong.ignored, false);
  assert.equal(resWrong.nextState.wrongCount, 1);
  assert.equal(resWrong.nextState.showingCorrectReveal, false);
  assert.deepEqual(resWrong.nextState.wrongOptionIndicesOnCurrent, [wrongIdx]);
  assert.equal(computeIndividualProgress(resWrong.nextState), 0);

  // Clicking the same wrong option again is ignored
  const resDupWrong = submitIndividualAnswer(resWrong.nextState, wrongIdx);
  assert.equal(resDupWrong.ignored, true);
  assert.equal(resDupWrong.nextState.wrongCount, 1);

  session = resWrong.nextState;

  // Answer all 5 questions correctly and advance through 3D reveal overlays
  for (let i = 0; i < 5; i += 1) {
    const q = session.questions[session.currentIndex];
    const ok = submitIndividualAnswer(session, q.correctIndex);
    assert.equal(ok.isCorrect, true);
    assert.equal(ok.nextState.showingCorrectReveal, true);
    assert.equal(computeIndividualProgress(ok.nextState), Math.round(((i + 1) / 5) * 100));
    session = advanceIndividualQuestion(ok.nextState);
  }

  assert.equal(session.status, 'won');
  assert.equal(session.correctCount, 5);
  assert.equal(session.wrongCount, 1);
  assert.equal(computeIndividualProgress(session), 100);
});

test('Contrarreloj expiration marks Individual quiz as lost_time and formats countdown accurately', () => {
  assert.deepEqual([...LIGHTNING_TIMED_DURATIONS_MIN], [1, 2, 3, 5]);
  assert.equal(formatQuizCountdown(120), '02:00');
  assert.equal(formatQuizCountdown(15), '00:15');
  assert.equal(formatQuizCountdown(0), '00:00');
  assert.equal(isQuizCountdownUrgent(16), false);
  assert.equal(isQuizCountdownUrgent(15), true);
  assert.equal(isQuizCountdownUrgent(0), false);

  const session = createIndividualQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'individual',
    timeMode: 'contrarreloj',
    timedDurationMinutes: 2,
    questionCount: 10,
  });

  const expired = markIndividualTimeExpired(session);
  assert.equal(expired.status, 'lost_time');
});

test('Teams mode deals non-overlapping queues, alternates turns on both correct and wrong answers, and declares winner', () => {
  let state = createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'teams',
    timeMode: 'normal',
    difficulty: 'dificil',
    questionCount: 20,
  });

  // Verify 20 + 20 = 40 completely unique questions across both teams
  const ids1 = new Set(state.teams.team1.questions.map((q) => q.id));
  const ids2 = new Set(state.teams.team2.questions.map((q) => q.id));
  assert.equal(ids1.size, 20);
  assert.equal(ids2.size, 20);
  for (const id of ids1) {
    assert.equal(ids2.has(id), false, `Overlap found between team1 and team2: ${id}`);
  }

  // Play a full 5-question per team competitive match
  state = createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'teams',
    timeMode: 'normal',
    difficulty: 'medio',
    questionCount: 5,
  });

  assert.equal(state.activeTeam, 'team1');
  assert.equal(state.phase, 'answering');

  // Team 2 cannot answer during Team 1's turn
  const outOfTurn = submitTeamAnswer(state, 'team2', 0);
  assert.equal(outOfTurn.ignored, true);

  // Simulate 5 close rounds: Team 1 gets 4 right + 1 wrong; Team 2 gets 3 right + 2 wrong
  // After Round 4 both are tied 3-3, so Round 5 decides the winner on the final turn
  const team1Outcomes = [true, true, false, true, true];
  const team2Outcomes = [true, false, true, true, false];

  for (let round = 0; round < 5; round += 1) {
    // Team 1 turn
    assert.equal(state.activeTeam, 'team1');
    const q1 = state.teams.team1.questions[state.teams.team1.currentIndex];
    const opt1 = team1Outcomes[round] ? q1.correctIndex : (q1.correctIndex + 1) % 3;
    const res1 = submitTeamAnswer(state, 'team1', opt1);
    assert.equal(res1.ignored, false);
    assert.equal(res1.isCorrect, team1Outcomes[round]);
    assert.equal(res1.nextState.phase, 'feedback');
    state = advanceTeamTurn(res1.nextState);

    // Turn must immediately switch to Team 2 even after a wrong answer
    assert.equal(state.activeTeam, 'team2');
    const q2 = state.teams.team2.questions[state.teams.team2.currentIndex];
    const opt2 = team2Outcomes[round] ? q2.correctIndex : (q2.correctIndex + 1) % 3;
    const res2 = submitTeamAnswer(state, 'team2', opt2);
    assert.equal(res2.ignored, false);
    assert.equal(res2.isCorrect, team2Outcomes[round]);
    if (round === 4) {
      assert.equal(willAdvanceFinishTeamMatch(res2.nextState), true);
    }
    state = advanceTeamTurn(res2.nextState);
  }

  assert.equal(state.phase, 'finished');
  assert.equal(state.teams.team1.correctCount, 4);
  assert.equal(state.teams.team1.wrongCount, 1);
  assert.equal(state.teams.team2.correctCount, 3);
  assert.equal(state.teams.team2.wrongCount, 2);
  assert.equal(computeTeamProgress(state.teams.team1), 100);
  assert.equal(computeTeamAccuracyProgress(state.teams.team1), 80);
  assert.equal(computeTeamAccuracyProgress(state.teams.team2), 60);
  assert.equal(state.winner, 'team1');

  // Verify legacy timer expiration helper still computes winner cleanly
  const timedTeams = createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'teams',
    timeMode: 'contrarreloj',
    questionCount: 5,
  });
  const expiredTeams = markTeamTimeExpired(timedTeams);
  assert.equal(expiredTeams.phase, 'lost_time');
  assert.equal(expiredTeams.winner, 'tie');
});

test('Teams mode finishes immediately on mathematically definitive score and handles ties cleanly', () => {
  // 5 questions per team: Team 1 goes 3-0 while Team 2 goes 0-3 -> Team 2 has only 2 left (max 2 < 3)
  let state = createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'teams',
    timeMode: 'contrarreloj',
    difficulty: 'facil',
    questionCount: 5,
  });

  for (let round = 0; round < 3; round += 1) {
    const q1 = state.teams.team1.questions[state.teams.team1.currentIndex];
    const r1 = submitTeamAnswer(state, 'team1', q1.correctIndex);
    state = advanceTeamTurn(r1.nextState);
    assert.equal(state.phase, 'answering');
    assert.equal(state.activeTeam, 'team2');

    const q2 = state.teams.team2.questions[state.teams.team2.currentIndex];
    const r2 = submitTeamAnswer(state, 'team2', (q2.correctIndex + 1) % 3);
    if (round === 2) {
      assert.equal(willAdvanceFinishTeamMatch(r2.nextState), true);
    }
    state = advanceTeamTurn(r2.nextState);
  }

  assert.equal(hasDefinitiveTeamWinner(state.teams.team1, state.teams.team2), true);
  assert.equal(state.phase, 'finished');
  assert.equal(state.winner, 'team1');

  // Exact tie across all 5 questions per team -> winner is 'tie'
  let tieState = createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'teams',
    timeMode: 'normal',
    difficulty: 'facil',
    questionCount: 5,
  });

  for (let round = 0; round < 5; round += 1) {
    const q1 = tieState.teams.team1.questions[tieState.teams.team1.currentIndex];
    tieState = advanceTeamTurn(
      submitTeamAnswer(tieState, 'team1', q1.correctIndex).nextState
    );
    const q2 = tieState.teams.team2.questions[tieState.teams.team2.currentIndex];
    tieState = advanceTeamTurn(
      submitTeamAnswer(tieState, 'team2', q2.correctIndex).nextState
    );
  }

  assert.equal(tieState.phase, 'finished');
  assert.equal(tieState.winner, 'tie');
});

test('Teams Contrarreloj per-turn expiration penalizes active team, hands turn to opponent, and ends match when decisive', () => {
  let state = createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, {
    ...DEFAULT_LIGHTNING_CONFIG,
    playFormat: 'teams',
    timeMode: 'contrarreloj',
    difficulty: 'facil',
    questionCount: 5,
  });

  // Turn 1: Team 1 runs out of time -> +1 wrong, advances to Team 2 with phase 'answering'
  state = expireActiveTeamTurn(state);
  assert.equal(state.phase, 'answering');
  assert.equal(state.activeTeam, 'team2');
  assert.equal(state.teams.team1.wrongCount, 1);
  assert.equal(state.teams.team1.currentIndex, 1);

  // Turn 2: Team 2 answers correctly -> advances back to Team 1
  const q2a = state.teams.team2.questions[state.teams.team2.currentIndex];
  state = advanceTeamTurn(submitTeamAnswer(state, 'team2', q2a.correctIndex).nextState);
  assert.equal(state.phase, 'answering');
  assert.equal(state.activeTeam, 'team1');
  assert.equal(state.teams.team2.correctCount, 1);

  // Rounds 2 & 3: Team 1 times out twice more while Team 2 answers right twice -> 0-3 vs 3-0 (definitive win!)
  state = expireActiveTeamTurn(state);
  assert.equal(state.activeTeam, 'team2');
  const q2b = state.teams.team2.questions[state.teams.team2.currentIndex];
  state = advanceTeamTurn(submitTeamAnswer(state, 'team2', q2b.correctIndex).nextState);

  state = expireActiveTeamTurn(state);
  assert.equal(state.activeTeam, 'team2');
  const q2c = state.teams.team2.questions[state.teams.team2.currentIndex];
  state = advanceTeamTurn(submitTeamAnswer(state, 'team2', q2c.correctIndex).nextState);

  assert.equal(state.phase, 'finished');
  assert.equal(state.winner, 'team2');
});
