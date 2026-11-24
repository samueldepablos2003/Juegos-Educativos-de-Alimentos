// Offline Web Audio API sound effects facade for "Cartas del Superpoder" & "Cuestionario Relámpago"
// Delegates sound synthesis to the centralized soundSystem so global mute & volume apply everywhere.

import {
  playCardFlipHarmonic,
  playCardSelectHarmonic,
  playCardShuffleHarmonic,
  playLightningBellHarmonic,
  playQuizCorrectRevealSound,
} from './soundSystem';

export function playCardShuffleSound(enabled: boolean): void {
  playCardShuffleHarmonic(enabled);
}

export function playCardSelectSound(enabled: boolean): void {
  playCardSelectHarmonic(enabled);
}

export function playCardFlipMagicSound(enabled: boolean): void {
  playCardFlipHarmonic(enabled);
}

export function playLightningBellSound(enabled: boolean): void {
  playLightningBellHarmonic(enabled);
}

export function playAnswerRevealSound(enabled: boolean): void {
  playQuizCorrectRevealSound(enabled);
}
