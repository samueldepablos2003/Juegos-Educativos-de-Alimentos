// Harmonious Web Audio API sound effects facade for NutriPlato & El Semáforo
// Delegates to the centralized soundSystem so global mute & educational timbres apply everywhere.

import {
  playGentleHintHarmonic,
  playPlaceFoodHarmonic,
  playTimerTickHarmonic,
  playTimeUpCadenceSound,
  playVictoryFanfareSound,
} from './soundSystem';

export function playPlaceFoodSound(enabled: boolean): void {
  playPlaceFoodHarmonic(enabled);
}

export function playPlateCompleteSound(enabled: boolean): void {
  playVictoryFanfareSound(enabled);
}

export function playGentleHintSound(enabled: boolean): void {
  playGentleHintHarmonic(enabled);
}

export function playTimeUpSound(enabled: boolean): void {
  playTimeUpCadenceSound(enabled);
}

export function playTimerTickSound(enabled: boolean, urgent = false): void {
  playTimerTickHarmonic(enabled, urgent);
}
