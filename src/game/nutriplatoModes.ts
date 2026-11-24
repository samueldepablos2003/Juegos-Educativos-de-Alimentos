export type NutriPlatoPlayMode = 'educational' | 'timed';

export const NUTRIPLATO_TIMED_DURATIONS_MIN = [1, 2, 3, 5] as const;
export type NutriPlatoTimedDurationMinutes =
  (typeof NUTRIPLATO_TIMED_DURATIONS_MIN)[number];

export const NUTRIPLATO_TIMED_GAIN_PERCENT = 20;
export const NUTRIPLATO_TIMED_PENALTY_PERCENT = 15;
export const NUTRIPLATO_TIMED_REMOVE_PERCENT = 20;
export const NUTRIPLATO_URGENT_THRESHOLD_SECONDS = 15;

export interface NutriPlatoTimedDeltaResult {
  nextProgress: number;
  delta: number;
  isComplete: boolean;
}

/**
 * Pure rise-and-fall progress calculation for NutriPlato Contrarreloj mode.
 * - Correct placement raises progress by +20% (clamped at 100%).
 * - Incorrect placement (wrong sector or ultraprocessed distractor) drops progress by -15% (clamped at 0%).
 */
export function applyTimedPlacementDelta(
  currentProgress: number,
  accepted: boolean
): NutriPlatoTimedDeltaResult {
  const safeCurrent = Math.min(100, Math.max(0, Math.round(currentProgress)));

  if (accepted) {
    const nextProgress = Math.min(100, safeCurrent + NUTRIPLATO_TIMED_GAIN_PERCENT);
    return {
      nextProgress,
      delta: nextProgress - safeCurrent,
      isComplete: nextProgress >= 100,
    };
  }

  const nextProgress = Math.max(0, safeCurrent - NUTRIPLATO_TIMED_PENALTY_PERCENT);
  return {
    nextProgress,
    delta: nextProgress - safeCurrent,
    isComplete: false,
  };
}

/**
 * Deducts progress when a player removes a food from the plate during Contrarreloj
 * so progress cannot be farmed by repeatedly removing and re-adding the same item.
 */
export function applyTimedRemovalDelta(currentProgress: number): number {
  const safeCurrent = Math.min(100, Math.max(0, Math.round(currentProgress)));
  return Math.max(0, safeCurrent - NUTRIPLATO_TIMED_REMOVE_PERCENT);
}

/**
 * Formats remaining seconds as MM:SS for the Contrarreloj countdown HUD.
 */
export function formatNutriPlatoTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Returns true during the final 15 seconds (1..15) to activate urgent visual & audio feedback.
 */
export function isNutriPlatoTimeUrgent(totalSeconds: number): boolean {
  return (
    totalSeconds > 0 && totalSeconds <= NUTRIPLATO_URGENT_THRESHOLD_SECONDS
  );
}
