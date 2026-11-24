import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Gamepad2,
  Home,
  Maximize2,
  Minimize2,
  RotateCcw,
  Timer,
} from 'lucide-react';
import {
  FilterTab,
  FOODS,
  FoodItem,
  PlateState,
  SectorId,
  VolunteerStats,
} from './data/foods';
import {
  countFilledSlots,
  createInitialPlate,
  createInitialVolunteerStats,
  evaluateFoodPlacement,
  filterFoods,
  getEnergyItems,
  getProteinItems,
  recordCompletedPlateStats,
  recordDistractorLessonStats,
  removeFoodFromPlate,
} from './game/rules';
import { TitleScreen } from './components/TitleScreen';
import { HealthyPlate } from './components/HealthyPlate';
import { FoodTray } from './components/FoodTray';
import {
  GuideFeedback,
  GuideTopic,
  NutritionGuideCard,
} from './components/NutritionGuideCard';
import { StarCapsuleProgressBar } from './components/StarCapsuleProgressBar';
import {
  NutriPlatoModeSelector,
  NutriPlatoTimeUpModal,
} from './components/NutriPlatoModeSelector';
import { MinigameTutorialScreen } from './components/MinigameTutorialScreen';
import { NUTRIPLATO_TUTORIAL_SLIDES } from './data/minigameTutorials';
import { VictoryModal } from './components/VictoryModal';
import { VolunteerPanel } from './components/VolunteerPanel';
import { SuperpowerCardsGame } from './components/SuperpowerCardsGame';
import { SemaforoGame } from './components/SemaforoGame';
import { LightningQuizGame } from './components/LightningQuizGame';
import {
  BASE_PLATE_Z_INDEX,
  bringTransformToFront,
  computeWheelScale,
  createPlatedTransform,
  DropPointContext,
  MAX_VISIBLE_PER_SECTOR,
  PlatedTransform,
  PlateFoodSector,
  reorganizarPlatoCoherente,
} from './game/platingPhysics';
import {
  applyTimedPlacementDelta,
  applyTimedRemovalDelta,
  formatNutriPlatoTime,
  isNutriPlatoTimeUrgent,
  NutriPlatoPlayMode,
  NutriPlatoTimedDurationMinutes,
} from './game/nutriplatoModes';
import {
  playGentleHintSound,
  playPlaceFoodSound,
  playPlateCompleteSound,
  playTimerTickSound,
  playTimeUpSound,
} from './utils/plateAudio';
import {
  initGlobalBackgroundMusicLifecycle,
  playUiClickSound,
  setBgmTheme,
} from './utils/soundSystem';
import { SoundToggleButton } from './components/SoundToggleButton';

type ActiveApp = 'library' | 'nutriplato' | 'superpower' | 'semaforo' | 'lightning';
type ScreenState = 'title' | 'playing' | 'paused' | 'gameover';
type NutriPlatoView = 'guide' | 'mode_select' | 'playing';

const STATS_STORAGE_KEY = 'nutriplato_volunteer_stats_v1';

const TAB_TO_TOPIC: Record<FilterTab, GuideTopic> = {
  all: 'general',
  shield: 'shield',
  protein: 'protein',
  energy: 'energy',
  drinks: 'hydration',
  processed: 'processed',
};

function loadStats(): VolunteerStats {
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return createInitialVolunteerStats();
    const parsed = JSON.parse(raw) as Partial<VolunteerStats>;
    return {
      ...createInitialVolunteerStats(),
      ...parsed,
      byMode: {
        ...createInitialVolunteerStats().byMode,
        ...(parsed.byMode ?? {}),
      },
    };
  } catch {
    return createInitialVolunteerStats();
  }
}

function saveStats(stats: VolunteerStats): void {
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
}

interface VendorFullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
}

interface VendorFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

function getNativeFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null;
  const doc = document as VendorFullscreenDocument;
  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.mozFullScreenElement ??
    doc.msFullscreenElement ??
    null
  );
}

async function requestNativeFullscreen(target: HTMLElement): Promise<boolean> {
  const el = target as VendorFullscreenElement;
  try {
    if (typeof el.requestFullscreen === 'function') {
      await el.requestFullscreen();
      return Boolean(getNativeFullscreenElement());
    }
    if (typeof el.webkitRequestFullscreen === 'function') {
      await el.webkitRequestFullscreen();
      return Boolean(getNativeFullscreenElement());
    }
    if (typeof el.mozRequestFullScreen === 'function') {
      await el.mozRequestFullScreen();
      return Boolean(getNativeFullscreenElement());
    }
    if (typeof el.msRequestFullscreen === 'function') {
      await el.msRequestFullscreen();
      return Boolean(getNativeFullscreenElement());
    }
  } catch {
    return false;
  }
  return false;
}

async function exitNativeFullscreen(): Promise<void> {
  const doc = document as VendorFullscreenDocument;
  try {
    if (typeof doc.exitFullscreen === 'function') {
      await doc.exitFullscreen();
    } else if (typeof doc.webkitExitFullscreen === 'function') {
      await doc.webkitExitFullscreen();
    } else if (typeof doc.mozCancelFullScreen === 'function') {
      await doc.mozCancelFullScreen();
    } else if (typeof doc.msExitFullscreen === 'function') {
      await doc.msExitFullscreen();
    }
  } catch {
    // Ignore exit errors
  }
}

export default function App() {
  const autostartParam =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('autostart')
      : null;

  const [activeApp, setActiveApp] = useState<ActiveApp>(
    autostartParam === 'superpower'
      ? 'superpower'
      : autostartParam === 'semaforo'
        ? 'semaforo'
        : autostartParam === 'lightning'
          ? 'lightning'
          : autostartParam === '1'
            ? 'nutriplato'
            : 'library'
  );
  const [screenState, setScreenState] = useState<ScreenState>(
    autostartParam === '1' ||
      autostartParam === 'superpower' ||
      autostartParam === 'semaforo' ||
      autostartParam === 'lightning'
      ? 'playing'
      : 'title'
  );
  const [plate, setPlate] = useState<PlateState>(() => createInitialPlate());
  const [placements, setPlacements] = useState<Record<PlateFoodSector, PlatedTransform[]>>({
    shield: [],
    protein: [],
    energy: [],
  });
  const zCounterRef = React.useRef<number>(BASE_PLATE_Z_INDEX);
  const instanceCounterRef = React.useRef<number>(0);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [guideTopic, setGuideTopic] = useState<GuideTopic>('general');
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const [guideFeedback, setGuideFeedback] = useState<GuideFeedback | null>(null);
  const [soundEnabled] = useState<boolean>(true);
  const [nativeFullscreen, setNativeFullscreen] = useState<boolean>(false);
  const [tvFallbackFullscreen, setTvFallbackFullscreen] = useState<boolean>(false);
  const [fullscreenHint, setFullscreenHint] = useState<string | null>(null);
  const fullscreenHintTimerRef = React.useRef<number | null>(null);
  const isFullscreen = nativeFullscreen || tvFallbackFullscreen;
  const [wiggleSector, setWiggleSector] = useState<SectorId | 'all' | null>(null);
  const [lastPlacedId, setLastPlacedId] = useState<string | null>(null);
  const [lastPlacedInstanceId, setLastPlacedInstanceId] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [volunteerOpen, setVolunteerOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<VolunteerStats>(() => loadStats());

  // Initialize continuous gentle instrumental background music across the entire app
  useEffect(() => {
    return initGlobalBackgroundMusicLifecycle();
  }, []);

  // NutriPlato game modes (Educational free mode vs Contrarreloj timed mode) & General Tutorial
  const [nutriPlatoView, setNutriPlatoView] = useState<NutriPlatoView>(
    autostartParam === '1' ? 'playing' : 'guide'
  );
  const [nutriPlatoReturnView, setNutriPlatoReturnView] = useState<
    'mode_select' | 'playing'
  >('mode_select');
  const [nutriPlatoMode, setNutriPlatoMode] =
    useState<NutriPlatoPlayMode>('educational');
  const [nutriPlatoMinutes, setNutriPlatoMinutes] =
    useState<NutriPlatoTimedDurationMinutes>(2);
  const [nutriPlatoRemainingSeconds, setNutriPlatoRemainingSeconds] =
    useState<number>(120);
  const [nutriPlatoTimeUp, setNutriPlatoTimeUp] = useState<boolean>(false);
  const [nutriPlatoTimedProgress, setNutriPlatoTimedProgress] =
    useState<number>(0);
  const [nutriPlatoWarnFlash, setNutriPlatoWarnFlash] =
    useState<boolean>(false);
  const [nutriPlatoWarnKey, setNutriPlatoWarnKey] = useState<number>(0);
  const [nutriPlatoCelebrateKey, setNutriPlatoCelebrateKey] =
    useState<number>(0);

  // Mirror game state machine to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = screenState;
  }, [screenState]);

  // Contrarreloj countdown timer for NutriPlato
  const isNutriPlatoTimerRunning =
    activeApp === 'nutriplato' &&
    nutriPlatoView === 'playing' &&
    nutriPlatoMode === 'timed' &&
    screenState === 'playing' &&
    !nutriPlatoTimeUp &&
    !guideOpen &&
    !volunteerOpen;

  // Switch to playful suspense soundtrack during NutriPlato Contrarreloj (and restore cheerful in Library / Superpower)
  useEffect(() => {
    if (activeApp === 'nutriplato') {
      const isNutriTimedPlay =
        nutriPlatoView === 'playing' &&
        nutriPlatoMode === 'timed' &&
        screenState === 'playing' &&
        !nutriPlatoTimeUp;
      setBgmTheme(isNutriTimedPlay ? 'suspense' : 'cheerful');
    } else if (activeApp === 'library' || activeApp === 'superpower') {
      setBgmTheme('cheerful');
    }
  }, [activeApp, nutriPlatoView, nutriPlatoMode, screenState, nutriPlatoTimeUp]);

  useEffect(() => {
    if (!isNutriPlatoTimerRunning) return;

    const intervalId = window.setInterval(() => {
      setNutriPlatoRemainingSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setNutriPlatoTimeUp(true);
          setSelectedFood(null);
          playTimeUpSound(soundEnabled);
        } else if (next <= 15) {
          playTimerTickSound(soundEnabled, true);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isNutriPlatoTimerRunning, soundEnabled]);

  // Brief coral/red warning flash auto-clear on Contrarreloj StarCapsuleProgressBar
  useEffect(() => {
    if (!nutriPlatoWarnFlash) return;
    const timer = window.setTimeout(() => setNutriPlatoWarnFlash(false), 620);
    return () => window.clearTimeout(timer);
  }, [nutriPlatoWarnFlash, nutriPlatoWarnKey]);

  // Sync cross-browser fullscreen state listener
  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(getNativeFullscreenElement());
      setNativeFullscreen(active);
      if (active) {
        setTvFallbackFullscreen(false);
        setFullscreenHint(null);
      }
    };
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ] as const;
    events.forEach((evt) => document.addEventListener(evt, onFsChange));
    onFsChange();
    return () => {
      events.forEach((evt) => document.removeEventListener(evt, onFsChange));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (fullscreenHintTimerRef.current !== null) {
        window.clearTimeout(fullscreenHintTimerRef.current);
      }
    };
  }, []);

  const showFullscreenHint = useCallback((message: string) => {
    setFullscreenHint(message);
    if (fullscreenHintTimerRef.current !== null) {
      window.clearTimeout(fullscreenHintTimerRef.current);
    }
    fullscreenHintTimerRef.current = window.setTimeout(() => {
      setFullscreenHint(null);
      fullscreenHintTimerRef.current = null;
    }, 5200);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (getNativeFullscreenElement()) {
      await exitNativeFullscreen();
      setNativeFullscreen(false);
      setTvFallbackFullscreen(false);
      setFullscreenHint(null);
      return;
    }

    if (tvFallbackFullscreen) {
      setTvFallbackFullscreen(false);
      setFullscreenHint(null);
      return;
    }

    // Attempt native browser Fullscreen API (documentElement first, then body)
    const enteredRoot = await requestNativeFullscreen(document.documentElement);
    if (enteredRoot) {
      setNativeFullscreen(true);
      setTvFallbackFullscreen(false);
      setFullscreenHint(null);
      return;
    }

    const enteredBody = document.body
      ? await requestNativeFullscreen(document.body)
      : false;
    if (enteredBody) {
      setNativeFullscreen(true);
      setTvFallbackFullscreen(false);
      setFullscreenHint(null);
      return;
    }

    // Native fullscreen is blocked (e.g. embedded preview iframe without allow="fullscreen"):
    // Activate clean TV mode fallback and inform the user clearly how to trigger OS fullscreen
    setTvFallbackFullscreen(true);
    showFullscreenHint(
      'Modo TV activado · En vista previa integrada el navegador bloquea la pantalla completa; ábrela en pestaña nueva o presiona F11.'
    );
  }, [tvFallbackFullscreen, showFullscreenHint]);

  const resetNutriPlatoBoard = useCallback(() => {
    setPlate(createInitialPlate());
    setPlacements({ shield: [], protein: [], energy: [] });
    zCounterRef.current = BASE_PLATE_Z_INDEX;
    setSelectedFood(null);
    setActiveTab('all');
    setLastPlacedId(null);
    setLastPlacedInstanceId(null);
    setWiggleSector(null);
    setGuideTopic('general');
    setGuideOpen(false);
    setGuideFeedback(null);
    setNutriPlatoTimedProgress(0);
    setNutriPlatoTimeUp(false);
    setNutriPlatoWarnFlash(false);
  }, []);

  const launchNutriPlatoSession = useCallback(
    (
      mode: NutriPlatoPlayMode,
      minutes: NutriPlatoTimedDurationMinutes = nutriPlatoMinutes
    ) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      resetNutriPlatoBoard();
      setNutriPlatoMode(mode);
      setNutriPlatoMinutes(minutes);
      setNutriPlatoRemainingSeconds(minutes * 60);
      setNutriPlatoView('playing');
      setActiveApp('nutriplato');
      setScreenState('playing');
    },
    [nutriPlatoMinutes, resetNutriPlatoBoard]
  );

  const startGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    resetNutriPlatoBoard();
    setNutriPlatoReturnView('mode_select');
    setNutriPlatoView('guide');
    setActiveApp('nutriplato');
    setScreenState('playing');
  }, [resetNutriPlatoBoard]);

  const openNutriPlatoGuide = useCallback(
    (returnTo: 'mode_select' | 'playing') => {
      setSelectedFood(null);
      setGuideOpen(false);
      setNutriPlatoReturnView(returnTo);
      setNutriPlatoView('guide');
    },
    []
  );

  const openNutriPlatoModeSelector = useCallback(() => {
    setSelectedFood(null);
    setGuideOpen(false);
    setNutriPlatoTimeUp(false);
    setNutriPlatoView('mode_select');
    setScreenState('playing');
  }, []);

  const openSuperpowerGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setActiveApp('superpower');
    setScreenState('playing');
  }, []);

  const openSemaforoGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setActiveApp('semaforo');
    setScreenState('playing');
  }, []);

  const openLightningGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setActiveApp('lightning');
    setScreenState('playing');
  }, []);

  const resetCurrentPlate = useCallback(() => {
    playUiClickSound();
    setPlate(createInitialPlate());
    setPlacements({ shield: [], protein: [], energy: [] });
    zCounterRef.current = BASE_PLATE_Z_INDEX;
    setSelectedFood(null);
    setLastPlacedId(null);
    setLastPlacedInstanceId(null);
    setWiggleSector(null);
    setGuideTopic('general');
    setNutriPlatoTimedProgress(0);
    setNutriPlatoTimeUp(false);
    setNutriPlatoWarnFlash(false);
    if (nutriPlatoMode === 'timed') {
      setNutriPlatoRemainingSeconds(nutriPlatoMinutes * 60);
    }
    setScreenState('playing');
    setGuideFeedback({
      tone: 'info',
      title: '¡Plato limpio!',
      message: 'Elige alimentos variados para armar un nuevo plato saludable.',
    });
  }, [nutriPlatoMode, nutriPlatoMinutes]);

  const goToTitle = useCallback(() => {
    setSelectedFood(null);
    setNutriPlatoTimeUp(false);
    setActiveApp('library');
    setScreenState('title');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (volunteerOpen) {
        if (e.key === 'Escape') setVolunteerOpen(false);
        return;
      }

      if (
        activeApp === 'superpower' ||
        activeApp === 'semaforo' ||
        activeApp === 'lightning'
      ) {
        return;
      }

      if (screenState === 'title') {
        if (e.key === 'Escape' && tvFallbackFullscreen) {
          setTvFallbackFullscreen(false);
          setFullscreenHint(null);
          return;
        }
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          !(e.target instanceof HTMLButtonElement)
        ) {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (nutriPlatoView !== 'playing' || nutriPlatoTimeUp) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (e.key === 'Escape' && guideOpen) {
          setGuideOpen(false);
          return;
        }
        if (screenState === 'playing') {
          setScreenState('paused');
        } else if (screenState === 'paused') {
          setScreenState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeApp,
    screenState,
    volunteerOpen,
    guideOpen,
    tvFallbackFullscreen,
    nutriPlatoView,
    nutriPlatoTimeUp,
    startGame,
  ]);

  const triggerWiggle = useCallback((sector: SectorId | 'all') => {
    setWiggleSector(sector);
    window.setTimeout(() => {
      setWiggleSector((prev) => (prev === sector ? null : prev));
    }, 450);
  }, []);

  const attemptPlaceFood = useCallback(
    (food: FoodItem, sector?: SectorId, dropContext?: DropPointContext) => {
      if (nutriPlatoTimeUp || screenState !== 'playing') {
        return;
      }

      const result = evaluateFoodPlacement(plate, food, sector);

      if (!result.accepted) {
        playGentleHintSound(soundEnabled);
        triggerWiggle(sector ?? 'all');

        // In Contrarreloj mode, mistakes drop the star capsule progress bar and flash coral-red
        if (nutriPlatoMode === 'timed' && result.reason !== 'duplicate_food') {
          const penalty = applyTimedPlacementDelta(nutriPlatoTimedProgress, false);
          setNutriPlatoTimedProgress(penalty.nextProgress);
          setNutriPlatoWarnFlash(true);
          setNutriPlatoWarnKey((k) => k + 1);
        }

        if (result.reason === 'distractor') {
          setGuideTopic('processed');
        } else if (result.targetSector) {
          setGuideTopic(result.targetSector);
        }

        setGuideFeedback({
          tone: 'warning',
          title:
            result.reason === 'distractor'
              ? `¡Ojo con ${food.name}!`
              : '¡Prueba en otro lugar!',
          message: result.message,
        });

        if (result.reason === 'distractor') {
          setStats((prev) => {
            const updated = recordDistractorLessonStats(
              prev,
              new Date().toISOString()
            );
            saveStats(updated);
            return updated;
          });
          setSelectedFood(null);
        }
        return;
      }

      setPlate(result.updatedPlate);
      setSelectedFood(null);
      setLastPlacedId(food.id);

      if (result.targetSector && result.targetSector !== 'hydration') {
        const targetSector = result.targetSector;
        const zIndex = zCounterRef.current;
        zCounterRef.current += 1;
        instanceCounterRef.current += 1;
        const instanceId = `${targetSector}-${food.id}-${instanceCounterRef.current}`;
        const placement = createPlatedTransform({
          instanceId,
          foodId: food.id,
          sector: targetSector,
          zIndex,
          dropContext,
        });
        setPlacements((prev) => ({
          ...prev,
          [targetSector]: [...prev[targetSector], placement].slice(
            -MAX_VISIBLE_PER_SECTOR
          ),
        }));
        setLastPlacedInstanceId(instanceId);
      } else {
        setLastPlacedInstanceId(null);
      }

      if (result.targetSector) {
        setGuideTopic(result.targetSector);
      }
      setGuideFeedback({
        tone: 'success',
        title: food.name,
        message: result.message.startsWith(`${food.name}: `)
          ? result.message.slice(food.name.length + 2)
          : result.message,
      });

      let wonNow = result.isPlateComplete;

      if (nutriPlatoMode === 'timed') {
        const gain = applyTimedPlacementDelta(nutriPlatoTimedProgress, true);
        setNutriPlatoTimedProgress(gain.nextProgress);
        setNutriPlatoCelebrateKey((k) => k + 1);
        wonNow = gain.isComplete;
      }

      if (wonNow) {
        playPlateCompleteSound(soundEnabled);

        setStats((prev) => {
          const updated = recordCompletedPlateStats(
            prev,
            result.updatedPlate,
            'free',
            new Date().toISOString()
          );
          saveStats(updated);
          return updated;
        });
        setTipIndex((prev) => prev + 1);

        window.setTimeout(() => {
          setScreenState('gameover');
        }, 1150);
      } else {
        playPlaceFoodSound(soundEnabled);
      }
    },
    [
      plate,
      soundEnabled,
      triggerWiggle,
      nutriPlatoMode,
      nutriPlatoTimedProgress,
      nutriPlatoTimeUp,
      screenState,
    ]
  );

  const handleSelectTab = useCallback((tab: FilterTab) => {
    playUiClickSound();
    setActiveTab(tab);
    setGuideTopic(TAB_TO_TOPIC[tab]);
    setGuideFeedback(null);
  }, []);

  const handleFoodClick = useCallback(
    (food: FoodItem) => {
      if (food.category === 'distractor') {
        attemptPlaceFood(food);
        return;
      }

      const nextSelected = selectedFood?.id === food.id ? null : food;
      setSelectedFood(nextSelected);
      if (food.targetSector) {
        setGuideTopic(food.targetSector);
      }
      if (nextSelected) {
        setGuideFeedback({
          tone: 'info',
          title: `${food.name} · ${food.superpower}`,
          message: `${food.speechText} ¡Ahora toca su lugar en el plato!`,
        });
      } else {
        setGuideFeedback(null);
      }
    },
    [selectedFood, attemptPlaceFood]
  );

  const handleFoodDragStart = useCallback((food: FoodItem) => {
    setSelectedFood(food);
    if (food.targetSector) {
      setGuideTopic(food.targetSector);
    }
  }, []);

  const handleDropFood = useCallback(
    (foodId: string, sector: SectorId, dropContext?: DropPointContext) => {
      const food = FOODS.find((f) => f.id === foodId);
      if (!food) return;
      attemptPlaceFood(food, sector, dropContext);
    },
    [attemptPlaceFood]
  );

  const handleSectorClick = useCallback(
    (sector: SectorId, dropContext?: DropPointContext) => {
      setGuideTopic(sector);
      if (!selectedFood) {
        setGuideFeedback(null);
        return;
      }

      attemptPlaceFood(selectedFood, sector, dropContext);
    },
    [selectedFood, attemptPlaceFood]
  );

  const handleRemoveFood = useCallback(
    (sector: SectorId, itemIndex?: number) => {
      setPlate((prev) => removeFoodFromPlate(prev, sector, itemIndex));
      if (sector !== 'hydration') {
        setPlacements((prev) => ({
          ...prev,
          [sector]:
            typeof itemIndex === 'number'
              ? prev[sector].filter((_, idx) => idx !== itemIndex)
              : prev[sector].slice(0, -1),
        }));
      }
      if (nutriPlatoMode === 'timed') {
        setNutriPlatoTimedProgress((prev) => applyTimedRemovalDelta(prev));
      }
      setLastPlacedId(null);
      setLastPlacedInstanceId(null);
      setGuideTopic(sector);
      setGuideFeedback({
        tone: 'info',
        title: 'Alimento retirado',
        message: '¡Puedes elegir otra rica opción de tu bandeja!',
      });
    },
    [nutriPlatoMode]
  );

  const handleBringFoodToFront = useCallback(
    (sector: PlateFoodSector, instanceId: string) => {
      setPlacements((prev) => {
        const { updated, nextZIndex } = bringTransformToFront(
          prev,
          sector,
          instanceId
        );
        zCounterRef.current = Math.max(zCounterRef.current, nextZIndex + 1);
        return updated;
      });
    },
    []
  );

  const handleMoveFood = useCallback(
    (
      sector: PlateFoodSector,
      instanceId: string,
      localX: number,
      localY: number
    ) => {
      setPlacements((prev) => ({
        ...prev,
        [sector]: prev[sector].map((item) =>
          item.instanceId === instanceId ? { ...item, localX, localY } : item
        ),
      }));
    },
    []
  );

  const handleWheelResizeFood = useCallback(
    (sector: PlateFoodSector, instanceId: string, deltaY: number) => {
      setPlacements((prev) => ({
        ...prev,
        [sector]: prev[sector].map((item) =>
          item.instanceId === instanceId
            ? { ...item, scale: computeWheelScale(item.scale, deltaY) }
            : item
        ),
      }));
    },
    []
  );

  const handleRotateFood = useCallback(
    (sector: PlateFoodSector, instanceId: string, rotation: number) => {
      setPlacements((prev) => ({
        ...prev,
        [sector]: prev[sector].map((item) =>
          item.instanceId === instanceId ? { ...item, rotation } : item
        ),
      }));
    },
    []
  );

  const handleArrangePlate = useCallback(() => {
    setPlacements((prev) => reorganizarPlatoCoherente(prev));
    playPlaceFoodSound(soundEnabled);
    setGuideFeedback({
      tone: 'success',
      title: '¡Plato acomodado!',
      message: 'Todos los alimentos se organizaron de forma armónica y deliciosa.',
    });
  }, [soundEnabled]);

  const visibleFoods = useMemo(
    () => filterFoods(FOODS, 'free', activeTab),
    [activeTab]
  );

  const placedIds = useMemo(() => {
    const ids = new Set<string>();
    plate.shield.forEach((f) => ids.add(f.id));
    getProteinItems(plate).forEach((f) => ids.add(f.id));
    getEnergyItems(plate).forEach((f) => ids.add(f.id));
    if (plate.hydration) ids.add(plate.hydration.id);
    return ids;
  }, [plate]);

  const filledCount = countFilledSlots(plate);

  const handleResetStats = useCallback(() => {
    const fresh = createInitialVolunteerStats();
    setStats(fresh);
    saveStats(fresh);
  }, []);

  const fullscreenNotice = fullscreenHint ? (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000] max-w-[92vw] sm:max-w-xl px-4 py-2.5 rounded-2xl bg-[#1E1B2E] text-[#ffffff] border-2 border-[#fee330] shadow-[0_6px_0_rgba(30,27,46,0.35)] flex items-center gap-3 animate-guide-fade-slide"
    >
      <span className="text-xs sm:text-sm font-extrabold leading-snug">
        {fullscreenHint}
      </span>
      <button
        type="button"
        onClick={() => setFullscreenHint(null)}
        aria-label="Cerrar aviso"
        className="shrink-0 w-7 h-7 rounded-xl bg-[#ffffff]/15 hover:bg-[#ffffff]/25 text-[#fee330] font-black text-sm flex items-center justify-center cursor-pointer"
      >
        ✕
      </button>
    </div>
  ) : null;

  if (activeApp === 'library' || screenState === 'title') {
    return (
      <>
        <TitleScreen
          isFullscreen={isFullscreen}
          onStartGame={startGame}
          onStartSuperpower={openSuperpowerGame}
          onStartSemaforo={openSemaforoGame}
          onStartLightning={openLightningGame}
          onToggleFullscreen={toggleFullscreen}
          onOpenVolunteer={() => setVolunteerOpen(true)}
        />
        {volunteerOpen && (
          <VolunteerPanel
            stats={stats}
            onClose={() => setVolunteerOpen(false)}
            onResetStats={handleResetStats}
          />
        )}
        {fullscreenNotice}
      </>
    );
  }

  if (activeApp === 'superpower') {
    return (
      <>
        <SuperpowerCardsGame
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBackToLibrary={goToTitle}
        />
        {fullscreenNotice}
      </>
    );
  }

  if (activeApp === 'semaforo') {
    return (
      <>
        <SemaforoGame
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBackToLibrary={goToTitle}
        />
        {fullscreenNotice}
      </>
    );
  }

  if (activeApp === 'lightning') {
    return (
      <>
        <LightningQuizGame
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBackToLibrary={goToTitle}
        />
        {fullscreenNotice}
      </>
    );
  }

  if (nutriPlatoView === 'guide') {
    return (
      <>
        <MinigameTutorialScreen
          gameTitle="NutriPlato"
          slides={NUTRIPLATO_TUTORIAL_SLIDES}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBackToLibrary={goToTitle}
          onOpenModeSelector={openNutriPlatoModeSelector}
          ctaLabel={
            nutriPlatoReturnView === 'playing'
              ? 'Volver al Plato'
              : '¡Entendido, a Jugar!'
          }
          onFinishTutorial={() => setNutriPlatoView(nutriPlatoReturnView)}
          testId="nutriplato-guide-screen"
        />
        {fullscreenNotice}
      </>
    );
  }

  if (nutriPlatoView === 'mode_select') {
    return (
      <>
        <NutriPlatoModeSelector
          currentMode={nutriPlatoMode}
          selectedMinutes={nutriPlatoMinutes}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBackToLibrary={goToTitle}
          onBackToGuide={() => openNutriPlatoGuide('mode_select')}
          onSelectEducational={() => launchNutriPlatoSession('educational')}
          onConfirmTimed={(mins) => launchNutriPlatoSession('timed', mins)}
        />
        {fullscreenNotice}
      </>
    );
  }

  const isNutriPlatoUrgent =
    nutriPlatoMode === 'timed' &&
    isNutriPlatoTimeUrgent(nutriPlatoRemainingSeconds);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#8bfffe] grid grid-cols-1 lg:grid-cols-[1fr_330px] xl:grid-cols-[1fr_365px]">
      {/* LEFT / CENTER PLAYFIELD: Solid #8bfffe Canvas + Clean Header + Centered Expanded Plate + Bottom-Right Lightbulb */}
      <div className="relative h-full bg-[#8bfffe] flex flex-col justify-between p-3 sm:p-4 xl:p-5 overflow-hidden min-w-0">
        {/* Clean Top Utility Header */}
        <header className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 ml-[4px]">
            <button
              type="button"
              onClick={goToTitle}
              aria-label="Volver a la biblioteca"
              title="Biblioteca de juegos"
              className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#8137ea]"
            >
              <Home className="w-5 h-5 pointer-events-none" aria-hidden="true" />
            </button>
            <h1 className="font-display title-nutriplato-brand text-2xl sm:text-3xl font-bold leading-none truncate py-0.5">
              NutriPlato
            </h1>
          </div>

          {/* CENTER HUD: Shown ONLY in Contrarreloj mode (StarCapsuleProgressBar + MM:SS Countdown) */}
          {nutriPlatoMode === 'timed' && (
            <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 order-last xl:order-none w-full xl:w-auto">
              <StarCapsuleProgressBar
                progress={nutriPlatoTimedProgress}
                size="md"
                isWarningFlash={nutriPlatoWarnFlash}
                warningFlashKey={nutriPlatoWarnKey}
                celebrateKey={nutriPlatoCelebrateKey}
                ariaLabel={`Progreso NutriPlato Contrarreloj: ${nutriPlatoTimedProgress}%`}
                testId="nutriplato-timed-progress-bar"
              />

              <div
                data-testid="nutriplato-timer-badge"
                aria-live="off"
                className={`px-3 sm:px-3.5 py-1.5 rounded-2xl border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center gap-1.5 shrink-0 font-display font-bold text-base sm:text-lg tabular-nums ${
                  isNutriPlatoUrgent
                    ? 'bg-[#fc3e7e] text-[#ffffff] animate-semaforo-timer-urgent'
                    : 'bg-[#ffffff] text-[#1E1B2E]'
                }`}
              >
                <Timer
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    isNutriPlatoUrgent ? 'text-[#fee330]' : 'text-[#fc3e7e]'
                  }`}
                  aria-hidden="true"
                />
                <span>{formatNutriPlatoTime(nutriPlatoRemainingSeconds)}</span>
              </div>
            </div>
          )}

          {/* Top-Right Utility Controls: Instructivo + Modo de Juego + Reset + Fullscreen */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-testid="nutriplato-guide-btn"
              onClick={() => openNutriPlatoGuide('playing')}
              aria-label="Ver instructivo"
              title="Ver Instructivo"
              className="font-display px-3 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-sm sm:text-base font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#8137ea]"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#8137ea] shrink-0" aria-hidden="true" />
              <span className="hidden xl:inline">Instructivo</span>
            </button>

            <button
              type="button"
              data-testid="nutriplato-mode-btn"
              onClick={openNutriPlatoModeSelector}
              title="Cambiar Modo de Juego"
              className="font-display px-3 sm:px-4 py-2 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-sm sm:text-base font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#8137ea]"
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Modo de Juego</span>
            </button>

            <button
              type="button"
              onClick={resetCurrentPlate}
              aria-label="Reiniciar plato"
              title="Reiniciar plato"
              className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#8137ea]"
            >
              <RotateCcw className="w-5 h-5 pointer-events-none" aria-hidden="true" />
            </button>

            <SoundToggleButton />

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-pressed={isFullscreen}
              aria-label={
                isFullscreen
                  ? 'Salir de pantalla completa'
                  : 'Pantalla completa para TV'
              }
              title={
                isFullscreen
                  ? 'Salir de pantalla completa'
                  : 'Pantalla completa (TV)'
              }
              className={`p-2.5 rounded-2xl border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] cursor-pointer hidden sm:flex transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#8137ea] ${
                isFullscreen
                  ? 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E]'
                  : 'bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff]'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 pointer-events-none" aria-hidden="true" />
              ) : (
                <Maximize2 className="w-5 h-5 pointer-events-none" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* CENTER STAGE: Spacious Centered Plate (no vertical bar in Educational or Contrarreloj) */}
        <main className="relative flex-1 flex items-center justify-center gap-2 sm:gap-4 min-h-0 py-1">
          <HealthyPlate
            plate={plate}
            placements={placements}
            selectedFood={selectedFood}
            wiggleSector={wiggleSector}
            lastPlacedId={lastPlacedId}
            lastPlacedInstanceId={lastPlacedInstanceId}
            onDropFood={handleDropFood}
            onSectorClick={handleSectorClick}
            onRemoveFood={handleRemoveFood}
            onBringFoodToFront={handleBringFoodToFront}
            onMoveFood={handleMoveFood}
            onWheelResizeFood={handleWheelResizeFood}
            onRotateFood={handleRotateFood}
            onArrangePlate={handleArrangePlate}
          />
        </main>

        {/* BOTTOM-RIGHT LIGHTBULB BUTTON & POPUP MODAL */}
        <NutritionGuideCard
          topic={guideTopic}
          isOpen={guideOpen}
          feedback={guideFeedback}
          onToggleOpen={() => setGuideOpen((prev) => !prev)}
          onSelectTopic={(t) => {
            setGuideTopic(t);
            setGuideFeedback(null);
          }}
        />
      </div>

      {/* RIGHT PANEL: Narrow 2-Column Floating Food Shelf */}
      <div className="h-full overflow-hidden">
        <FoodTray
          foods={visibleFoods}
          activeTab={activeTab}
          selectedFood={selectedFood}
          placedIds={placedIds}
          onSelectTab={handleSelectTab}
          onFoodClick={handleFoodClick}
          onFoodDragStart={handleFoodDragStart}
        />
      </div>

      {/* PAUSE MODAL */}
      {screenState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-heading"
          className="fixed inset-0 z-40 bg-[#1E1B2E]/60 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[#ffffff] border-4 border-[#1E1B2E] rounded-3xl shadow-[0_10px_0_#1E1B2E] p-6 text-center flex flex-col gap-4">
            <h2 id="pause-heading" className="font-display text-3xl font-bold text-[#8137ea]">
              Juego en Pausa
            </h2>
            {nutriPlatoMode === 'timed' ? (
              <p className="text-base font-bold text-[#1E1B2E]">
                Llevas <span className="tabular-nums">{nutriPlatoTimedProgress}%</span> completado · Tiempo restante{' '}
                <span className="tabular-nums">{formatNutriPlatoTime(nutriPlatoRemainingSeconds)}</span>.
              </p>
            ) : (
              <p className="text-base font-bold text-[#1E1B2E]">
                Modo Educativo · Llevas{' '}
                <span className="tabular-nums">{filledCount}</span> de 5 grupos en tu plato.
              </p>
            )}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setScreenState('playing')}
                className="w-full py-3 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-lg font-black border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-0.5 cursor-pointer"
              >
                Continuar Jugando
              </button>
              <button
                type="button"
                onClick={resetCurrentPlate}
                className="w-full py-3 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-lg font-black border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-0.5 cursor-pointer"
              >
                Reiniciar Plato
              </button>
              <button
                type="button"
                onClick={openNutriPlatoModeSelector}
                className="w-full py-3 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-base font-extrabold border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-0.5 cursor-pointer"
              >
                Cambiar Modo de Juego
              </button>
              <button
                type="button"
                onClick={goToTitle}
                className="w-full py-3 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-base font-extrabold border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-0.5 cursor-pointer"
              >
                Volver a la Biblioteca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTRARRELOJ TIME-UP MODAL */}
      {nutriPlatoMode === 'timed' && nutriPlatoTimeUp && screenState !== 'gameover' && (
        <NutriPlatoTimeUpModal
          progress={nutriPlatoTimedProgress}
          timedMinutes={nutriPlatoMinutes}
          onRetryTimed={() => launchNutriPlatoSession('timed', nutriPlatoMinutes)}
          onChangeMode={openNutriPlatoModeSelector}
        />
      )}

      {/* VICTORY MODAL */}
      {screenState === 'gameover' && (
        <VictoryModal
          plate={plate}
          mode="free"
          tipIndex={tipIndex}
          timedSummary={
            nutriPlatoMode === 'timed'
              ? {
                  minutes: nutriPlatoMinutes,
                  remainingSeconds: nutriPlatoRemainingSeconds,
                }
              : undefined
          }
          onPlayAgain={() =>
            launchNutriPlatoSession(nutriPlatoMode, nutriPlatoMinutes)
          }
          onChangeMode={openNutriPlatoModeSelector}
          onGoTitle={goToTitle}
          onOpenVolunteer={() => setVolunteerOpen(true)}
        />
      )}

      {/* VOLUNTEER PANEL MODAL */}
      {volunteerOpen && (
        <VolunteerPanel
          stats={stats}
          onClose={() => setVolunteerOpen(false)}
          onResetStats={handleResetStats}
        />
      )}

      {fullscreenNotice}
    </div>
  );
}
