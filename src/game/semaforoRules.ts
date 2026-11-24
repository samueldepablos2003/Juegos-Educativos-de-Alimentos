import {
  SEMAFORO_FOODS,
  SemaforoFoodItem,
  TrafficLightColor,
} from '../data/semaforoFoods';

export const ITEMS_PER_LIGHT = 4;
export const GOAL_SEMAFORO_POINTS = 20;
export const TOTAL_SEMAFORO_ITEMS = SEMAFORO_FOODS.length;

export interface TrayCardState {
  item: SemaforoFoodItem;
  rotationDeg: number;
  offsetY: number;
}

export interface SemaforoRoundState {
  tray: TrayCardState[];
  lanes: Record<TrafficLightColor, SemaforoFoodItem[]>;
  totalItems: number;
  progressPoints: number;
  goalPoints: number;
}

export interface SemaforoDropEvaluation {
  accepted: boolean;
  message: string;
  targetLight: TrafficLightColor;
  progressDelta: -1 | 0 | 1;
  nextState: SemaforoRoundState;
}

const ORGANIC_ROTATIONS = [-7, 6, -5, 8, -8, 5, -6, 7, -4, 8, -7, 4];
const ORGANIC_OFFSETS = [-3, 4, -2, 3, -4, 2, -2, 4, -3, 3, -2, 2];

export function shuffleArray<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Loads the complete food database and shuffles it with Fisher-Yates
 * so every game or restart presents a fresh random sequence of all foods.
 */
export function dealSemaforoRound(
  pool: SemaforoFoodItem[] = SEMAFORO_FOODS,
  rng: () => number = Math.random,
  goalPoints: number = Math.min(GOAL_SEMAFORO_POINTS, pool.length)
): SemaforoRoundState {
  const shuffled = shuffleArray(pool, rng);

  return {
    tray: shuffled.map((item, idx) => ({
      item,
      rotationDeg: ORGANIC_ROTATIONS[idx % ORGANIC_ROTATIONS.length],
      offsetY: ORGANIC_OFFSETS[idx % ORGANIC_OFFSETS.length],
    })),
    lanes: {
      red: [],
      yellow: [],
      green: [],
    },
    totalItems: shuffled.length,
    progressPoints: 0,
    goalPoints: Math.max(1, goalPoints),
  };
}

export function countPlacedSemaforoItems(state: SemaforoRoundState): number {
  return state.lanes.red.length + state.lanes.yellow.length + state.lanes.green.length;
}

export function computeSemaforoProgress(state: SemaforoRoundState): number {
  if (state.goalPoints <= 0) return 0;
  if (state.tray.length === 0 && countPlacedSemaforoItems(state) > 0) return 100;
  const clamped = Math.max(0, Math.min(state.goalPoints, state.progressPoints));
  return Math.round((clamped / state.goalPoints) * 100);
}

export function isSemaforoComplete(state: SemaforoRoundState): boolean {
  if (state.totalItems <= 0) return false;
  return state.progressPoints >= state.goalPoints || state.tray.length === 0;
}

export function evaluateSemaforoDrop(
  state: SemaforoRoundState,
  itemId: string,
  targetLight: TrafficLightColor
): SemaforoDropEvaluation {
  const trayEntry = state.tray.find((entry) => entry.item.id === itemId);
  if (!trayEntry) {
    return {
      accepted: false,
      message: 'Ese alimento ya fue clasificado en el semáforo.',
      targetLight,
      progressDelta: 0,
      nextState: state,
    };
  }

  const { item } = trayEntry;
  if (item.light !== targetLight) {
    const nextPoints = Math.max(0, state.progressPoints - 1);
    return {
      accepted: false,
      message: item.hintIfWrong,
      targetLight,
      progressDelta: nextPoints < state.progressPoints ? -1 : 0,
      nextState: {
        ...state,
        progressPoints: nextPoints,
      },
    };
  }

  const nextPoints = Math.min(state.goalPoints, state.progressPoints + 1);
  return {
    accepted: true,
    message: item.successNote,
    targetLight,
    progressDelta: 1,
    nextState: {
      ...state,
      tray: state.tray.filter((entry) => entry.item.id !== itemId),
      lanes: {
        ...state.lanes,
        [targetLight]: [...state.lanes[targetLight], item],
      },
      progressPoints: nextPoints,
    },
  };
}

export type SemaforoGameMode = 'normal' | 'timed';

export const SEMAFORO_TIMED_DURATIONS_MIN = [2, 5, 10, 15] as const;
export type SemaforoTimedDurationMinutes = (typeof SEMAFORO_TIMED_DURATIONS_MIN)[number];

export const DEFAULT_TIMED_DURATION_MINUTES: SemaforoTimedDurationMinutes = 5;
export const URGENT_COUNTDOWN_THRESHOLD_SECONDS = 15;

export function formatSemaforoCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function isCountdownUrgent(secondsLeft: number): boolean {
  return secondsLeft > 0 && secondsLeft <= URGENT_COUNTDOWN_THRESHOLD_SECONDS;
}
