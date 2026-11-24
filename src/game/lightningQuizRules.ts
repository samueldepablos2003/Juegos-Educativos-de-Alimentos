import {
  LightningQuizQuestion,
  QuizDifficultyFilter,
} from '../data/lightningQuizQuestions';

export type LightningPlayFormat = 'individual' | 'teams';
export type LightningTimeMode = 'normal' | 'contrarreloj';
export type TeamId = 'team1' | 'team2';

export const LIGHTNING_QUESTION_COUNTS = [5, 10, 15, 20] as const;
export type LightningQuestionCount = (typeof LIGHTNING_QUESTION_COUNTS)[number];

export const LIGHTNING_TIMED_DURATIONS_MIN = [1, 2, 3, 5] as const;
export type LightningTimedDurationMinutes =
  (typeof LIGHTNING_TIMED_DURATIONS_MIN)[number];

export const DEFAULT_LIGHTNING_CONFIG: LightningQuizConfig = {
  playFormat: 'individual',
  timeMode: 'normal',
  difficulty: 'mixto',
  questionCount: 10,
  timedDurationMinutes: 2,
};

export interface LightningQuizConfig {
  playFormat: LightningPlayFormat;
  timeMode: LightningTimeMode;
  difficulty: QuizDifficultyFilter;
  questionCount: LightningQuestionCount;
  timedDurationMinutes: LightningTimedDurationMinutes;
}

/**
 * Standard Fisher-Yates shuffle returning a new array without mutating input.
 */
export function fisherYatesShuffle<T>(
  items: readonly T[],
  rng: () => number = Math.random
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles the 3 options of a question while updating `correctIndex` accurately
 * so players cannot memorize option positions across replays.
 */
export function shuffleQuestionOptions(
  q: LightningQuizQuestion,
  rng: () => number = Math.random
): LightningQuizQuestion {
  const indexed = q.options.map((text, idx) => ({
    text,
    isCorrect: idx === q.correctIndex,
  }));
  const shuffled = fisherYatesShuffle(indexed, rng);
  const nextCorrectIndex = shuffled.findIndex((item) => item.isCorrect) as 0 | 1 | 2;
  return {
    ...q,
    options: [shuffled[0].text, shuffled[1].text, shuffled[2].text],
    correctIndex: nextCorrectIndex,
  };
}

/**
 * Deals `count` unique questions matching `difficulty` via Fisher-Yates shuffle.
 * If a specific difficulty pool ever has fewer than `count` items, tops up
 * with unique questions from the remaining catalog.
 */
export function dealQuizQuestions(
  bank: readonly LightningQuizQuestion[],
  difficulty: QuizDifficultyFilter,
  count: number,
  rng: () => number = Math.random
): LightningQuizQuestion[] {
  const targetCount = Math.max(1, Math.min(count, bank.length));

  const primaryPool =
    difficulty === 'mixto'
      ? bank
      : bank.filter((q) => q.difficulty === difficulty);

  const primaryShuffled = fisherYatesShuffle(primaryPool, rng);
  let chosen = primaryShuffled.slice(0, targetCount);

  if (chosen.length < targetCount) {
    const chosenIds = new Set(chosen.map((q) => q.id));
    const fallbackPool = fisherYatesShuffle(
      bank.filter((q) => !chosenIds.has(q.id)),
      rng
    );
    chosen = [...chosen, ...fallbackPool.slice(0, targetCount - chosen.length)];
  }

  return chosen.map((q) => shuffleQuestionOptions(q, rng));
}

export function formatQuizCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function isQuizCountdownUrgent(remainingSeconds: number): boolean {
  return remainingSeconds > 0 && remainingSeconds <= 15;
}

// =========================================================================
// INDIVIDUAL MODE ENGINE (Normal & Contrarreloj)
// =========================================================================

export type IndividualQuizStatus = 'playing' | 'won' | 'lost_time';

export interface IndividualQuizState {
  config: LightningQuizConfig;
  questions: LightningQuizQuestion[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  /** Option indices already attempted incorrectly on the current question */
  wrongOptionIndicesOnCurrent: number[];
  /** True while showing the 3D food celebration overlay for the current question */
  showingCorrectReveal: boolean;
  status: IndividualQuizStatus;
}

export interface IndividualAnswerResult {
  isCorrect: boolean;
  ignored: boolean;
  nextState: IndividualQuizState;
}

export function createIndividualQuizSession(
  bank: readonly LightningQuizQuestion[],
  config: LightningQuizConfig,
  rng: () => number = Math.random
): IndividualQuizState {
  const questions = dealQuizQuestions(
    bank,
    config.difficulty,
    config.questionCount,
    rng
  );

  return {
    config: { ...config, playFormat: 'individual' },
    questions,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    wrongOptionIndicesOnCurrent: [],
    showingCorrectReveal: false,
    status: 'playing',
  };
}

export function submitIndividualAnswer(
  state: IndividualQuizState,
  optionIndex: number
): IndividualAnswerResult {
  if (state.status !== 'playing' || state.showingCorrectReveal) {
    return { isCorrect: false, ignored: true, nextState: state };
  }

  const currentQuestion = state.questions[state.currentIndex];
  if (!currentQuestion) {
    return { isCorrect: false, ignored: true, nextState: state };
  }

  if (state.wrongOptionIndicesOnCurrent.includes(optionIndex)) {
    return { isCorrect: false, ignored: true, nextState: state };
  }

  if (optionIndex === currentQuestion.correctIndex) {
    const nextCorrectCount = state.correctCount + 1;
    return {
      isCorrect: true,
      ignored: false,
      nextState: {
        ...state,
        correctCount: nextCorrectCount,
        showingCorrectReveal: true,
      },
    };
  }

  return {
    isCorrect: false,
    ignored: false,
    nextState: {
      ...state,
      wrongCount: state.wrongCount + 1,
      wrongOptionIndicesOnCurrent: [
        ...state.wrongOptionIndicesOnCurrent,
        optionIndex,
      ],
    },
  };
}

export function advanceIndividualQuestion(
  state: IndividualQuizState
): IndividualQuizState {
  if (state.status !== 'playing' || !state.showingCorrectReveal) {
    return state;
  }

  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.questions.length || state.correctCount >= state.questions.length) {
    return {
      ...state,
      showingCorrectReveal: false,
      status: 'won',
    };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    wrongOptionIndicesOnCurrent: [],
    showingCorrectReveal: false,
  };
}

export function markIndividualTimeExpired(
  state: IndividualQuizState
): IndividualQuizState {
  if (state.status !== 'playing') return state;
  return {
    ...state,
    showingCorrectReveal: false,
    status: 'lost_time',
  };
}

export function computeIndividualProgress(state: IndividualQuizState): number {
  const total = state.questions.length;
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((state.correctCount / total) * 100)));
}

// =========================================================================
// COMPETITIVE TEAMS MODE ENGINE (Equipo 1 vs Equipo 2 — Alternating Turns)
// =========================================================================

export type TeamWinner = 'team1' | 'team2' | 'tie';
export type TeamTurnPhase = 'answering' | 'feedback' | 'finished' | 'lost_time';

export interface TeamSlotState {
  teamId: TeamId;
  name: string;
  questions: LightningQuizQuestion[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  lastOutcome: 'correct' | 'wrong' | null;
  lastSelectedOptionIndex: number | null;
  completed: boolean;
}

export interface TeamQuizState {
  config: LightningQuizConfig;
  teams: Record<TeamId, TeamSlotState>;
  activeTeam: TeamId;
  phase: TeamTurnPhase;
  winner: TeamWinner | null;
}

export interface TeamAnswerResult {
  isCorrect: boolean;
  ignored: boolean;
  actingTeam: TeamId;
  nextState: TeamQuizState;
}

/**
 * Deals two non-overlapping question queues (one for Equipo 1, one for Equipo 2)
 * so both teams face independent, fair questions of the selected difficulty.
 */
export function createTeamQuizSession(
  bank: readonly LightningQuizQuestion[],
  config: LightningQuizConfig,
  rng: () => number = Math.random
): TeamQuizState {
  const perTeamCount = config.questionCount;
  const combined = dealQuizQuestions(
    bank,
    config.difficulty,
    perTeamCount * 2,
    rng
  );

  const half = Math.floor(combined.length / 2);
  const team1Questions = combined.slice(0, half);
  const team2Questions = combined.slice(half, half * 2);

  return {
    config: { ...config, playFormat: 'teams' },
    teams: {
      team1: {
        teamId: 'team1',
        name: 'Equipo 1',
        questions: team1Questions,
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        lastOutcome: null,
        lastSelectedOptionIndex: null,
        completed: team1Questions.length === 0,
      },
      team2: {
        teamId: 'team2',
        name: 'Equipo 2',
        questions: team2Questions,
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        lastOutcome: null,
        lastSelectedOptionIndex: null,
        completed: team2Questions.length === 0,
      },
    },
    activeTeam: 'team1',
    phase: 'answering',
    winner: null,
  };
}

export function computeTeamProgress(slot: TeamSlotState): number {
  const total = slot.questions.length;
  if (total <= 0) return 0;
  const answered = slot.correctCount + slot.wrongCount;
  return Math.min(100, Math.max(0, Math.round((answered / total) * 100)));
}

export function computeTeamAccuracyProgress(slot: TeamSlotState): number {
  const total = slot.questions.length;
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((slot.correctCount / total) * 100)));
}

export function getTeamRemainingQuestions(slot: TeamSlotState): number {
  return Math.max(
    0,
    slot.questions.length - (slot.correctCount + slot.wrongCount)
  );
}

/**
 * Returns true when either team has accumulated a mathematically unbeatable
 * score (strictly more correct answers than the opposing team could possibly
 * achieve even by answering every remaining question correctly).
 */
export function hasDefinitiveTeamWinner(
  team1: TeamSlotState,
  team2: TeamSlotState
): boolean {
  const team1Remaining = getTeamRemainingQuestions(team1);
  const team2Remaining = getTeamRemainingQuestions(team2);

  if (team1.correctCount > team2.correctCount + team2Remaining) return true;
  if (team2.correctCount > team1.correctCount + team1Remaining) return true;
  return false;
}

export function determineTeamWinner(
  team1: TeamSlotState,
  team2: TeamSlotState
): TeamWinner {
  if (team1.correctCount > team2.correctCount) return 'team1';
  if (team2.correctCount > team1.correctCount) return 'team2';
  if (team1.wrongCount < team2.wrongCount) return 'team1';
  if (team2.wrongCount < team1.wrongCount) return 'team2';
  return 'tie';
}

/**
 * Registers an answer for the currently active team.
 * - Correct: increments that team's `correctCount` and enters `'feedback'` phase.
 * - Wrong: increments that team's `wrongCount` and enters `'feedback'` phase.
 * In both cases, `advanceTeamTurn` moves that team to its next question and
 * hands the turn over to the opposing team.
 */
export function submitTeamAnswer(
  state: TeamQuizState,
  teamId: TeamId,
  optionIndex: number
): TeamAnswerResult {
  if (state.phase !== 'answering' || teamId !== state.activeTeam) {
    return {
      isCorrect: false,
      ignored: true,
      actingTeam: state.activeTeam,
      nextState: state,
    };
  }

  const slot = state.teams[teamId];
  const currentQuestion = slot.questions[slot.currentIndex];
  if (!currentQuestion || slot.completed) {
    return {
      isCorrect: false,
      ignored: true,
      actingTeam: teamId,
      nextState: state,
    };
  }

  const isCorrect = optionIndex === currentQuestion.correctIndex;
  const updatedSlot: TeamSlotState = {
    ...slot,
    correctCount: isCorrect ? slot.correctCount + 1 : slot.correctCount,
    wrongCount: isCorrect ? slot.wrongCount : slot.wrongCount + 1,
    lastOutcome: isCorrect ? 'correct' : 'wrong',
    lastSelectedOptionIndex: optionIndex,
  };

  return {
    isCorrect,
    ignored: false,
    actingTeam: teamId,
    nextState: {
      ...state,
      teams: {
        ...state.teams,
        [teamId]: updatedSlot,
      },
      phase: 'feedback',
    },
  };
}

/**
 * Advances the active team's question index and alternates turn to the other team.
 * Immediately transitions to `'finished'` and computes the winner once both teams
 * exhaust all programmed questions OR either team reaches an unbeatable definitive score.
 */
export function advanceTeamTurn(state: TeamQuizState): TeamQuizState {
  if (state.phase !== 'feedback') return state;

  const actingId = state.activeTeam;
  const otherId: TeamId = actingId === 'team1' ? 'team2' : 'team1';
  const actingSlot = state.teams[actingId];

  const nextIdx = actingSlot.currentIndex + 1;
  const actingCompleted = nextIdx >= actingSlot.questions.length;

  const nextActingSlot: TeamSlotState = {
    ...actingSlot,
    currentIndex: actingCompleted ? actingSlot.questions.length : nextIdx,
    lastOutcome: null,
    lastSelectedOptionIndex: null,
    completed: actingCompleted,
  };

  const nextTeams: Record<TeamId, TeamSlotState> = {
    ...state.teams,
    [actingId]: nextActingSlot,
  };

  const bothDone = nextTeams.team1.completed && nextTeams.team2.completed;
  if (bothDone || hasDefinitiveTeamWinner(nextTeams.team1, nextTeams.team2)) {
    return {
      ...state,
      teams: nextTeams,
      phase: 'finished',
      winner: determineTeamWinner(nextTeams.team1, nextTeams.team2),
    };
  }

  const nextActive: TeamId = nextTeams[otherId].completed ? actingId : otherId;
  return {
    ...state,
    teams: nextTeams,
    activeTeam: nextActive,
    phase: 'answering',
  };
}

/**
 * Returns true if calling `advanceTeamTurn(state)` will immediately finish the match
 * (either because all questions are completed or because a team reached a definitive lead).
 */
export function willAdvanceFinishTeamMatch(state: TeamQuizState): boolean {
  if (state.phase !== 'feedback') return false;
  return advanceTeamTurn(state).phase === 'finished';
}

/**
 * Handles per-turn timer expiration in Teams Contrarreloj mode:
 * records a missed/timed-out question for the active team, advances its index,
 * and hands the turn to the opposing team (so the UI resets the countdown for them),
 * or immediately finishes the match if all questions are exhausted or a definitive
 * winner is established.
 */
export function expireActiveTeamTurn(state: TeamQuizState): TeamQuizState {
  if (state.phase !== 'answering') return state;

  const actingId = state.activeTeam;
  const otherId: TeamId = actingId === 'team1' ? 'team2' : 'team1';
  const actingSlot = state.teams[actingId];

  if (actingSlot.completed) return state;

  const nextIdx = actingSlot.currentIndex + 1;
  const actingCompleted = nextIdx >= actingSlot.questions.length;

  const nextActingSlot: TeamSlotState = {
    ...actingSlot,
    wrongCount: actingSlot.wrongCount + 1,
    currentIndex: actingCompleted ? actingSlot.questions.length : nextIdx,
    lastOutcome: null,
    lastSelectedOptionIndex: null,
    completed: actingCompleted,
  };

  const nextTeams: Record<TeamId, TeamSlotState> = {
    ...state.teams,
    [actingId]: nextActingSlot,
  };

  const bothDone = nextTeams.team1.completed && nextTeams.team2.completed;
  if (bothDone || hasDefinitiveTeamWinner(nextTeams.team1, nextTeams.team2)) {
    return {
      ...state,
      teams: nextTeams,
      phase: 'finished',
      winner: determineTeamWinner(nextTeams.team1, nextTeams.team2),
    };
  }

  const nextActive: TeamId = nextTeams[otherId].completed ? actingId : otherId;
  return {
    ...state,
    teams: nextTeams,
    activeTeam: nextActive,
    phase: 'answering',
  };
}

export function markTeamTimeExpired(state: TeamQuizState): TeamQuizState {
  if (state.phase === 'finished' || state.phase === 'lost_time') return state;
  return {
    ...state,
    phase: 'lost_time',
    winner: determineTeamWinner(state.teams.team1, state.teams.team2),
  };
}
