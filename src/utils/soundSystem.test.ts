import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computePerceptualMasterGain,
  DEFAULT_MASTER_VOLUME,
  getBgmTheme,
  getMasterVolume,
  initGlobalBackgroundMusicLifecycle,
  isBgmEnabled,
  isSoundEnabled,
  playCardFlipHarmonic,
  playCardSelectHarmonic,
  playCardShuffleHarmonic,
  playGentleHintHarmonic,
  playPlaceFoodHarmonic,
  playQuizCorrectRevealSound,
  playQuizWrongSoftSound,
  playTimerTickHarmonic,
  playTimeUpCadenceSound,
  playTutorialStepSound,
  playUiClickSound,
  playVictoryFanfareSound,
  resetSoundPreferenceForTests,
  setBgmEnabled,
  setBgmTheme,
  setMasterVolume,
  setSoundEnabled,
  SOUND_BGM_ENABLED_STORAGE_KEY,
  SOUND_MUTE_STORAGE_KEY,
  SOUND_VOLUME_STORAGE_KEY,
  startBackgroundMusic,
  stepMasterVolume,
  stopBackgroundMusic,
  subscribeSoundPreference,
  toggleBgmEnabled,
  toggleSoundEnabled,
} from './soundSystem';

function installMockLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  const mockWindow = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  };
  (globalThis as unknown as { window?: typeof mockWindow }).window = mockWindow;
  return store;
}

function cleanupMockWindow() {
  delete (globalThis as unknown as { window?: unknown }).window;
}

test('sound preference defaults to enabled and persists mute toggle to localStorage', () => {
  const store = installMockLocalStorage();
  resetSoundPreferenceForTests();

  try {
    assert.equal(isSoundEnabled(), true);
    assert.equal(getMasterVolume(), DEFAULT_MASTER_VOLUME);

    const afterFirstToggle = toggleSoundEnabled();
    assert.equal(afterFirstToggle, false);
    assert.equal(isSoundEnabled(), false);
    assert.equal(getMasterVolume(), 0);
    assert.equal(store.get(SOUND_MUTE_STORAGE_KEY), 'true');

    // Simulate reload reading persisted muted state
    resetSoundPreferenceForTests();
    assert.equal(isSoundEnabled(), false);

    const afterSecondToggle = toggleSoundEnabled();
    assert.equal(afterSecondToggle, true);
    assert.equal(getMasterVolume(), DEFAULT_MASTER_VOLUME);
    assert.equal(store.get(SOUND_MUTE_STORAGE_KEY), 'false');
  } finally {
    cleanupMockWindow();
    resetSoundPreferenceForTests();
  }
});

test('master volume clamps 0..1, persists, steps cleanly, and remembers previous volume across mute', () => {
  const store = installMockLocalStorage();
  resetSoundPreferenceForTests();

  try {
    setMasterVolume(0.45);
    assert.equal(getMasterVolume(), 0.45);
    assert.equal(isSoundEnabled(), true);
    assert.equal(store.get(SOUND_VOLUME_STORAGE_KEY), '0.45');

    // Step up & clamp max
    stepMasterVolume(0.1);
    assert.equal(getMasterVolume(), 0.55);
    setMasterVolume(1.8);
    assert.equal(getMasterVolume(), 1);

    // Dragging volume to 0 mutes cleanly and remembers last non-zero volume
    setMasterVolume(0);
    assert.equal(isSoundEnabled(), false);
    assert.equal(getMasterVolume(), 0);

    // Unmuting restores the last non-zero volume
    setSoundEnabled(true);
    assert.equal(isSoundEnabled(), true);
    assert.equal(getMasterVolume(), 1);

    // Stepping up from muted automatically re-enables sound
    setMasterVolume(0);
    stepMasterVolume(0.1);
    assert.equal(isSoundEnabled(), true);
    assert.equal(getMasterVolume(), 0.1);

    // Simulate reload with saved volume
    resetSoundPreferenceForTests();
    assert.equal(getMasterVolume(), 0.1);
  } finally {
    cleanupMockWindow();
    resetSoundPreferenceForTests();
  }
});

test('background music preference toggles independently and persists to localStorage', () => {
  const store = installMockLocalStorage();
  resetSoundPreferenceForTests();

  try {
    assert.equal(isBgmEnabled(), true);

    const afterOff = toggleBgmEnabled();
    assert.equal(afterOff, false);
    assert.equal(isBgmEnabled(), false);
    assert.equal(store.get(SOUND_BGM_ENABLED_STORAGE_KEY), 'false');
    // Master SFX remain enabled when only BGM is turned off
    assert.equal(isSoundEnabled(), true);

    resetSoundPreferenceForTests();
    assert.equal(isBgmEnabled(), false);

    setBgmEnabled(true);
    assert.equal(isBgmEnabled(), true);
    assert.equal(store.get(SOUND_BGM_ENABLED_STORAGE_KEY), 'true');
  } finally {
    cleanupMockWindow();
    resetSoundPreferenceForTests();
  }
});

test('subscribers are notified on sound, volume, and BGM changes and can unsubscribe cleanly', () => {
  installMockLocalStorage();
  resetSoundPreferenceForTests();

  try {
    let notifications = 0;
    const unsubscribe = subscribeSoundPreference(() => {
      notifications += 1;
    });

    setSoundEnabled(false);
    assert.equal(notifications, 1);

    // Setting same value again should not double-notify
    setSoundEnabled(false);
    assert.equal(notifications, 1);

    setSoundEnabled(true);
    assert.equal(notifications, 2);

    setMasterVolume(0.5);
    assert.equal(notifications, 3);

    setBgmEnabled(false);
    assert.equal(notifications, 4);

    unsubscribe();
    toggleSoundEnabled();
    assert.equal(notifications, 4);
  } finally {
    cleanupMockWindow();
    resetSoundPreferenceForTests();
  }
});

test('perceptual master gain scales monotonically and BGM theme switches cleanly between cheerful and suspense', () => {
  installMockLocalStorage();
  resetSoundPreferenceForTests();

  try {
    assert.equal(computePerceptualMasterGain(0.7, false), 0);
    assert.equal(computePerceptualMasterGain(0, true), 0);
    const g10 = computePerceptualMasterGain(0.1, true);
    const g50 = computePerceptualMasterGain(0.5, true);
    const g100 = computePerceptualMasterGain(1.0, true);
    assert.ok(g10 > 0 && g10 < g50 && g50 < g100);

    let themeNotifications = 0;
    const unsub = subscribeSoundPreference(() => {
      themeNotifications += 1;
    });

    assert.equal(getBgmTheme(), 'cheerful');
    setBgmTheme('suspense');
    assert.equal(getBgmTheme(), 'suspense');
    assert.equal(themeNotifications, 1);

    // Same theme should not double-notify
    setBgmTheme('suspense');
    assert.equal(themeNotifications, 1);

    setBgmTheme('cheerful');
    assert.equal(getBgmTheme(), 'cheerful');
    assert.equal(themeNotifications, 2);

    unsub();
  } finally {
    cleanupMockWindow();
    resetSoundPreferenceForTests();
  }
});

test('all harmonious Web Audio and BGM helpers safely no-op in non-browser environments', () => {
  cleanupMockWindow();
  resetSoundPreferenceForTests();

  assert.doesNotThrow(() => {
    const cleanup = initGlobalBackgroundMusicLifecycle();
    startBackgroundMusic();
    stopBackgroundMusic();
    cleanup();
    playUiClickSound();
    playTutorialStepSound();
    playPlaceFoodHarmonic();
    playGentleHintHarmonic();
    playCardShuffleHarmonic();
    playCardSelectHarmonic();
    playCardFlipHarmonic();
    playQuizCorrectRevealSound();
    playQuizWrongSoftSound();
    playTimerTickHarmonic(true, false);
    playTimerTickHarmonic(true, true);
    playTimeUpCadenceSound();
    playVictoryFanfareSound();
  });
});
