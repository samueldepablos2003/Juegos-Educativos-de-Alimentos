import { useSyncExternalStore } from 'react';

export const SOUND_MUTE_STORAGE_KEY = 'nutriplato_music_muted_v2';
export const SOUND_VOLUME_STORAGE_KEY = 'nutriplato_music_volume_v2';
export const SOUND_BGM_ENABLED_STORAGE_KEY = 'nutriplato_bgm_enabled_v2';

export const DEFAULT_MASTER_VOLUME = 0.7;
const BGM_RELATIVE_GAIN = 0.48;

export type BgmTheme = 'cheerful' | 'suspense';

type SoundListener = () => void;

const listeners = new Set<SoundListener>();
let initializedFromStorage = false;
let soundEnabledState = true;
let masterVolumeState = DEFAULT_MASTER_VOLUME;
let lastNonZeroVolumeState = DEFAULT_MASTER_VOLUME;
let bgmEnabledState = true;
let bgmThemeState: BgmTheme = 'cheerful';

let sharedAudioCtx: AudioContext | null = null;
let sfxGainNode: GainNode | null = null;
let bgmGainNode: GainNode | null = null;

// ================= STORAGE & REACTIVE PREFERENCE STORE =================

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_MASTER_VOLUME;
  return Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
}

/**
 * Perceptual audio taper calibrated so every step from 10% to 100% is clearly
 * audible on laptop, desktop, and classroom TV speakers while staying warm and clean.
 */
export function computePerceptualMasterGain(
  volume: number,
  enabled: boolean
): number {
  if (!enabled || volume <= 0) return 0;
  const clamped = clampVolume(volume);
  return Math.pow(clamped, 1.35) * 2.4;
}

function readMutedFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SOUND_MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeMutedToStorage(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_MUTE_STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function readVolumeFromStorage(): number {
  if (typeof window === 'undefined') return DEFAULT_MASTER_VOLUME;
  try {
    const raw = window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY);
    if (raw === null) return DEFAULT_MASTER_VOLUME;
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return DEFAULT_MASTER_VOLUME;
    return clampVolume(parsed);
  } catch {
    return DEFAULT_MASTER_VOLUME;
  }
}

function writeVolumeToStorage(volume: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      SOUND_VOLUME_STORAGE_KEY,
      String(clampVolume(volume))
    );
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function readBgmEnabledFromStorage(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(SOUND_BGM_ENABLED_STORAGE_KEY);
    if (raw === null) return true;
    return raw !== 'false';
  } catch {
    return true;
  }
}

function writeBgmEnabledToStorage(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      SOUND_BGM_ENABLED_STORAGE_KEY,
      enabled ? 'true' : 'false'
    );
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function ensureInitialized(): void {
  if (initializedFromStorage) return;
  initializedFromStorage = true;
  const muted = readMutedFromStorage();
  const storedVol = readVolumeFromStorage();
  bgmEnabledState = readBgmEnabledFromStorage();

  if (storedVol > 0) {
    lastNonZeroVolumeState = storedVol;
  }
  masterVolumeState = storedVol;
  soundEnabledState = !muted && storedVol > 0;
}

function emitSoundChange(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Isolate listener errors
    }
  });
}

function computeEffectiveBgmGain(): number {
  if (!soundEnabledState || !bgmEnabledState || masterVolumeState <= 0) {
    return 0;
  }
  return computePerceptualMasterGain(masterVolumeState, true) * BGM_RELATIVE_GAIN;
}

function computeEffectiveSfxGain(): number {
  return computePerceptualMasterGain(DEFAULT_MASTER_VOLUME, true);
}

function syncAudioGains(immediate = false): void {
  if (!sharedAudioCtx) return;
  const now = sharedAudioCtx.currentTime;
  const effectiveSfx = computeEffectiveSfxGain();
  const effectiveBgm = computeEffectiveBgmGain();
  const applyImmediately = immediate || sharedAudioCtx.state !== 'running';

  try {
    if (sfxGainNode) {
      sfxGainNode.gain.cancelScheduledValues(now);
      sfxGainNode.gain.setValueAtTime(effectiveSfx, now);
      sfxGainNode.gain.value = effectiveSfx;
    }

    if (bgmGainNode) {
      bgmGainNode.gain.cancelScheduledValues(now);
      if (applyImmediately) {
        bgmGainNode.gain.setValueAtTime(effectiveBgm, now);
        bgmGainNode.gain.value = effectiveBgm;
      } else {
        bgmGainNode.gain.setTargetAtTime(effectiveBgm, now, 0.02);
      }
    }
  } catch {
    if (sfxGainNode) sfxGainNode.gain.value = effectiveSfx;
    if (bgmGainNode) bgmGainNode.gain.value = effectiveBgm;
  }
}

export function isSoundEnabled(): boolean {
  ensureInitialized();
  return soundEnabledState;
}

export function getMasterVolume(): number {
  ensureInitialized();
  return soundEnabledState ? masterVolumeState : 0;
}

export function isBgmEnabled(): boolean {
  ensureInitialized();
  return bgmEnabledState;
}

export function getBgmTheme(): BgmTheme {
  return bgmThemeState;
}

export function setBgmTheme(theme: BgmTheme): void {
  if (bgmThemeState === theme) return;
  bgmThemeState = theme;
  bgmStepIndex = 0;

  if (
    sharedAudioCtx &&
    bgmGainNode &&
    soundEnabledState &&
    bgmEnabledState &&
    masterVolumeState > 0
  ) {
    const now = sharedAudioCtx.currentTime;
    const targetBgm = computeEffectiveBgmGain();
    try {
      // Gentle quick crossfade dip on theme transition
      bgmGainNode.gain.cancelScheduledValues(now);
      bgmGainNode.gain.setValueAtTime(bgmGainNode.gain.value, now);
      bgmGainNode.gain.linearRampToValueAtTime(targetBgm * 0.12, now + 0.07);
      bgmGainNode.gain.linearRampToValueAtTime(targetBgm, now + 0.22);
    } catch {
      // Ignore gain ramp errors
    }
    bgmNextNoteTime = now + 0.09;
  }

  emitSoundChange();
}

export function setSoundEnabled(enabled: boolean): void {
  ensureInitialized();
  let nextVolume = masterVolumeState;
  if (enabled && nextVolume <= 0) {
    nextVolume =
      lastNonZeroVolumeState > 0
        ? lastNonZeroVolumeState
        : DEFAULT_MASTER_VOLUME;
  }

  const changed =
    soundEnabledState !== enabled || masterVolumeState !== nextVolume;

  soundEnabledState = enabled;
  masterVolumeState = nextVolume;
  writeMutedToStorage(!enabled);
  writeVolumeToStorage(nextVolume);

  if (!enabled) {
    stopBackgroundMusic();
  } else {
    bgmEnabledState = true;
    writeBgmEnabledToStorage(true);
    unlockAudioEngine();
    startBackgroundMusic();
  }

  syncAudioGains(true);
  if (changed) {
    emitSoundChange();
  }
}

export function toggleSoundEnabled(): boolean {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

export function setMasterVolume(volume: number): void {
  ensureInitialized();
  const clamped = clampVolume(volume);
  const nextEnabled = clamped > 0;
  if (clamped > 0) {
    lastNonZeroVolumeState = clamped;
  }

  const changed =
    masterVolumeState !== clamped || soundEnabledState !== nextEnabled;

  masterVolumeState = clamped;
  soundEnabledState = nextEnabled;
  writeVolumeToStorage(clamped);
  writeMutedToStorage(!nextEnabled);

  if (!nextEnabled) {
    stopBackgroundMusic();
  } else {
    bgmEnabledState = true;
    writeBgmEnabledToStorage(true);
    unlockAudioEngine();
    startBackgroundMusic();
  }

  syncAudioGains();
  if (changed) {
    emitSoundChange();
  }
}

export function stepMasterVolume(delta: number): number {
  const current = getMasterVolume();
  const next = clampVolume(current + delta);
  setMasterVolume(next);
  return getMasterVolume();
}

export function setBgmEnabled(enabled: boolean): void {
  ensureInitialized();
  const changed = bgmEnabledState !== enabled;
  bgmEnabledState = enabled;
  writeBgmEnabledToStorage(enabled);

  if (enabled && soundEnabledState && masterVolumeState > 0) {
    unlockAudioEngine();
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }

  syncAudioGains();
  if (changed) {
    emitSoundChange();
  }
}

export function toggleBgmEnabled(): boolean {
  const next = !isBgmEnabled();
  setBgmEnabled(next);
  return next;
}

export function subscribeSoundPreference(listener: SoundListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    subscribeSoundPreference,
    isSoundEnabled,
    () => true
  );
}

export function useMasterVolume(): number {
  return useSyncExternalStore(
    subscribeSoundPreference,
    getMasterVolume,
    () => DEFAULT_MASTER_VOLUME
  );
}

export function useBgmEnabled(): boolean {
  return useSyncExternalStore(
    subscribeSoundPreference,
    isBgmEnabled,
    () => true
  );
}

export function useBgmTheme(): BgmTheme {
  return useSyncExternalStore(
    subscribeSoundPreference,
    getBgmTheme,
    () => 'cheerful'
  );
}

/**
 * Helper intended exclusively for unit tests to reset module-level preference state.
 */
export function resetSoundPreferenceForTests(): void {
  stopBackgroundMusic();
  initializedFromStorage = false;
  soundEnabledState = true;
  masterVolumeState = DEFAULT_MASTER_VOLUME;
  lastNonZeroVolumeState = DEFAULT_MASTER_VOLUME;
  bgmEnabledState = true;
  bgmThemeState = 'cheerful';
}

// ================= SHARED WARM EDUCATIONAL WEB AUDIO ENGINE =================

interface AudioEngineHandle {
  ctx: AudioContext;
  out: AudioNode;
  bgmOut: GainNode;
}

function getAudioEngine(): AudioEngineHandle | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;

  try {
    if (sharedAudioCtx && sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = null;
      sfxGainNode = null;
      bgmGainNode = null;
    }

    if (!sharedAudioCtx) {
      sharedAudioCtx = new Ctx();
      ensureInitialized();

      const sfxGain = sharedAudioCtx.createGain();
      sfxGain.gain.value = computeEffectiveSfxGain();

      const bgmGain = sharedAudioCtx.createGain();
      bgmGain.gain.value = computeEffectiveBgmGain();

      if (typeof sharedAudioCtx.createDynamicsCompressor === 'function') {
        const compressor = sharedAudioCtx.createDynamicsCompressor();
        compressor.threshold.value = -12;
        compressor.knee.value = 18;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.005;
        compressor.release.value = 0.14;
        sfxGain.connect(compressor);
        bgmGain.connect(compressor);
        compressor.connect(sharedAudioCtx.destination);
      } else {
        sfxGain.connect(sharedAudioCtx.destination);
        bgmGain.connect(sharedAudioCtx.destination);
      }

      sfxGainNode = sfxGain;
      bgmGainNode = bgmGain;
    }

    if (sharedAudioCtx.state !== 'running') {
      sharedAudioCtx
        .resume()
        .then(() => {
          syncAudioGains(true);
        })
        .catch(() => {});
    }

    if (!sfxGainNode || !bgmGainNode) return null;
    return { ctx: sharedAudioCtx, out: sfxGainNode, bgmOut: bgmGainNode };
  } catch {
    return null;
  }
}

/**
 * Synchronously initializes and resumes the shared Web Audio context inside a user gesture.
 */
export function unlockAudioEngine(): void {
  const engine = getAudioEngine();
  if (!engine) return;
  if (engine.ctx.state !== 'running') {
    engine.ctx
      .resume()
      .then(() => {
        syncAudioGains(true);
        if (soundEnabledState && bgmEnabledState && masterVolumeState > 0) {
          startBackgroundMusic();
        }
      })
      .catch(() => {});
  } else {
    syncAudioGains();
  }
}

/**
 * Executes a sound effect callback once the AudioContext is actively running,
 * preventing notes from being dropped on the first user click when suspended.
 */
function withRunningAudio(
  localEnabled: boolean,
  playFn: (engine: AudioEngineHandle, now: number) => void
): void {
  if (!canPlay(localEnabled)) return;
  const engine = getAudioEngine();
  if (!engine) return;

  if (engine.ctx.state === 'running') {
    playFn(engine, engine.ctx.currentTime);
    return;
  }

  engine.ctx
    .resume()
    .then(() => {
      syncAudioGains(true);
      if (canPlay(localEnabled) && engine.ctx.state === 'running') {
        playFn(engine, engine.ctx.currentTime);
      }
    })
    .catch(() => {});
}

interface HarmonicVoiceOptions {
  freq: number;
  start: number;
  dur: number;
  peak: number;
  wave?: OscillatorType;
  overtoneGain?: number;
  cutoffHz?: number;
  attackSec?: number;
}

/**
 * Synthesizes a warm, classroom-friendly pitched note (marimba / kalimba / glockenspiel character)
 * using a fundamental oscillator plus an optional gentle octave overtone through a low-pass filter.
 */
function playHarmonicVoice(
  ctx: AudioContext,
  out: AudioNode,
  opts: HarmonicVoiceOptions
): void {
  const {
    freq,
    start,
    dur,
    peak,
    wave = 'sine',
    overtoneGain = 0.22,
    cutoffHz = 2400,
    attackSec = 0.014,
  } = opts;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoffHz, start);
  filter.Q.setValueAtTime(0.7, start);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.linearRampToValueAtTime(peak, start + attackSec);
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  const fundamental = ctx.createOscillator();
  fundamental.type = wave;
  fundamental.frequency.setValueAtTime(freq, start);
  fundamental.connect(filter);

  let overtone: OscillatorNode | null = null;
  if (overtoneGain > 0) {
    overtone = ctx.createOscillator();
    const overtoneLevel = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, start);
    overtoneLevel.gain.setValueAtTime(overtoneGain, start);
    overtoneLevel.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.55);
    overtone.connect(overtoneLevel);
    overtoneLevel.connect(filter);
  }

  filter.connect(env);
  env.connect(out);

  fundamental.start(start);
  fundamental.stop(start + dur + 0.03);

  if (overtone) {
    overtone.start(start);
    overtone.stop(start + dur + 0.03);
  }
}

// ================= DUAL-TRACK EDUCATIONAL BACKGROUND SOUNDTRACKS =================
// Track 1 ('cheerful'): "Solcito Saludable" — 106 BPM, C Major sunny educational loop
// Track 2 ('suspense'): "Misión Relámpago" — 126 BPM, A Minor playful cartoon quiz-adventure suspense

const CHEERFUL_STEP_SEC = 60 / 106 / 2; // 106 BPM in eighth notes (~0.283s)
const SUSPENSE_STEP_SEC = 60 / 126 / 2; // 126 BPM in eighth notes (~0.238s)
const BGM_TOTAL_STEPS = 128; // 16 bars of 4/4 (8 eighth-notes per bar)

const N = {
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  Gs3: 207.65,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  Gs4: 415.3,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  Gs5: 830.61,
  A5: 880.0,
} as const;

interface BarHarmony {
  bassRoot: number;
  bassFifth: number;
  chord: readonly [number, number, number];
}

// ---------- TRACK 1: CHEERFUL EDUCATIONAL ("Solcito Saludable") ----------
const CHEERFUL_MELODY_STEPS: readonly number[] = [
  // Bars 1–4: C · G · Am · F
  N.E5, 0, N.G5, 0, N.E5, N.D5, N.C5, 0,
  N.D5, 0, N.E5, 0, N.G5, 0, 0, 0,
  N.A5, 0, N.G5, 0, N.E5, N.D5, N.C5, 0,
  N.D5, 0, N.C5, 0, N.A4, 0, 0, 0,
  // Bars 5–8: C · F · G · C
  N.C5, 0, N.D5, N.E5, N.G5, 0, N.E5, 0,
  N.F5, 0, N.E5, 0, N.D5, 0, N.C5, 0,
  N.D5, 0, N.E5, N.D5, N.B4, 0, N.G4, 0,
  N.C5, 0, N.E5, 0, N.C5, 0, 0, 0,
  // Bars 9–12: F · C · Dm · G
  N.A5, 0, N.F5, 0, N.C5, N.D5, N.E5, 0,
  N.G5, 0, N.E5, 0, N.C5, 0, 0, 0,
  N.F5, 0, N.E5, N.D5, N.A4, 0, N.D5, 0,
  N.E5, 0, N.D5, 0, N.B4, 0, 0, 0,
  // Bars 13–16: C · F · G · C
  N.E5, 0, N.G5, 0, N.E5, N.D5, N.C5, 0,
  N.A4, 0, N.C5, N.D5, N.F5, 0, N.E5, 0,
  N.D5, 0, N.E5, 0, N.D5, N.C5, N.B4, 0,
  N.C5, 0, N.G4, 0, N.C5, 0, 0, 0,
];

const CHEERFUL_BAR_HARMONY: readonly BarHarmony[] = [
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
  { bassRoot: N.G3, bassFifth: N.D3, chord: [N.B3, N.D4, N.G4] },
  { bassRoot: N.A3, bassFifth: N.E3, chord: [N.C4, N.E4, N.A4] },
  { bassRoot: N.F3, bassFifth: N.C3, chord: [N.C4, N.F4, N.A4] },
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
  { bassRoot: N.F3, bassFifth: N.C3, chord: [N.C4, N.F4, N.A4] },
  { bassRoot: N.G3, bassFifth: N.D3, chord: [N.B3, N.D4, N.G4] },
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
  { bassRoot: N.F3, bassFifth: N.C3, chord: [N.C4, N.F4, N.A4] },
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
  { bassRoot: N.D3, bassFifth: N.A3, chord: [N.D4, N.F4, N.A4] },
  { bassRoot: N.G3, bassFifth: N.D3, chord: [N.B3, N.D4, N.G4] },
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
  { bassRoot: N.F3, bassFifth: N.C3, chord: [N.C4, N.F4, N.A4] },
  { bassRoot: N.G3, bassFifth: N.D3, chord: [N.B3, N.D4, N.G4] },
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
];

// ---------- TRACK 2: PLAYFUL KIDS' SUSPENSE ("Misión Relámpago") ----------
// Bouncy cartoon detective / quiz-show tension in A minor — exciting yet bright and kid-safe!
const SUSPENSE_MELODY_STEPS: readonly number[] = [
  // Bar 1 (Am): tiptoe playful detective motif
  N.A4, 0, N.C5, 0, N.E5, 0, N.D5, N.C5,
  // Bar 2 (Am): cheeky rising turn
  N.B4, 0, N.C5, 0, N.E5, 0, 0, 0,
  // Bar 3 (Dm): curious climb
  N.D5, 0, N.F5, 0, N.A5, 0, N.G5, N.F5,
  // Bar 4 (E7): playful suspense wink
  N.E5, 0, N.D5, N.C5, N.B4, 0, N.Gs4, 0,

  // Bar 5 (Am): quick rhythmic bounce
  N.A4, N.B4, N.C5, 0, N.E5, 0, N.C5, 0,
  // Bar 6 (F): heroic bright lift
  N.F5, 0, N.E5, 0, N.C5, 0, N.A4, 0,
  // Bar 7 (Dm): ticking quest run
  N.D5, 0, N.E5, N.F5, N.E5, 0, N.D5, 0,
  // Bar 8 (E7): punchy turnaround
  N.E5, 0, 0, N.B4, N.E5, 0, 0, 0,

  // Bar 9 (C): upbeat sunny adventure bridge (keeps kid-friendly charm!)
  N.C5, 0, N.E5, 0, N.G5, 0, N.E5, N.D5,
  // Bar 10 (G): bright rhythmic leap
  N.D5, 0, N.G5, 0, N.B4, 0, N.D5, 0,
  // Bar 11 (Am): sneaky playful cadence
  N.C5, 0, N.E5, 0, N.A5, 0, N.E5, 0,
  // Bar 12 (E7): mischievous sparkle
  N.Gs5, 0, N.E5, 0, N.B4, 0, N.E5, 0,

  // Bar 13 (Dm): race-the-clock dash
  N.F5, 0, N.E5, N.D5, N.F5, 0, N.A5, 0,
  // Bar 14 (Am): bouncy reply
  N.E5, 0, N.D5, N.C5, N.E5, 0, N.C5, 0,
  // Bar 15 (E7): playful tension cadence
  N.B4, N.C5, N.D5, 0, N.E5, 0, N.Gs4, 0,
  // Bar 16 (Am): crisp loop reset
  N.A4, 0, N.C5, 0, N.A4, 0, 0, 0,
];

const SUSPENSE_BAR_HARMONY: readonly BarHarmony[] = [
  // Bars 1–4: Am · Am · Dm · E7
  { bassRoot: N.A2, bassFifth: N.E3, chord: [N.A3, N.C4, N.E4] },
  { bassRoot: N.A2, bassFifth: N.E3, chord: [N.A3, N.C4, N.E4] },
  { bassRoot: N.D3, bassFifth: N.A3, chord: [N.D4, N.F4, N.A4] },
  { bassRoot: N.E3, bassFifth: N.B2, chord: [N.B3, N.E4, N.Gs4] },
  // Bars 5–8: Am · F · Dm · E7
  { bassRoot: N.A2, bassFifth: N.E3, chord: [N.A3, N.C4, N.E4] },
  { bassRoot: N.F3, bassFifth: N.C3, chord: [N.C4, N.F4, N.A4] },
  { bassRoot: N.D3, bassFifth: N.A3, chord: [N.D4, N.F4, N.A4] },
  { bassRoot: N.E3, bassFifth: N.Gs3, chord: [N.B3, N.E4, N.Gs4] },
  // Bars 9–12: C · G · Am · E7
  { bassRoot: N.C3, bassFifth: N.G3, chord: [N.C4, N.E4, N.G4] },
  { bassRoot: N.G3, bassFifth: N.D3, chord: [N.B3, N.D4, N.G4] },
  { bassRoot: N.A2, bassFifth: N.E3, chord: [N.A3, N.C4, N.E4] },
  { bassRoot: N.E3, bassFifth: N.B2, chord: [N.B3, N.E4, N.Gs4] },
  // Bars 13–16: Dm · Am · E7 · Am
  { bassRoot: N.D3, bassFifth: N.A3, chord: [N.D4, N.F4, N.A4] },
  { bassRoot: N.A2, bassFifth: N.E3, chord: [N.A3, N.C4, N.E4] },
  { bassRoot: N.E3, bassFifth: N.Gs3, chord: [N.B3, N.E4, N.Gs4] },
  { bassRoot: N.A2, bassFifth: N.E3, chord: [N.A3, N.C4, N.E4] },
];

let bgmTimerId: number | null = null;
let bgmNextNoteTime = 0;
let bgmStepIndex = 0;
let bgmLifecycleRegistered = false;

function scheduleCheerfulStep(
  ctx: AudioContext,
  bgmOut: GainNode,
  step: number,
  when: number
): void {
  const barIndex = Math.floor(step / 8) % CHEERFUL_BAR_HARMONY.length;
  const beatInBar = step % 8;
  const harmony = CHEERFUL_BAR_HARMONY[barIndex];

  // 1. Soft Wooden Marimba Lead Melody
  const melodyFreq = CHEERFUL_MELODY_STEPS[step % BGM_TOTAL_STEPS];
  if (melodyFreq > 0) {
    playHarmonicVoice(ctx, bgmOut, {
      freq: melodyFreq,
      start: when,
      dur: CHEERFUL_STEP_SEC * 1.45,
      peak: 0.145,
      wave: 'sine',
      overtoneGain: 0.14,
      cutoffHz: 1850,
      attackSec: 0.016,
    });
  }

  // 2. Warm Round Bass Pulse (Beats 1 and 3)
  if (beatInBar === 0 || beatInBar === 4) {
    playHarmonicVoice(ctx, bgmOut, {
      freq: beatInBar === 0 ? harmony.bassRoot : harmony.bassFifth,
      start: when,
      dur: CHEERFUL_STEP_SEC * 2.6,
      peak: 0.16,
      wave: 'triangle',
      overtoneGain: 0,
      cutoffHz: 520,
      attackSec: 0.024,
    });
  }

  // 3. Gentle Ukulele-Like Arpeggiated Off-beat Chords (Beats 2 and 4)
  if (beatInBar === 2 || beatInBar === 6) {
    harmony.chord.forEach((chordFreq, idx) => {
      playHarmonicVoice(ctx, bgmOut, {
        freq: chordFreq,
        start: when + idx * 0.016,
        dur: CHEERFUL_STEP_SEC * 1.55,
        peak: 0.052,
        wave: 'sine',
        overtoneGain: 0.06,
        cutoffHz: 1400,
        attackSec: 0.018,
      });
    });
  }
}

function scheduleSuspenseStep(
  ctx: AudioContext,
  bgmOut: GainNode,
  step: number,
  when: number
): void {
  const barIndex = Math.floor(step / 8) % SUSPENSE_BAR_HARMONY.length;
  const beatInBar = step % 8;
  const harmony = SUSPENSE_BAR_HARMONY[barIndex];

  // 1. Playful Staccato Xylophone/Marimba Mystery Lead
  const melodyFreq = SUSPENSE_MELODY_STEPS[step % BGM_TOTAL_STEPS];
  if (melodyFreq > 0) {
    playHarmonicVoice(ctx, bgmOut, {
      freq: melodyFreq,
      start: when,
      dur: SUSPENSE_STEP_SEC * 0.92,
      peak: 0.14,
      wave: 'triangle',
      overtoneGain: 0.18,
      cutoffHz: 2150,
      attackSec: 0.009,
    });
  }

  // 2. Bouncy Pizzicato Tiptoe Bass (beats 1, 2, 3, 4 alternating root/fifth)
  if (beatInBar % 2 === 0) {
    const bassFreq =
      beatInBar === 0 || beatInBar === 4 ? harmony.bassRoot : harmony.bassFifth;
    playHarmonicVoice(ctx, bgmOut, {
      freq: bassFreq,
      start: when,
      dur: SUSPENSE_STEP_SEC * 1.15,
      peak: beatInBar === 0 ? 0.175 : 0.13,
      wave: 'triangle',
      overtoneGain: 0.04,
      cutoffHz: 620,
      attackSec: 0.012,
    });
  }

  // 3. Soft Wooden Clock-Tick Pulse on Off-beats (gentle quiz-show momentum)
  if (beatInBar === 1 || beatInBar === 3 || beatInBar === 5 || beatInBar === 7) {
    playHarmonicVoice(ctx, bgmOut, {
      freq: beatInBar === 3 || beatInBar === 7 ? 1174.66 : 987.77, // D6 / B5 soft woodblock tap
      start: when,
      dur: 0.045,
      peak: 0.036,
      wave: 'sine',
      overtoneGain: 0.05,
      cutoffHz: 1800,
      attackSec: 0.004,
    });
  }

  // 4. Crisp Playful Chord Punctuation on Beats 2 and 4
  if (beatInBar === 2 || beatInBar === 6) {
    harmony.chord.forEach((chordFreq, idx) => {
      playHarmonicVoice(ctx, bgmOut, {
        freq: chordFreq,
        start: when + idx * 0.01,
        dur: SUSPENSE_STEP_SEC * 0.85,
        peak: 0.048,
        wave: 'sine',
        overtoneGain: 0.08,
        cutoffHz: 1650,
        attackSec: 0.01,
      });
    });
  }
}

function runBgmSchedulerTick(): void {
  if (
    typeof window === 'undefined' ||
    !soundEnabledState ||
    !bgmEnabledState ||
    masterVolumeState <= 0
  ) {
    stopBackgroundMusic();
    return;
  }

  if (
    typeof document !== 'undefined' &&
    document.visibilityState === 'hidden'
  ) {
    return;
  }

  const engine = getAudioEngine();
  if (!engine || engine.ctx.state !== 'running') return;

  const lookaheadSec = 0.28;
  const now = engine.ctx.currentTime;

  // Recover cleanly if tab resumed after a pause
  if (bgmNextNoteTime < now - 0.15) {
    bgmNextNoteTime = now + 0.06;
  }

  while (bgmNextNoteTime < now + lookaheadSec) {
    const stepDur =
      bgmThemeState === 'suspense' ? SUSPENSE_STEP_SEC : CHEERFUL_STEP_SEC;
    if (bgmThemeState === 'suspense') {
      scheduleSuspenseStep(engine.ctx, engine.bgmOut, bgmStepIndex, bgmNextNoteTime);
    } else {
      scheduleCheerfulStep(engine.ctx, engine.bgmOut, bgmStepIndex, bgmNextNoteTime);
    }
    bgmNextNoteTime += stepDur;
    bgmStepIndex = (bgmStepIndex + 1) % BGM_TOTAL_STEPS;
  }
}

/** Starts (or ensures running) the gentle looping educational background soundtrack. */
export function startBackgroundMusic(): void {
  if (typeof window === 'undefined') return;
  ensureInitialized();
  if (!soundEnabledState || !bgmEnabledState || masterVolumeState <= 0) return;

  const engine = getAudioEngine();
  if (!engine) return;
  syncAudioGains();

  if (bgmTimerId !== null) return;

  bgmNextNoteTime = engine.ctx.currentTime + 0.08;
  bgmTimerId = window.setInterval(runBgmSchedulerTick, 80);
  runBgmSchedulerTick();
}

/** Cleanly stops background music scheduling. */
export function stopBackgroundMusic(): void {
  if (bgmTimerId !== null && typeof window !== 'undefined') {
    window.clearInterval(bgmTimerId);
  }
  bgmTimerId = null;
}

/**
 * Attaches global first-interaction unlock and tab-visibility listeners so background music
 * starts automatically on the user's first tap/click/keypress and flows smoothly across all screens.
 */
export function initGlobalBackgroundMusicLifecycle(): () => void {
  if (typeof window === 'undefined') return () => {};
  ensureInitialized();

  const tryUnlockAndStart = () => {
    ensureInitialized();
    const engine = getAudioEngine();
    if (!engine) return;
    if (engine.ctx.state !== 'running') {
      engine.ctx
        .resume()
        .then(() => {
          syncAudioGains(true);
          if (soundEnabledState && bgmEnabledState && masterVolumeState > 0) {
            startBackgroundMusic();
          }
        })
        .catch(() => {});
    } else {
      syncAudioGains();
      if (soundEnabledState && bgmEnabledState && masterVolumeState > 0) {
        startBackgroundMusic();
      }
    }
  };

  const handleVisibilityChange = () => {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'hidden') {
      stopBackgroundMusic();
    } else if (soundEnabledState && bgmEnabledState && masterVolumeState > 0) {
      tryUnlockAndStart();
    }
  };

  const handleStorageSync = (e: StorageEvent) => {
    if (
      e.key !== SOUND_MUTE_STORAGE_KEY &&
      e.key !== SOUND_VOLUME_STORAGE_KEY &&
      e.key !== SOUND_BGM_ENABLED_STORAGE_KEY
    ) {
      return;
    }
    const muted = readMutedFromStorage();
    const storedVol = readVolumeFromStorage();
    const storedBgm = readBgmEnabledFromStorage();
    if (storedVol > 0) {
      lastNonZeroVolumeState = storedVol;
    }
    masterVolumeState = storedVol;
    soundEnabledState = !muted && storedVol > 0;
    bgmEnabledState = storedBgm;

    if (!soundEnabledState || !bgmEnabledState || masterVolumeState <= 0) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
    syncAudioGains(true);
    emitSoundChange();
  };

  if (bgmLifecycleRegistered) {
    return () => {};
  }
  bgmLifecycleRegistered = true;

  window.addEventListener('pointerdown', tryUnlockAndStart, { passive: true });
  window.addEventListener('click', tryUnlockAndStart, { passive: true });
  window.addEventListener('touchstart', tryUnlockAndStart, { passive: true });
  window.addEventListener('keydown', tryUnlockAndStart, { passive: true });
  window.addEventListener('focus', tryUnlockAndStart, { passive: true });
  window.addEventListener('storage', handleStorageSync);
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return () => {
    bgmLifecycleRegistered = false;
    window.removeEventListener('pointerdown', tryUnlockAndStart);
    window.removeEventListener('click', tryUnlockAndStart);
    window.removeEventListener('touchstart', tryUnlockAndStart);
    window.removeEventListener('keydown', tryUnlockAndStart);
    window.removeEventListener('focus', tryUnlockAndStart);
    window.removeEventListener('storage', handleStorageSync);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    stopBackgroundMusic();
  };
}

// ================= SOUND EFFECTS (SFX — ALWAYS ACTIVE) =================

function canPlay(localEnabled = true): boolean {
  return localEnabled;
}

/** Soft wooden kalimba tap for buttons, mode selectors, and navigation. */
export function playUiClickSound(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 587.33, // D5
      start: now,
      dur: 0.09,
      peak: 0.095,
      wave: 'sine',
      overtoneGain: 0.18,
      cutoffHz: 2100,
      attackSec: 0.008,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 783.99, // G5
      start: now + 0.03,
      dur: 0.11,
      peak: 0.075,
      wave: 'sine',
      overtoneGain: 0.14,
      cutoffHz: 2400,
      attackSec: 0.008,
    });
  });
}

/** Gentle slide transition chime for tutorial carousels. */
export function playTutorialStepSound(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 523.25, // C5
      start: now,
      dur: 0.12,
      peak: 0.085,
      wave: 'sine',
      overtoneGain: 0.16,
      cutoffHz: 2200,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 659.25, // E5
      start: now + 0.05,
      dur: 0.16,
      peak: 0.09,
      wave: 'sine',
      overtoneGain: 0.18,
      cutoffHz: 2500,
    });
  });
}

/** Warm marimba chime when placing a food correctly in NutriPlato or El Semáforo. */
export function playPlaceFoodHarmonic(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 523.25, // C5
      start: now,
      dur: 0.15,
      peak: 0.11,
      wave: 'triangle',
      overtoneGain: 0.15,
      cutoffHz: 2100,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 659.25, // E5
      start: now + 0.055,
      dur: 0.19,
      peak: 0.12,
      wave: 'sine',
      overtoneGain: 0.22,
      cutoffHz: 2500,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 783.99, // G5
      start: now + 0.11,
      dur: 0.22,
      peak: 0.095,
      wave: 'sine',
      overtoneGain: 0.16,
      cutoffHz: 2800,
    });
  });
}

/** Reassuring, kid-friendly soft downward wood-marimba hint on a wrong drop. */
export function playGentleHintHarmonic(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 349.23, // F4
      start: now,
      dur: 0.14,
      peak: 0.095,
      wave: 'sine',
      overtoneGain: 0.08,
      cutoffHz: 1400,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 293.66, // D4
      start: now + 0.1,
      dur: 0.2,
      peak: 0.09,
      wave: 'sine',
      overtoneGain: 0.06,
      cutoffHz: 1200,
    });
  });
}

/** Silky pentatonic card shuffle ripple for Cartas del Superpoder. */
export function playCardShuffleHarmonic(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    const notes = [392.0, 440.0, 523.25, 659.25]; // G4 A4 C5 E5
    notes.forEach((freq, idx) => {
      playHarmonicVoice(engine.ctx, engine.out, {
        freq,
        start: now + idx * 0.045,
        dur: 0.16,
        peak: 0.085,
        wave: 'triangle',
        overtoneGain: 0.12,
        cutoffHz: 2200,
      });
    });
  });
}

/** Bright, warm kalimba chime on selecting a card or confirming an action. */
export function playCardSelectHarmonic(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 523.25, // C5
      start: now,
      dur: 0.16,
      peak: 0.11,
      wave: 'sine',
      overtoneGain: 0.2,
      cutoffHz: 2400,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 783.99, // G5
      start: now + 0.06,
      dur: 0.22,
      peak: 0.11,
      wave: 'sine',
      overtoneGain: 0.22,
      cutoffHz: 2800,
    });
  });
}

/** Magical glockenspiel major-9th flourish when flipping open a Superpower card. */
export function playCardFlipHarmonic(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1174.66]; // C5 E5 G5 C6 D6
    notes.forEach((freq, idx) => {
      playHarmonicVoice(engine.ctx, engine.out, {
        freq,
        start: now + idx * 0.055,
        dur: 0.34,
        peak: 0.105,
        wave: 'sine',
        overtoneGain: 0.24,
        cutoffHz: 3200,
      });
    });
  });
}

/** Bright celebratory D-major arpeggio for correct quiz answers and 3D food reveals. */
export function playQuizCorrectRevealSound(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5 F#5 A5 D6
    notes.forEach((freq, idx) => {
      playHarmonicVoice(engine.ctx, engine.out, {
        freq,
        start: now + idx * 0.065,
        dur: 0.36,
        peak: 0.115,
        wave: 'sine',
        overtoneGain: 0.24,
        cutoffHz: 3200,
      });
    });
  });
}

/** Gentle, clear double-tone for incorrect quiz answers (distinct yet friendly). */
export function playQuizWrongSoftSound(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 392.0, // G4
      start: now,
      dur: 0.13,
      peak: 0.1,
      wave: 'triangle',
      overtoneGain: 0.08,
      cutoffHz: 1500,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 311.13, // Eb4
      start: now + 0.105,
      dur: 0.22,
      peak: 0.095,
      wave: 'sine',
      overtoneGain: 0.06,
      cutoffHz: 1250,
    });
  });
}

/** Bright double-bell chime for quiz highlights. */
export function playLightningBellHarmonic(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 880.0, // A5
      start: now,
      dur: 0.26,
      peak: 0.11,
      wave: 'sine',
      overtoneGain: 0.2,
      cutoffHz: 3000,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 1318.51, // E6
      start: now + 0.085,
      dur: 0.36,
      peak: 0.105,
      wave: 'sine',
      overtoneGain: 0.18,
      cutoffHz: 3400,
    });
  });
}

/** Crisp wooden clock tick for Contrarreloj countdowns (subtle accent in final 15 seconds). */
export function playTimerTickHarmonic(enabled = true, urgent = false): void {
  withRunningAudio(enabled, (engine, now) => {
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: urgent ? 987.77 : 783.99, // B5 vs G5
      start: now,
      dur: 0.06,
      peak: urgent ? 0.075 : 0.055,
      wave: 'triangle',
      overtoneGain: 0.1,
      cutoffHz: 2200,
      attackSec: 0.005,
    });
    if (urgent) {
      playHarmonicVoice(engine.ctx, engine.out, {
        freq: 1174.66, // D6 subtle pulse
        start: now + 0.055,
        dur: 0.05,
        peak: 0.05,
        wave: 'sine',
        overtoneGain: 0.08,
        cutoffHz: 2400,
        attackSec: 0.005,
      });
    }
  });
}

/** Calm descending bell cadence when Contrarreloj time runs out. */
export function playTimeUpCadenceSound(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    const notes = [523.25, 440.0, 392.0, 329.63]; // C5 A4 G4 E4
    notes.forEach((freq, idx) => {
      playHarmonicVoice(engine.ctx, engine.out, {
        freq,
        start: now + idx * 0.115,
        dur: 0.28,
        peak: 0.105,
        wave: 'triangle',
        overtoneGain: 0.14,
        cutoffHz: 2000,
      });
    });
  });
}

/** Joyful, warm classroom victory fanfare (C-major triad rising into a sparkling chord). */
export function playVictoryFanfareSound(enabled = true): void {
  withRunningAudio(enabled, (engine, now) => {
    const melody = [
      { freq: 523.25, offset: 0.0, dur: 0.24, peak: 0.115 }, // C5
      { freq: 659.25, offset: 0.085, dur: 0.24, peak: 0.115 }, // E5
      { freq: 783.99, offset: 0.17, dur: 0.26, peak: 0.12 }, // G5
      { freq: 1046.5, offset: 0.26, dur: 0.52, peak: 0.13 }, // C6
    ];

    melody.forEach((n) => {
      playHarmonicVoice(engine.ctx, engine.out, {
        freq: n.freq,
        start: now + n.offset,
        dur: n.dur,
        peak: n.peak,
        wave: 'sine',
        overtoneGain: 0.25,
        cutoffHz: 3400,
      });
    });

    // Warm sparkling harmony bloom on the final note
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 659.25, // E5
      start: now + 0.28,
      dur: 0.5,
      peak: 0.085,
      wave: 'triangle',
      overtoneGain: 0.12,
      cutoffHz: 2600,
    });
    playHarmonicVoice(engine.ctx, engine.out, {
      freq: 1318.51, // E6
      start: now + 0.31,
      dur: 0.48,
      peak: 0.075,
      wave: 'sine',
      overtoneGain: 0.15,
      cutoffHz: 3600,
    });
  });
}
