import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Gamepad2,
  Home,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Star,
  Timer,
  Trophy,
  X,
} from 'lucide-react';
import {
  SEMAFORO_FOODS,
  SemaforoFoodItem,
  TRAFFIC_LIGHT_RULES,
  TrafficLightColor,
} from '../data/semaforoFoods';
import {
  computeSemaforoProgress,
  dealSemaforoRound,
  DEFAULT_TIMED_DURATION_MINUTES,
  evaluateSemaforoDrop,
  formatSemaforoCountdown,
  isCountdownUrgent,
  isSemaforoComplete,
  SemaforoGameMode,
  SemaforoRoundState,
  SemaforoTimedDurationMinutes,
} from '../game/semaforoRules';
import {
  playGentleHintSound,
  playPlaceFoodSound,
  playPlateCompleteSound,
  playTimerTickSound,
  playTimeUpSound,
} from '../utils/plateAudio';
import {
  playTutorialStepSound,
  playUiClickSound,
  setBgmTheme,
} from '../utils/soundSystem';
import { FoodIllustration } from './FoodIllustration';
import { SemaforoModeSelector, SemaforoTimeUpModal } from './SemaforoModeSelector';
import { SoundToggleButton } from './SoundToggleButton';

interface SemaforoGameProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onBackToLibrary: () => void;
}

type SemaforoPhase = 'guide' | 'mode' | 'playing';

const CONFETTI_PIECES = [
  { left: '6%', color: '#fc3e7e', delay: '0s', duration: '2.3s' },
  { left: '14%', color: '#fee330', delay: '0.2s', duration: '2.6s' },
  { left: '24%', color: '#5dd118', delay: '0.1s', duration: '2.4s' },
  { left: '34%', color: '#8137ea', delay: '0.35s', duration: '2.7s' },
  { left: '44%', color: '#ffffff', delay: '0.15s', duration: '2.5s' },
  { left: '54%', color: '#fc3e7e', delay: '0.25s', duration: '2.4s' },
  { left: '64%', color: '#fee330', delay: '0.05s', duration: '2.6s' },
  { left: '74%', color: '#5dd118', delay: '0.3s', duration: '2.5s' },
  { left: '84%', color: '#8137ea', delay: '0.18s', duration: '2.7s' },
  { left: '93%', color: '#fee330', delay: '0.28s', duration: '2.35s' },
];

const LANE_ORDER: TrafficLightColor[] = ['red', 'yellow', 'green'];

const FLOATING_FOOD_PRESETS = [
  { rotate: -6, translateY: -6 },
  { rotate: 5, translateY: 7 },
  { rotate: -4, translateY: -5 },
  { rotate: 7, translateY: 6 },
];

const HORIZONTAL_LIQUID_BUBBLES = [
  { left: '12%', bottom: '18%', size: 6, delay: '0s', duration: '2.4s' },
  { left: '28%', bottom: '32%', size: 8, delay: '0.55s', duration: '2.9s' },
  { left: '44%', bottom: '20%', size: 5, delay: '1.1s', duration: '2.2s' },
  { left: '60%', bottom: '28%', size: 7, delay: '0.35s', duration: '2.7s' },
  { left: '76%', bottom: '16%', size: 6, delay: '1.45s', duration: '2.5s' },
  { left: '88%', bottom: '30%', size: 5, delay: '0.85s', duration: '2.3s' },
];

const HORIZONTAL_SURGE_BUBBLES = [
  { left: '16%', bottom: '14%', size: 7, delay: '0s', duration: '1.1s' },
  { left: '36%', bottom: '22%', size: 8, delay: '0.07s', duration: '1.2s' },
  { left: '56%', bottom: '18%', size: 6, delay: '0.12s', duration: '1.05s' },
  { left: '74%', bottom: '24%', size: 8, delay: '0.16s', duration: '1.25s' },
  { left: '86%', bottom: '16%', size: 6, delay: '0.2s', duration: '1.15s' },
];

function getHorizontalLiquidTheme(percent: number): {
  gradient: string;
  waveColor: string;
  glowColor: string;
} {
  if (percent >= 100) {
    return {
      gradient:
        'linear-gradient(90deg, #fee330 0%, #5dd118 35%, #4efcfb 68%, #fc3e7e 100%)',
      waveColor: '#fc3e7e',
      glowColor: 'rgba(254, 227, 48, 0.85)',
    };
  }
  if (percent >= 75) {
    return {
      gradient: 'linear-gradient(90deg, #fee330 0%, #6ee724 55%, #22d3ee 100%)',
      waveColor: '#22d3ee',
      glowColor: 'rgba(34, 211, 238, 0.65)',
    };
  }
  if (percent >= 45) {
    return {
      gradient: 'linear-gradient(90deg, #fee330 0%, #98e020 50%, #5dd118 100%)',
      waveColor: '#5dd118',
      glowColor: 'rgba(93, 209, 24, 0.55)',
    };
  }
  return {
    gradient: 'linear-gradient(90deg, #f97316 0%, #fbbf24 52%, #fee330 100%)',
    waveColor: '#fee330',
    glowColor: 'rgba(254, 227, 48, 0.6)',
  };
}

const MiniTrafficLightIcon: React.FC<{ active: TrafficLightColor }> = ({
  active,
}) => (
  <svg viewBox="0 0 42 86" className="w-8 h-16 shrink-0" aria-hidden="true">
    <rect
      x="4"
      y="4"
      width="34"
      height="78"
      rx="12"
      fill="#2B2B2B"
      stroke="#1E1B2E"
      strokeWidth="3.5"
    />
    <circle
      cx="21"
      cy="20"
      r="9"
      fill={active === 'red' ? '#fc3e7e' : '#584E68'}
      stroke="#1E1B2E"
      strokeWidth="2.5"
    />
    {active === 'red' && (
      <path
        d="M15.5 16.5 A6 6 0 0 1 20 13.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    )}
    <circle
      cx="21"
      cy="43"
      r="9"
      fill={active === 'yellow' ? '#fee330' : '#584E68'}
      stroke="#1E1B2E"
      strokeWidth="2.5"
    />
    {active === 'yellow' && (
      <path
        d="M15.5 39.5 A6 6 0 0 1 20 36.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    )}
    <circle
      cx="21"
      cy="66"
      r="9"
      fill={active === 'green' ? '#5dd118' : '#584E68'}
      stroke="#1E1B2E"
      strokeWidth="2.5"
    />
    {active === 'green' && (
      <path
        d="M15.5 62.5 A6 6 0 0 1 20 59.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const TrafficLightLensUnit: React.FC<{
  color: TrafficLightColor;
  isLit: boolean;
  isConfirmed: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  clickable: boolean;
}> = ({
  color,
  isLit,
  isConfirmed,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  clickable,
}) => {
  const palette =
    color === 'red'
      ? {
          core: '#FFE4EC',
          top: '#FF8AA8',
          mid: '#ff2454',
          edge: '#be123c',
          rimBounce: '#fda4af',
          glowColor: '#ff2e55',
          haloRgba: 'rgba(255, 46, 85, 0.92)',
          breatheDelay: '0s',
        }
      : color === 'yellow'
        ? {
            core: '#FFFDF0',
            top: '#FFF38A',
            mid: '#fee330',
            edge: '#d97706',
            rimBounce: '#fef08a',
            glowColor: '#fee330',
            haloRgba: 'rgba(254, 227, 48, 0.94)',
            breatheDelay: '0.8s',
          }
        : {
            core: '#F4FFE6',
            top: '#B6FF68',
            mid: '#5dd118',
            edge: '#15803d',
            rimBounce: '#bbf7d0',
            glowColor: '#5dd118',
            haloRgba: 'rgba(93, 209, 24, 0.92)',
            breatheDelay: '1.6s',
          };

  const gradId = `sem-lens-${color}`;
  const haloGradId = `sem-halo-${color}`;
  const visorGradL = `sem-visor-l-${color}`;
  const visorGradR = `sem-visor-r-${color}`;
  const bezelGradId = `sem-bezel-${color}`;
  const isHighlighted = isLit || isConfirmed;

  return (
    <div
      data-testid={`traffic-light-lens-${color}`}
      data-lit="true"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`relative flex items-center justify-center w-full h-full ${
        clickable ? 'cursor-pointer' : ''
      }`}
    >
      <svg
        viewBox="0 0 220 138"
        className={`w-full h-full max-h-[154px] overflow-visible transition-transform duration-200 ${
          isHighlighted ? 'scale-[1.07]' : 'scale-100'
        }`}
        aria-hidden="true"
      >
        <defs>
          {/* Multi-stop optical crystal lens gradient */}
          <radialGradient id={gradId} cx="38%" cy="34%" r="68%">
            <stop offset="0%" stopColor={palette.core} />
            <stop offset="22%" stopColor={palette.top} />
            <stop offset="62%" stopColor={palette.mid} />
            <stop offset="100%" stopColor={palette.edge} />
          </radialGradient>

          {/* Soft ambient glowing aura */}
          <radialGradient id={haloGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="32%" stopColor={palette.glowColor} stopOpacity="0.88" />
            <stop offset="68%" stopColor={palette.glowColor} stopOpacity="0.34" />
            <stop offset="100%" stopColor={palette.glowColor} stopOpacity="0" />
          </radialGradient>

          {/* 3D shaded metallic bezel */}
          <linearGradient id={bezelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#434057" />
            <stop offset="45%" stopColor="#211f2e" />
            <stop offset="100%" stopColor="#12101b" />
          </linearGradient>

          {/* Left sculpted side visor gradient */}
          <linearGradient id={visorGradL} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4c4963" />
            <stop offset="40%" stopColor="#2d2b3c" />
            <stop offset="100%" stopColor="#171522" />
          </linearGradient>

          {/* Right sculpted side visor gradient */}
          <linearGradient id={visorGradR} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#46435b" />
            <stop offset="40%" stopColor="#282636" />
            <stop offset="100%" stopColor="#14121e" />
          </linearGradient>
        </defs>

        {/* Continuous Smooth Pulsing Ambient Halo on All 3 Lights */}
        <circle
          cx="110"
          cy="69"
          r={isHighlighted ? 84 : 74}
          fill={`url(#${haloGradId})`}
          className="animate-semaforo-glow-breathe"
          style={{
            animationDelay: palette.breatheDelay,
            transition: 'r 240ms ease',
          }}
        />

        {/* Sculpted Left 3D Side Visor (Alero Izquierdo) */}
        <path
          d="M 48 25 C 23 26, 10 42, 14 66 C 17 82, 31 89, 46 80 L 49 52 Z"
          fill={`url(#${visorGradL})`}
          stroke="#1E1B2E"
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <path
          d="M 20 45 C 24 36, 32 31, 43 31"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.28"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 21 69 C 24 76, 32 79, 43 74"
          fill="none"
          stroke="#0d0b14"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Sculpted Right 3D Side Visor (Alero Derecho) */}
        <path
          d="M 172 25 C 197 26, 210 42, 206 66 C 203 82, 189 89, 174 80 L 171 52 Z"
          fill={`url(#${visorGradR})`}
          stroke="#1E1B2E"
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <path
          d="M 200 45 C 196 36, 188 31, 177 31"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.24"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 199 69 C 196 76, 188 79, 177 74"
          fill="none"
          stroke="#0d0b14"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Outer Shaded 3D Recessed Bezel Ring */}
        <circle
          cx="110"
          cy="69"
          r="48"
          fill={`url(#${bezelGradId})`}
          stroke="#1E1B2E"
          strokeWidth="4.5"
        />
        {/* Subtle metallic inner bevel highlight on bottom rim */}
        <path
          d="M 76 101 A 46 46 0 0 0 144 101"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.18"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Overhanging Upper Visor Hood Inside Bezel */}
        <path
          d="M 67 60 A 44 44 0 0 1 153 60 C 142 42, 78 42, 67 60 Z"
          fill="#0c0a14"
          opacity="0.88"
        />

        {/* Permanently Illuminated 3D Optical Glass Lens */}
        <circle
          cx="110"
          cy="69"
          r="39.5"
          fill={`url(#${gradId})`}
          stroke={isHighlighted ? '#ffffff' : '#1E1B2E'}
          strokeWidth={isHighlighted ? 3.8 : 3.2}
          style={{
            filter: isHighlighted
              ? `drop-shadow(0 0 22px ${palette.glowColor}) drop-shadow(0 0 42px ${palette.haloRgba})`
              : `drop-shadow(0 0 14px ${palette.glowColor}) drop-shadow(0 0 26px ${palette.haloRgba})`,
            transition: 'filter 240ms ease, stroke 200ms ease',
          }}
        />

        {/* Subtle Concentric Fresnel Optical Glass Rings */}
        <circle
          cx="110"
          cy="69"
          r="31"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.16"
          strokeWidth="1.4"
        />
        <circle
          cx="110"
          cy="69"
          r="21"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />

        {/* Soft Cast Shadow from Upper Hood Across Top of Glass Lens */}
        <path
          d="M 74 56 A 38 38 0 0 1 146 56 A 42 28 0 0 0 74 56 Z"
          fill="#1E1B2E"
          opacity="0.22"
        />

        {/* Crisp Curved White Crystal Specular Arc (Top-Left) */}
        <path
          d="M 81 55 A 31 31 0 0 1 107 37"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6.2"
          strokeLinecap="round"
          opacity="0.96"
        />
        <circle cx="77" cy="64" r="3.4" fill="#ffffff" opacity="0.95" />

        {/* Secondary Warm Internal Crystal Bounce Arc (Bottom-Right) */}
        <path
          d="M 116 99 A 30 30 0 0 0 138 78"
          fill="none"
          stroke={palette.rimBounce}
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.78"
        />

        {/* Subtle Luminous Sparkle Rays When Actively Targeted */}
        {isHighlighted && (
          <g className="pointer-events-none animate-semaforo-glow-breathe">
            <line x1="110" y1="6" x2="110" y2="16" stroke="#ffffff" strokeWidth="3.8" strokeLinecap="round" />
            <line x1="110" y1="122" x2="110" y2="132" stroke="#ffffff" strokeWidth="3.8" strokeLinecap="round" />
            <line x1="48" y1="26" x2="56" y2="34" stroke={palette.glowColor} strokeWidth="3.8" strokeLinecap="round" />
            <line x1="172" y1="26" x2="164" y2="34" stroke={palette.glowColor} strokeWidth="3.8" strokeLinecap="round" />
            <line x1="48" y1="112" x2="56" y2="104" stroke={palette.glowColor} strokeWidth="3.8" strokeLinecap="round" />
            <line x1="172" y1="112" x2="164" y2="104" stroke={palette.glowColor} strokeWidth="3.8" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};

const SparkleBurst: React.FC<{ color: string }> = React.memo(({ color }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 740);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dirs = [
    { tx: '-32px', ty: '-28px' },
    { tx: '34px', ty: '-24px' },
    { tx: '-34px', ty: '22px' },
    { tx: '32px', ty: '26px' },
    { tx: '0px', ty: '-36px' },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
      aria-hidden="true"
    >
      {dirs.map((d, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          className="w-5 h-5 absolute animate-star-burst pointer-events-none"
          style={
            {
              '--tx': d.tx,
              '--ty': d.ty,
            } as React.CSSProperties
          }
        >
          <path
            d="M12 2 L14.8 9 L22 9.5 L16.4 14.2 L18.2 21.5 L12 17.4 L5.8 21.5 L7.6 14.2 L2 9.5 L9.2 9 Z"
            fill={idx % 2 === 0 ? '#fee330' : color}
            stroke="#1E1B2E"
            strokeWidth="1.8"
          />
        </svg>
      ))}
    </div>
  );
});

interface FocusedFood3DShowcaseProps {
  foodId: string;
  foodName: string;
}

const FocusedFood3DShowcase: React.FC<FocusedFood3DShowcaseProps> = React.memo(({
  foodId,
  foodName,
}) => {
  const [tapPulseKey, setTapPulseKey] = useState<number>(0);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setTapPulseKey((prev) => prev + 1);
  };

  return (
    <div
      className="aaa-food-3d-scene relative flex items-center justify-center w-[clamp(340px,70vh,620px)] h-[clamp(340px,70vh,620px)] max-w-[86vw] max-h-full"
      onClick={handleTap}
      role="img"
      aria-label={`Ilustración 3D animada de ${foodName}`}
    >
      <div
        key={tapPulseKey}
        className={`aaa-food-3d-target w-full h-full flex items-center justify-center ${
          tapPulseKey > 0 ? 'animate-aaa-card-tap' : ''
        }`}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 14px 20px rgba(30,27,46,0.24))',
          }}
        >
          <div className="alimento-3d-wrapper w-full h-full cursor-pointer">
            <FoodIllustration
              foodId={foodId}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const pickRandomFoodForLight = (
  light: TrafficLightColor,
  excludeId?: string
): SemaforoFoodItem => {
  const pool = SEMAFORO_FOODS.filter((f) => f.light === light);
  const candidates =
    excludeId && pool.length > 1
      ? pool.filter((f) => f.id !== excludeId)
      : pool;
  return candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
};

const GuideFood3DShowcase: React.FC<{
  food: SemaforoFoodItem;
  labelColor: string;
}> = React.memo(({ food, labelColor }) => {
  const [tapPulseKey, setTapPulseKey] = useState<number>(0);

  const handleTap = () => {
    setTapPulseKey((prev) => prev + 1);
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1 min-h-0 ml-[40px]">
      {/* Predominant Continuous 3D Floating Food Stage */}
      <div
        className="aaa-food-3d-scene relative flex items-center justify-center w-[clamp(290px,min(36vw,54vh),460px)] h-[clamp(290px,min(36vw,54vh),460px)] max-w-full max-h-[calc(100%_-_28px)] cursor-pointer select-none shrink-0"
        onClick={handleTap}
        role="img"
        aria-label={`Ilustración 3D animada de ${food.name}`}
      >
        {/* Subtle Grounded Contact Shadow Only (Radial Gradient, Zero GPU Blur) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 w-[62%] h-5 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(30,27,46,0.16) 0%, rgba(30,27,46,0) 72%)',
          }}
        />

        <div
          key={`${food.id}-${tapPulseKey}`}
          className={`aaa-food-3d-target relative z-10 w-full h-full flex items-center justify-center mt-0 ml-[40px] ${
            tapPulseKey > 0 ? 'animate-aaa-card-tap' : ''
          }`}
        >
          <div className="alimento-3d-wrapper relative w-full h-full cursor-pointer">
            <FoodIllustration
              foodId={food.foodId}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Crisp Food Title */}
      <span
        className="font-display text-lg sm:text-xl xl:text-2xl font-bold text-center leading-none tracking-tight shrink-0"
        style={{
          color: labelColor,
          textShadow: '0 2px 0 rgba(255,255,255,0.9)',
        }}
      >
        {food.name}
      </span>
    </div>
  );
});

export const SemaforoGame: React.FC<SemaforoGameProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onBackToLibrary,
}) => {
  const [phase, setPhase] = useState<SemaforoPhase>('guide');
  const [gameMode, setGameMode] = useState<SemaforoGameMode>('normal');
  const [timedMinutes, setTimedMinutes] = useState<SemaforoTimedDurationMinutes>(
    DEFAULT_TIMED_DURATION_MINUTES
  );
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    DEFAULT_TIMED_DURATION_MINUTES * 60
  );
  const [showTimeUpModal, setShowTimeUpModal] = useState<boolean>(false);
  const [guideSlideIdx, setGuideSlideIdx] = useState<number>(0);
  const [exitingSlideIdx, setExitingSlideIdx] = useState<number | null>(null);
  const [guideDirection, setGuideDirection] = useState<'next' | 'prev' | 'none'>('none');
  const [guideAnimKey, setGuideAnimKey] = useState<number>(0);
  const [guideFeaturedFoods, setGuideFeaturedFoods] = useState<
    Record<TrafficLightColor, SemaforoFoodItem>
  >(() => ({
    red: pickRandomFoodForLight('red'),
    yellow: pickRandomFoodForLight('yellow'),
    green: pickRandomFoodForLight('green'),
  }));
  const guideExitTimerRef = useRef<number | null>(null);
  const [roundState, setRoundState] = useState<SemaforoRoundState>(() =>
    dealSemaforoRound(SEMAFORO_FOODS)
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [isClosingFocus, setIsClosingFocus] = useState<boolean>(false);
  const [shakingCircleColor, setShakingCircleColor] =
    useState<TrafficLightColor | null>(null);
  const [confirmedCircleColor, setConfirmedCircleColor] =
    useState<TrafficLightColor | null>(null);
  const [focusHint, setFocusHint] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOverLight, setDragOverLight] = useState<TrafficLightColor | null>(null);
  const [hoverSelectLight, setHoverSelectLight] = useState<TrafficLightColor | null>(null);
  const [confirmedLight, setConfirmedLight] = useState<TrafficLightColor | null>(null);
  const [shakingItemId, setShakingItemId] = useState<string | null>(null);
  const [shakingLane, setShakingLane] = useState<TrafficLightColor | null>(null);
  const [lastPlacedId, setLastPlacedId] = useState<string | null>(null);
  const soundEnabled = true;
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const focusCloseTimerRef = useRef<number | null>(null);
  const focusConfirmTimerRef = useRef<number | null>(null);
  const trayScrollRef = useRef<HTMLDivElement>(null);
  const trayTrackRef = useRef<HTMLDivElement>(null);
  const trayThumbRef = useRef<HTMLDivElement>(null);
  const trayScrollbarRef = useRef<HTMLDivElement>(null);
  const focusedItemIdRef = useRef<string | null>(null);
  focusedItemIdRef.current = focusedItemId;
  const isTimeUpRef = useRef<boolean>(false);
  isTimeUpRef.current = showTimeUpModal;

  const conveyorStateRef = useRef<{
    offset: number;
    manualTarget: number;
    maxOffset: number;
    viewportHeight: number;
    trackHeight: number;
    thumbTravel: number;
    direction: 1 | -1;
    speedFactor: number;
    pausedByPointer: boolean;
    pausedByDrag: boolean;
    pausedByWheel: boolean;
    draggingThumb: boolean;
    thumbDragStartY: number;
    thumbDragStartOffset: number;
    wheelTimerId: number | null;
    lastTime: number;
  }>({
    offset: 0,
    manualTarget: 0,
    maxOffset: 0,
    viewportHeight: 0,
    trackHeight: 0,
    thumbTravel: 0,
    direction: 1,
    speedFactor: 0,
    pausedByPointer: false,
    pausedByDrag: false,
    pausedByWheel: false,
    draggingThumb: false,
    thumbDragStartY: 0,
    thumbDragStartOffset: 0,
    wheelTimerId: null,
    lastTime: 0,
  });

  // Smooth rolling liquid progress state (zero shake/vibration)
  const progress = computeSemaforoProgress(roundState);
  const isComplete = isSemaforoComplete(roundState);
  const isTrayEmpty = roundState.tray.length === 0;
  const liquidTheme = getHorizontalLiquidTheme(progress);
  const prevProgressRef = useRef<number>(progress);
  const [displayProgress, setDisplayProgress] = useState<number>(progress);
  const [progressCelebrateKey, setProgressCelebrateKey] = useState<number>(0);
  const [warningFlashKey, setWarningFlashKey] = useState<number>(0);
  const [isWarningFlash, setIsWarningFlash] = useState<boolean>(false);
  const [progressTrend, setProgressTrend] = useState<'idle' | 'up' | 'down'>('idle');
  const [resetSpinKey, setResetSpinKey] = useState<number>(0);
  const [showBubbleSurge, setShowBubbleSurge] = useState<boolean>(false);
  const [showCompleteConfetti, setShowCompleteConfetti] = useState<boolean>(false);
  const warningFlashTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isComplete) {
      setShowCompleteConfetti(false);
      return;
    }
    setShowCompleteConfetti(true);
    const timer = window.setTimeout(() => {
      setShowCompleteConfetti(false);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [isComplete]);

  useEffect(() => {
    return () => {
      if (warningFlashTimerRef.current !== null) {
        window.clearTimeout(warningFlashTimerRef.current);
      }
    };
  }, []);

  const triggerProgressWarning = useCallback(() => {
    setWarningFlashKey((k) => k + 1);
    setIsWarningFlash(true);
    setProgressTrend('down');
    if (warningFlashTimerRef.current !== null) {
      window.clearTimeout(warningFlashTimerRef.current);
    }
    warningFlashTimerRef.current = window.setTimeout(() => {
      setIsWarningFlash(false);
      setProgressTrend('idle');
      warningFlashTimerRef.current = null;
    }, 640);
  }, []);

  useEffect(() => {
    const start = prevProgressRef.current;
    const end = progress;
    const diff = end - start;

    let rafId = 0;
    const durationMs = diff < 0 ? 440 : 560;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayProgress(Math.round(start + diff * eased));
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    if (diff !== 0) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      setDisplayProgress(end);
    }

    let surgeTimer: number | undefined;
    if (diff > 0) {
      setProgressTrend('up');
      setProgressCelebrateKey((k) => k + 1);
      setShowBubbleSurge(true);
      surgeTimer = window.setTimeout(() => {
        setShowBubbleSurge(false);
        setProgressTrend((cur) => (cur === 'up' ? 'idle' : cur));
      }, 1100);
    } else if (diff < 0) {
      setShowBubbleSurge(false);
    }

    prevProgressRef.current = end;

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (surgeTimer !== undefined) window.clearTimeout(surgeTimer);
    };
  }, [progress]);

  // Refresh cached conveyor dimensions whenever tray item count changes
  useEffect(() => {
    if (phase !== 'playing') return;
    const viewport = trayScrollRef.current;
    const track = trayTrackRef.current;
    if (!viewport || !track) return;
    const raf = window.requestAnimationFrame(() => {
      const vpH = viewport.clientHeight;
      const trH = track.scrollHeight;
      const nextMax = Math.max(0, trH - vpH);
      const state = conveyorStateRef.current;
      state.viewportHeight = vpH;
      state.trackHeight = trH;
      state.maxOffset = nextMax;
      if (state.manualTarget > nextMax) {
        state.manualTarget = nextMax;
      }
      if (state.offset > nextMax) {
        state.offset = nextMax;
        track.style.transform = `translate3d(0, ${(-state.offset).toFixed(3)}px, 0)`;
      }
      const bar = trayScrollbarRef.current;
      const thumb = trayThumbRef.current;
      if (bar && thumb) {
        if (nextMax <= 1 || trH <= 0) {
          bar.style.opacity = '0';
          bar.style.pointerEvents = 'none';
          state.thumbTravel = 0;
        } else {
          bar.style.opacity = '1';
          bar.style.pointerEvents = 'auto';
          const barHeight = Math.max(20, bar.clientHeight);
          const thumbHeight = Math.max(36, Math.round(barHeight * Math.min(1, vpH / trH)));
          state.thumbTravel = Math.max(0, barHeight - thumbHeight);
          thumb.style.height = `${thumbHeight}px`;
          const thumbY = (state.offset / nextMax) * state.thumbTravel;
          thumb.style.transform = `translate3d(0, ${thumbY.toFixed(2)}px, 0)`;
        }
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [phase, roundState.tray.length]);

  // Ultra-fluid 60/120 FPS sub-pixel GPU-composited conveyor belt (translate3d, zero scrollTop pixel snapping)
  useEffect(() => {
    if (phase !== 'playing' || isTrayEmpty) return;
    const viewport = trayScrollRef.current;
    const track = trayTrackRef.current;
    if (!viewport || !track) return;

    const CRUISE_SPEED_PX_PER_SEC = 74;
    const EDGE_EASE_PX = 64;
    const WHEEL_RESUME_DELAY_MS = 480;
    const state = conveyorStateRef.current;

    // Pure GPU transform write — zero layout reads inside rAF
    const syncThumbPosition = () => {
      const thumb = trayThumbRef.current;
      if (!thumb || state.maxOffset <= 1 || state.thumbTravel <= 0) return;
      const thumbY = (state.offset / state.maxOffset) * state.thumbTravel;
      thumb.style.transform = `translate3d(0, ${thumbY.toFixed(2)}px, 0)`;
    };

    const updateBounds = () => {
      const vpH = viewport.clientHeight;
      const trH = track.scrollHeight;
      const nextMax = Math.max(0, trH - vpH);
      state.viewportHeight = vpH;
      state.trackHeight = trH;
      state.maxOffset = nextMax;
      if (state.manualTarget > nextMax) state.manualTarget = nextMax;
      if (state.offset > nextMax) state.offset = nextMax;

      const bar = trayScrollbarRef.current;
      const thumb = trayThumbRef.current;
      if (bar && thumb) {
        if (nextMax <= 1 || trH <= 0) {
          bar.style.opacity = '0';
          bar.style.pointerEvents = 'none';
          state.thumbTravel = 0;
        } else {
          bar.style.opacity = '1';
          bar.style.pointerEvents = 'auto';
          const barHeight = Math.max(20, bar.clientHeight);
          const ratio = Math.min(1, vpH / trH);
          const thumbHeight = Math.max(36, Math.round(barHeight * ratio));
          state.thumbTravel = Math.max(0, barHeight - thumbHeight);
          thumb.style.height = `${thumbHeight}px`;
          syncThumbPosition();
        }
      }
    };

    state.offset = 0;
    state.manualTarget = 0;
    state.direction = 1;
    state.speedFactor = 0;
    state.pausedByPointer = false;
    state.pausedByDrag = false;
    state.pausedByWheel = false;
    state.draggingThumb = false;
    state.lastTime = performance.now();
    track.style.transform = 'translate3d(0, 0px, 0)';
    updateBounds();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateBounds())
        : null;
    resizeObserver?.observe(viewport);
    resizeObserver?.observe(track);

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest('[data-semaforo-scrollbar]')) {
        return;
      }
      if (target?.closest('.food-option') || target === viewport) {
        state.pausedByPointer = true;
        state.manualTarget = state.offset;
      }
    };

    const handleThumbPointerDown = (e: PointerEvent) => {
      if (state.maxOffset <= 1) return;
      e.stopPropagation();
      e.preventDefault();
      state.draggingThumb = true;
      state.pausedByPointer = true;
      state.thumbDragStartY = e.clientY;
      state.thumbDragStartOffset = state.offset;
      state.manualTarget = state.offset;
    };

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!state.draggingThumb) return;
      if (state.maxOffset <= 1 || state.thumbTravel <= 0) return;
      const deltaY = e.clientY - state.thumbDragStartY;
      const nextOffset = Math.max(
        0,
        Math.min(
          state.maxOffset,
          state.thumbDragStartOffset + (deltaY / state.thumbTravel) * state.maxOffset
        )
      );
      state.manualTarget = nextOffset;
    };

    const handlePointerRelease = () => {
      if (state.draggingThumb) {
        state.draggingThumb = false;
      }
      if (state.pausedByPointer) {
        state.pausedByPointer = false;
        state.manualTarget = state.offset;
        state.lastTime = performance.now();
      }
    };

    const handleDragStart = () => {
      state.pausedByDrag = true;
      state.manualTarget = state.offset;
    };

    const handleDragEndOrDrop = () => {
      if (state.pausedByDrag || state.pausedByPointer) {
        state.pausedByDrag = false;
        state.pausedByPointer = false;
        state.manualTarget = state.offset;
        state.lastTime = performance.now();
      }
    };

    const handleWindowBlur = () => {
      if (state.pausedByPointer || state.pausedByDrag || state.draggingThumb) {
        state.pausedByPointer = false;
        state.pausedByDrag = false;
        state.draggingThumb = false;
        state.manualTarget = state.offset;
        state.lastTime = performance.now();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (state.maxOffset <= 1) return;
      e.preventDefault();
      if (!state.pausedByWheel) {
        state.manualTarget = state.offset;
      }
      state.pausedByWheel = true;
      state.manualTarget = Math.max(
        0,
        Math.min(state.maxOffset, state.manualTarget + e.deltaY * 0.9)
      );
      if (state.wheelTimerId !== null) {
        window.clearTimeout(state.wheelTimerId);
      }
      state.wheelTimerId = window.setTimeout(() => {
        state.wheelTimerId = null;
        state.pausedByWheel = false;
        state.lastTime = performance.now();
      }, WHEEL_RESUME_DELAY_MS);
    };

    const thumbEl = trayThumbRef.current;
    viewport.addEventListener('pointerdown', handlePointerDown, { passive: true });
    viewport.addEventListener('dragstart', handleDragStart);
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    thumbEl?.addEventListener('pointerdown', handleThumbPointerDown);
    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerRelease, { passive: true });
    window.addEventListener('pointercancel', handlePointerRelease, { passive: true });
    window.addEventListener('dragend', handleDragEndOrDrop);
    window.addEventListener('drop', handleDragEndOrDrop);
    window.addEventListener('blur', handleWindowBlur);

    let rafId = 0;
    const animate = (now: number) => {
      const dt = Math.min(Math.max((now - state.lastTime) / 1000, 0), 0.05);
      state.lastTime = now;

      const maxOffset = state.maxOffset;
      const isPaused =
        state.pausedByPointer ||
        state.pausedByDrag ||
        state.pausedByWheel ||
        state.draggingThumb ||
        focusedItemIdRef.current !== null ||
        isTimeUpRef.current;

      const prevOffset = state.offset;

      if (maxOffset <= 1) {
        state.offset = 0;
        state.manualTarget = 0;
        state.speedFactor = 0;
      } else if (state.pausedByWheel || state.draggingThumb) {
        state.speedFactor = 0;
        const lerpAlpha = 1 - Math.exp(-(state.draggingThumb ? 24 : 13) * dt);
        state.offset += (state.manualTarget - state.offset) * lerpAlpha;
        if (Math.abs(state.manualTarget - state.offset) < 0.05) {
          state.offset = state.manualTarget;
        }
      } else {
        const targetFactor = isPaused ? 0 : 1;
        const rampRate = isPaused ? 16 : 6.5;
        state.speedFactor +=
          (targetFactor - state.speedFactor) * (1 - Math.exp(-rampRate * dt));
        if (Math.abs(targetFactor - state.speedFactor) < 0.004) {
          state.speedFactor = targetFactor;
        }

        if (state.speedFactor > 0.001) {
          const distToEdge = Math.min(state.offset, maxOffset - state.offset);
          const edgeRatio = Math.min(1, Math.max(0, distToEdge / EDGE_EASE_PX));
          const edgeEase = 0.28 + 0.72 * Math.sin((edgeRatio * Math.PI) / 2);

          state.offset +=
            CRUISE_SPEED_PX_PER_SEC *
            state.speedFactor *
            edgeEase *
            state.direction *
            dt;

          if (state.direction === 1 && state.offset >= maxOffset) {
            state.offset = maxOffset;
            state.direction = -1;
          } else if (state.direction === -1 && state.offset <= 0) {
            state.offset = 0;
            state.direction = 1;
          }
        }
      }

      if (Math.abs(state.offset - prevOffset) > 0.001 || prevOffset === 0) {
        track.style.transform = `translate3d(0, ${(-state.offset).toFixed(3)}px, 0)`;
        syncThumbPosition();
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      if (state.wheelTimerId !== null) {
        window.clearTimeout(state.wheelTimerId);
        state.wheelTimerId = null;
      }
      viewport.removeEventListener('pointerdown', handlePointerDown);
      viewport.removeEventListener('dragstart', handleDragStart);
      viewport.removeEventListener('wheel', handleWheel);
      thumbEl?.removeEventListener('pointerdown', handleThumbPointerDown);
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handlePointerRelease);
      window.removeEventListener('pointercancel', handlePointerRelease);
      window.removeEventListener('dragend', handleDragEndOrDrop);
      window.removeEventListener('drop', handleDragEndOrDrop);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [phase, isTrayEmpty]);

  const activeLitLight: TrafficLightColor | null =
    dragOverLight ?? (selectedItemId ? hoverSelectLight : null);

  useEffect(() => {
    return () => {
      if (focusCloseTimerRef.current) window.clearTimeout(focusCloseTimerRef.current);
      if (focusConfirmTimerRef.current) window.clearTimeout(focusConfirmTimerRef.current);
      if (guideExitTimerRef.current) window.clearTimeout(guideExitTimerRef.current);
    };
  }, []);

  const navigateGuideSlide = useCallback(
    (targetIdx: number) => {
      const clamped = Math.max(0, Math.min(LANE_ORDER.length - 1, targetIdx));
      if (clamped === guideSlideIdx) return;
      playTutorialStepSound();
      if (guideExitTimerRef.current) {
        window.clearTimeout(guideExitTimerRef.current);
      }
      const nextLight = LANE_ORDER[clamped];
      setGuideFeaturedFoods((prev) => ({
        ...prev,
        [nextLight]: pickRandomFoodForLight(nextLight, prev[nextLight]?.id),
      }));
      setExitingSlideIdx(guideSlideIdx);
      setGuideDirection(clamped > guideSlideIdx ? 'next' : 'prev');
      setGuideSlideIdx(clamped);
      setGuideAnimKey((prev) => prev + 1);
      guideExitTimerRef.current = window.setTimeout(() => {
        setExitingSlideIdx(null);
      }, 310);
    },
    [guideSlideIdx]
  );

  const clearFocusTimers = useCallback(() => {
    if (focusCloseTimerRef.current) {
      window.clearTimeout(focusCloseTimerRef.current);
      focusCloseTimerRef.current = null;
    }
    if (focusConfirmTimerRef.current) {
      window.clearTimeout(focusConfirmTimerRef.current);
      focusConfirmTimerRef.current = null;
    }
  }, []);

  const openFocusedFood = useCallback(
    (itemId: string) => {
      if (showTimeUpModal || showVictoryModal || isComplete) return;
      clearFocusTimers();
      setIsClosingFocus(false);
      setShakingCircleColor(null);
      setConfirmedCircleColor(null);
      setFocusHint(null);
      setSelectedItemId(null);
      setFocusedItemId(itemId);
    },
    [clearFocusTimers, showTimeUpModal, showVictoryModal, isComplete]
  );

  const closeFocusedFood = useCallback(() => {
    if (!focusedItemId || isClosingFocus) return;
    clearFocusTimers();
    setIsClosingFocus(true);
    focusCloseTimerRef.current = window.setTimeout(() => {
      setFocusedItemId(null);
      setIsClosingFocus(false);
      setShakingCircleColor(null);
      setConfirmedCircleColor(null);
      setFocusHint(null);
    }, 180);
  }, [focusedItemId, isClosingFocus, clearFocusTimers]);

  const startNewRound = useCallback(
    (overrideMinutes?: SemaforoTimedDurationMinutes) => {
      clearFocusTimers();
      if (warningFlashTimerRef.current !== null) {
        window.clearTimeout(warningFlashTimerRef.current);
        warningFlashTimerRef.current = null;
      }
      prevProgressRef.current = 0;
      setDisplayProgress(0);
      setProgressTrend('idle');
      setIsWarningFlash(false);
      setResetSpinKey((k) => k + 1);
      setRoundState(dealSemaforoRound(SEMAFORO_FOODS));
      setSelectedItemId(null);
      setFocusedItemId(null);
      setIsClosingFocus(false);
      setShakingCircleColor(null);
      setConfirmedCircleColor(null);
      setFocusHint(null);
      setDraggingItemId(null);
      setDragOverLight(null);
      setHoverSelectLight(null);
      setConfirmedLight(null);
      setShakingItemId(null);
      setShakingLane(null);
      setLastPlacedId(null);
      setShowBubbleSurge(false);
      setShowVictoryModal(false);
      setShowTimeUpModal(false);
      const nextMinutes = overrideMinutes ?? timedMinutes;
      setTimeLeftSeconds(nextMinutes * 60);
      if (trayTrackRef.current) {
        trayTrackRef.current.style.transform = 'translate3d(0, 0px, 0)';
      }
      if (trayThumbRef.current) {
        trayThumbRef.current.style.transform = 'translate3d(0, 0px, 0)';
      }
      conveyorStateRef.current.offset = 0;
      conveyorStateRef.current.manualTarget = 0;
      conveyorStateRef.current.direction = 1;
      conveyorStateRef.current.speedFactor = 0;
      conveyorStateRef.current.pausedByPointer = false;
      conveyorStateRef.current.pausedByDrag = false;
      conveyorStateRef.current.pausedByWheel = false;
      conveyorStateRef.current.draggingThumb = false;
      conveyorStateRef.current.lastTime = performance.now();
    },
    [clearFocusTimers, timedMinutes]
  );

  const handleOpenModeSelector = useCallback(() => {
    clearFocusTimers();
    setFocusedItemId(null);
    setIsClosingFocus(false);
    setSelectedItemId(null);
    setDraggingItemId(null);
    setDragOverLight(null);
    setHoverSelectLight(null);
    setShowVictoryModal(false);
    setShowTimeUpModal(false);
    setGuideOpenedFromPlay(false);
    setPhase('mode');
  }, [clearFocusTimers]);

  const handleSelectNormalMode = useCallback(() => {
    setGameMode('normal');
    startNewRound();
    setPhase('playing');
  }, [startNewRound]);

  const handleConfirmTimedMode = useCallback(
    (minutes: SemaforoTimedDurationMinutes) => {
      setGameMode('timed');
      setTimedMinutes(minutes);
      startNewRound(minutes);
      setPhase('playing');
    },
    [startNewRound]
  );

  const [guideOpenedFromPlay, setGuideOpenedFromPlay] = useState<boolean>(false);

  const handleOpenGuideFromPlay = useCallback(() => {
    clearFocusTimers();
    setFocusedItemId(null);
    setIsClosingFocus(false);
    setSelectedItemId(null);
    setDraggingItemId(null);
    setGuideOpenedFromPlay(true);
    setPhase('guide');
  }, [clearFocusTimers]);

  const handleStartFromGuide = useCallback(() => {
    if (guideOpenedFromPlay) {
      setGuideOpenedFromPlay(false);
      setPhase('playing');
      return;
    }
    startNewRound(timedMinutes);
    setPhase('playing');
  }, [guideOpenedFromPlay, startNewRound, timedMinutes]);

  // Countdown loop strictly for Contrarreloj mode while actively playing
  const isTimerExpired = timeLeftSeconds <= 0;
  useEffect(() => {
    if (
      phase !== 'playing' ||
      gameMode !== 'timed' ||
      isComplete ||
      showVictoryModal ||
      showTimeUpModal
    ) {
      return;
    }

    if (isTimerExpired) {
      clearFocusTimers();
      setFocusedItemId(null);
      setIsClosingFocus(false);
      setSelectedItemId(null);
      setDraggingItemId(null);
      setDragOverLight(null);
      setHoverSelectLight(null);
      setShowTimeUpModal(true);
      playTimeUpSound(soundEnabled);
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        if (next > 0 && next <= 15) {
          playTimerTickSound(soundEnabled, true);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [
    phase,
    gameMode,
    isComplete,
    showVictoryModal,
    showTimeUpModal,
    isTimerExpired,
    clearFocusTimers,
    soundEnabled,
  ]);

  // Switch to playful suspense soundtrack while actively playing El Semáforo Contrarreloj
  useEffect(() => {
    const isActiveTimedPlay =
      phase === 'playing' &&
      gameMode === 'timed' &&
      !isComplete &&
      !showVictoryModal &&
      !showTimeUpModal;
    setBgmTheme(isActiveTimedPlay ? 'suspense' : 'cheerful');
    return () => {
      setBgmTheme('cheerful');
    };
  }, [phase, gameMode, isComplete, showVictoryModal, showTimeUpModal]);

  const attemptClassify = useCallback(
    (itemId: string, targetLight: TrafficLightColor) => {
      if (showTimeUpModal || showVictoryModal || isComplete) return;
      const result = evaluateSemaforoDrop(roundState, itemId, targetLight);

      if (!result.accepted) {
        playGentleHintSound(soundEnabled);
        setRoundState(result.nextState);
        triggerProgressWarning();
        setShakingItemId(itemId);
        setShakingLane(targetLight);
        window.setTimeout(() => {
          setShakingItemId((prev) => (prev === itemId ? null : prev));
          setShakingLane((prev) => (prev === targetLight ? null : prev));
        }, 460);
        return;
      }

      setRoundState(result.nextState);
      setSelectedItemId(null);
      setDraggingItemId(null);
      setDragOverLight(null);
      setHoverSelectLight(null);
      setLastPlacedId(itemId);
      setConfirmedLight(targetLight);
      window.setTimeout(() => {
        setConfirmedLight((prev) => (prev === targetLight ? null : prev));
      }, 620);

      if (isSemaforoComplete(result.nextState)) {
        playPlateCompleteSound(soundEnabled);
        window.setTimeout(() => {
          setShowVictoryModal(true);
        }, 700);
      } else {
        playPlaceFoodSound(soundEnabled);
      }
    },
    [
      roundState,
      soundEnabled,
      triggerProgressWarning,
      showTimeUpModal,
      showVictoryModal,
      isComplete,
    ]
  );

  const handleFocusColorVote = useCallback(
    (targetLight: TrafficLightColor) => {
      if (
        !focusedItemId ||
        confirmedCircleColor ||
        isClosingFocus ||
        showTimeUpModal ||
        showVictoryModal ||
        isComplete
      ) {
        return;
      }
      const result = evaluateSemaforoDrop(roundState, focusedItemId, targetLight);

      if (!result.accepted) {
        playGentleHintSound(soundEnabled);
        setRoundState(result.nextState);
        triggerProgressWarning();
        setShakingCircleColor(targetLight);
        setFocusHint(result.message);
        window.setTimeout(() => {
          setShakingCircleColor((prev) => (prev === targetLight ? null : prev));
        }, 460);
        return;
      }

      setFocusHint(null);
      setShakingCircleColor(null);
      setConfirmedCircleColor(targetLight);

      if (isSemaforoComplete(result.nextState)) {
        playPlateCompleteSound(soundEnabled);
      } else {
        playPlaceFoodSound(soundEnabled);
      }

      focusConfirmTimerRef.current = window.setTimeout(() => {
        setIsClosingFocus(true);
        setRoundState(result.nextState);
        setLastPlacedId(focusedItemId);
        setConfirmedLight(targetLight);

        window.setTimeout(() => {
          setConfirmedLight((prev) => (prev === targetLight ? null : prev));
        }, 620);

        if (isSemaforoComplete(result.nextState)) {
          window.setTimeout(() => {
            setShowVictoryModal(true);
          }, 700);
        }

        focusCloseTimerRef.current = window.setTimeout(() => {
          setFocusedItemId(null);
          setIsClosingFocus(false);
          setConfirmedCircleColor(null);
        }, 180);
      }, 240);
    },
    [
      focusedItemId,
      confirmedCircleColor,
      isClosingFocus,
      showTimeUpModal,
      showVictoryModal,
      isComplete,
      roundState,
      soundEnabled,
      triggerProgressWarning,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'mode') {
        if (e.key === 'Escape') {
          e.preventDefault();
          setPhase('guide');
        }
        return;
      }

      if (phase === 'guide') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateGuideSlide(guideSlideIdx + 1);
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateGuideSlide(guideSlideIdx - 1);
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartFromGuide();
        }
        return;
      }

      if (showVictoryModal || showTimeUpModal) return;

      if (focusedItemId) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeFocusedFood();
          return;
        }
        if (e.key === '1') {
          e.preventDefault();
          handleFocusColorVote('red');
        } else if (e.key === '2') {
          e.preventDefault();
          handleFocusColorVote('yellow');
        } else if (e.key === '3') {
          e.preventDefault();
          handleFocusColorVote('green');
        }
        return;
      }

      if (e.key === 'Escape') {
        setSelectedItemId(null);
        return;
      }

      if (selectedItemId) {
        if (e.key === '1') {
          e.preventDefault();
          attemptClassify(selectedItemId, 'red');
        } else if (e.key === '2') {
          e.preventDefault();
          attemptClassify(selectedItemId, 'yellow');
        } else if (e.key === '3') {
          e.preventDefault();
          attemptClassify(selectedItemId, 'green');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    phase,
    guideSlideIdx,
    navigateGuideSlide,
    handleStartFromGuide,
    showVictoryModal,
    showTimeUpModal,
    focusedItemId,
    selectedItemId,
    closeFocusedFood,
    handleFocusColorVote,
    attemptClassify,
  ]);

  const handleDragStartFood = (e: React.DragEvent, item: SemaforoFoodItem) => {
    if (showTimeUpModal || showVictoryModal || isComplete) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setFocusedItemId(null);
    setDraggingItemId(item.id);
    setSelectedItemId(item.id);
  };

  const handleDragEndFood = () => {
    setDraggingItemId(null);
    setDragOverLight(null);
    setSelectedItemId(null);
  };

  const handleLaneDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    light: TrafficLightColor
  ) => {
    if (showTimeUpModal || showVictoryModal || isComplete) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverLight !== light) {
      setDragOverLight(light);
    }
  };

  const handleLaneDragLeave = (
    e: React.DragEvent<HTMLDivElement>,
    light: TrafficLightColor
  ) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverLight === light) {
      setDragOverLight(null);
    }
  };

  const handleLaneDrop = (
    e: React.DragEvent<HTMLDivElement>,
    light: TrafficLightColor
  ) => {
    e.preventDefault();
    setDragOverLight(null);
    if (showTimeUpModal || showVictoryModal || isComplete) return;
    const itemId = e.dataTransfer.getData('text/plain') || draggingItemId;
    if (itemId) {
      attemptClassify(itemId, light);
    }
  };

  const handleLaneClick = (light: TrafficLightColor) => {
    if (!selectedItemId || showTimeUpModal || showVictoryModal || isComplete) return;
    attemptClassify(selectedItemId, light);
  };

  const selectedItem =
    roundState.tray.find((entry) => entry.item.id === selectedItemId)?.item ?? null;
  const focusedItem =
    roundState.tray.find((entry) => entry.item.id === focusedItemId)?.item ?? null;
  const isUrgentTime = gameMode === 'timed' && isCountdownUrgent(timeLeftSeconds);
  const formattedCountdown = formatSemaforoCountdown(timeLeftSeconds);

  /* ================= FASE 0: SELECTOR DE MODO DE JUEGO ================= */
  if (phase === 'mode') {
    return (
      <SemaforoModeSelector
        currentMode={gameMode}
        selectedMinutes={timedMinutes}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        onBackToLibrary={onBackToLibrary}
        onBackToGuide={() => setPhase('guide')}
        onSelectNormal={handleSelectNormalMode}
        onConfirmTimed={handleConfirmTimedMode}
      />
    );
  }

  /* ================= FASE 1: INSTRUCTIVO EDUCATIVO TIPO PRESENTACIÓN AAA ================= */
  if (phase === 'guide') {
    const activeLightColor = LANE_ORDER[guideSlideIdx] ?? 'red';
    const exitingLightColor =
      exitingSlideIdx !== null ? LANE_ORDER[exitingSlideIdx] : null;
    const isFirstSlide = guideSlideIdx === 0;
    const isLastSlide = guideSlideIdx === LANE_ORDER.length - 1;

    const GUIDE_CREATIVE_META: Record<
      TrafficLightColor,
      {
        headline: string;
        headerGradient: string;
        bodyBg: string;
        dotPattern: string;
        accentBarBg: string;
        titleColor: string;
      }
    > = {
      red: {
        headline: '¡Cuidado con los ultraprocesados!',
        headerGradient: 'linear-gradient(112deg, #e11d48 0%, #fc3e7e 56%, #fb7185 100%)',
        bodyBg: 'linear-gradient(155deg, #ffffff 0%, #fff4f7 58%, #ffe4ec 100%)',
        dotPattern: 'radial-gradient(rgba(252, 62, 126, 0.16) 2px, transparent 2.5px)',
        accentBarBg: '#fc3e7e',
        titleColor: '#9f1239',
      },
      yellow: {
        headline: '¡Energía rica en la medida justa!',
        headerGradient: 'linear-gradient(112deg, #f59e0b 0%, #fee330 56%, #fde047 100%)',
        bodyBg: 'linear-gradient(155deg, #ffffff 0%, #fffdf0 58%, #fef3c7 100%)',
        dotPattern: 'radial-gradient(rgba(217, 119, 6, 0.16) 2px, transparent 2.5px)',
        accentBarBg: '#f59e0b',
        titleColor: '#92400e',
      },
      green: {
        headline: '¡Súper poder natural cada día!',
        headerGradient: 'linear-gradient(112deg, #16a34a 0%, #5dd118 54%, #84cc16 100%)',
        bodyBg: 'linear-gradient(155deg, #ffffff 0%, #f4ffe8 58%, #dcfce7 100%)',
        dotPattern: 'radial-gradient(rgba(22, 163, 74, 0.16) 2px, transparent 2.5px)',
        accentBarBg: '#5dd118',
        titleColor: '#14532d',
      },
    };

    const renderExpandedSlideCard = (
      lightColor: TrafficLightColor,
      isExiting: boolean
    ) => {
      const rule = TRAFFIC_LIGHT_RULES[lightColor];
      const meta = GUIDE_CREATIVE_META[lightColor];
      const featuredFood = guideFeaturedFoods[lightColor];
      const animClass = isExiting
        ? guideDirection === 'next'
          ? 'animate-guide-slide-out-left'
          : 'animate-guide-slide-out-right'
        : guideDirection === 'next'
          ? 'animate-guide-slide-in-right'
          : guideDirection === 'prev'
            ? 'animate-guide-slide-in-left'
            : '';

      return (
        <article
          key={`${lightColor}-${isExiting ? 'exit' : guideAnimKey}`}
          data-testid={
            isExiting ? undefined : `semaforo-guide-card-${lightColor}`
          }
          aria-hidden={isExiting ? true : undefined}
          style={{ background: meta.bodyBg }}
          className={`${
            isExiting
              ? 'pointer-events-none absolute inset-0 z-10'
              : 'relative z-20 h-full'
          } w-full rounded-[40px] border-[4.5px] border-[#1E1B2E] border-b-[12px] shadow-[0_14px_0_rgba(30,27,46,0.22)] overflow-hidden flex flex-col ${animClass}`}
        >
          {/* CLEAN GLOSSY HEADER RIBBON: Traffic Light Icon + Light Title + Subtitle ONLY */}
          <div
            className="relative px-6 py-3 sm:px-9 sm:py-3.5 xl:px-11 xl:py-4 border-b-[4.5px] border-[#1E1B2E] flex items-center gap-5 sm:gap-6 shrink-0 overflow-hidden"
            style={{ background: meta.headerGradient }}
          >
            {/* Curved top highlight */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-1.5 h-3.5 rounded-full bg-[#ffffff]/25"
            />

            <div className="relative z-10 flex items-center gap-5 sm:gap-6 min-w-0">
              <div className="scale-115 sm:scale-[1.28] origin-left shrink-0 mr-1.5 sm:mr-2.5 drop-shadow-[0_3px_0_rgba(30,27,46,0.3)]">
                <MiniTrafficLightIcon active={lightColor} />
              </div>
              <div className="min-w-0">
                <h3
                  className="font-display text-3xl sm:text-4xl xl:text-[42px] font-bold leading-none"
                  style={{
                    color: rule.textOnBand,
                    textShadow:
                      rule.textOnBand === '#ffffff' ? '0 3px 0 #1E1B2E' : 'none',
                  }}
                >
                  {rule.title}
                </h3>
                <p
                  className="text-base sm:text-lg xl:text-[21px] font-black leading-snug mt-1"
                  style={{
                    color:
                      rule.textOnBand === '#ffffff'
                        ? 'rgba(255,255,255,0.96)'
                        : '#1E1B2E',
                  }}
                >
                  {rule.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* EXPANDED TWO-COLUMN STORY STAGE: Compact Text Column + Predominant 3D Interactive Random Food */}
          <div className="relative flex-1 min-h-0 px-6 py-3 sm:px-9 sm:py-4 xl:px-11 xl:py-5 grid grid-cols-1 md:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] gap-4 sm:gap-6 xl:gap-8 items-center overflow-visible">
            {/* Subtle comic dot halftone corner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 bottom-0 w-64 h-40 opacity-80"
              style={{
                backgroundImage: meta.dotPattern,
                backgroundSize: '14px 14px',
                maskImage: 'radial-gradient(circle at 0% 100%, black 25%, transparent 72%)',
                WebkitMaskImage:
                  'radial-gradient(circle at 0% 100%, black 25%, transparent 72%)',
              }}
            />

            {/* LEFT COLUMN: Trimmed Width Single-Line Headline & Justified Complete Copy */}
            <div className="relative z-10 w-[679.1px] flex flex-col justify-center gap-3 sm:gap-4 min-w-0 py-1">
              <div className="flex items-center gap-3 min-w-0 text-[18px]">
                <span
                  aria-hidden="true"
                  className="w-2.5 sm:w-3 h-8 sm:h-9 xl:h-11 rounded-full border-[2.5px] border-[#1E1B2E] shrink-0"
                  style={{ backgroundColor: meta.accentBarBg }}
                />
                <h4
                  className="font-display text-[44.4484px] font-bold leading-tight tracking-tight whitespace-nowrap"
                  style={{ color: meta.titleColor }}
                >
                  {meta.headline}
                </h4>
              </div>

              <p className="text-[32.2px] font-extrabold text-[#1E1B2E]/92 leading-[1.44] text-justify pl-0.5">
                {rule.description}
              </p>
            </div>

            {/* RIGHT COLUMN: Predominant Large Interactive 3D Food Illustration */}
            <div className="relative z-10 w-full h-full min-h-0 flex items-center justify-center overflow-visible">
              <GuideFood3DShowcase
                food={featuredFood}
                labelColor={meta.titleColor}
              />
            </div>
          </div>
        </article>
      );
    };

    return (
      <div
        data-testid="semaforo-guide-screen"
        className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between px-4 py-3 sm:px-7 sm:py-4 xl:px-10 xl:py-5 gap-3 sm:gap-4"
      >
        {/* Clean Minimal Header: Home + Title ONLY + Fullscreen Icon */}
        <header className="relative z-10 w-full flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToLibrary}
              aria-label="Volver a la biblioteca"
              title="Biblioteca de Juegos"
              className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
            </button>

            <h1 className="font-display title-nutriplato-brand text-2xl sm:text-3xl xl:text-4xl font-bold leading-none truncate py-0.5">
              El Semáforo
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              data-testid="semaforo-mode-btn"
              onClick={() => {
                playUiClickSound();
                handleOpenModeSelector();
              }}
              className="font-display px-4 py-2 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-sm sm:text-base font-bold border-[2.5px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
            >
              <Gamepad2 className="w-5 h-5 text-[#8137ea] shrink-0" aria-hidden="true" />
              <span>Modo de Juego</span>
            </button>

            <SoundToggleButton />

            <button
              type="button"
              data-testid="fullscreen-btn"
              onClick={onToggleFullscreen}
              aria-pressed={isFullscreen}
              aria-label={
                isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa para TV'
              }
              title={
                isFullscreen ? 'Salir de pantalla completa' : 'Pantalla Completa (TV)'
              }
              className={`p-2.5 rounded-2xl border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isFullscreen
                  ? 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E]'
                  : 'bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff]'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Maximize2 className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* Full-Height Expanded Carousel Stage: [◀] + [Large Hero Slide] + [▶] */}
        <main className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-between gap-3 sm:gap-5 xl:gap-8">
          {/* Left Arrow Button Near Edge */}
          <button
            type="button"
            data-testid="guide-prev-btn"
            onClick={() => navigateGuideSlide(guideSlideIdx - 1)}
            disabled={isFirstSlide}
            aria-label="Luz anterior"
            title={isFirstSlide ? 'Primera diapositiva' : 'Ver luz anterior'}
            className={`shrink-0 w-14 h-20 sm:w-16 sm:h-24 xl:w-[76px] xl:h-28 rounded-3xl border-[3.5px] border-[#1E1B2E] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
              isFirstSlide
                ? 'bg-[#ffffff]/65 text-[#1E1B2E]/25 shadow-[0_3px_0_#1E1B2E] opacity-45 cursor-not-allowed'
                : 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] cursor-pointer hover:scale-105'
            }`}
          >
            <svg viewBox="0 0 36 36" className="w-9 h-9 rotate-180" aria-hidden="true">
              <path
                d="M11 6.8 C11 4.9 13.1 3.8 14.7 4.8 L28.4 13.9 C29.9 14.9 29.9 17.1 28.4 18.1 L14.7 27.2 C13.1 28.2 11 27.1 11 25.2 Z"
                transform="translate(0, 2)"
                fill="currentColor"
                stroke="#1E1B2E"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Expanded Hero Presentation Slide Container */}
          <div className="relative flex-1 min-w-0 h-full max-h-[740px] max-w-[1400px] mx-auto">
            {exitingLightColor && renderExpandedSlideCard(exitingLightColor, true)}
            {renderExpandedSlideCard(activeLightColor, false)}
          </div>

          {/* Right Arrow Button Near Edge */}
          <button
            type="button"
            data-testid="guide-next-btn"
            onClick={() => navigateGuideSlide(guideSlideIdx + 1)}
            disabled={isLastSlide}
            aria-label="Siguiente luz"
            title={isLastSlide ? 'Última diapositiva' : 'Ver siguiente luz'}
            className={`shrink-0 w-14 h-20 sm:w-16 sm:h-24 xl:w-[76px] xl:h-28 rounded-3xl border-[3.5px] border-[#1E1B2E] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
              isLastSlide
                ? 'bg-[#ffffff]/65 text-[#1E1B2E]/25 shadow-[0_3px_0_#1E1B2E] opacity-45 cursor-not-allowed'
                : 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] cursor-pointer hover:scale-105'
            }`}
          >
            <svg viewBox="0 0 36 36" className="w-9 h-9" aria-hidden="true">
              <path
                d="M11 6.8 C11 4.9 13.1 3.8 14.7 4.8 L28.4 13.9 C29.9 14.9 29.9 17.1 28.4 18.1 L14.7 27.2 C13.1 28.2 11 27.1 11 25.2 Z"
                transform="translate(0, 2)"
                fill="currentColor"
                stroke="#1E1B2E"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </main>

        <footer className="relative z-10 w-full flex justify-center shrink-0 pb-0.5">
          <button
            type="button"
            data-testid="semaforo-start-btn"
            onClick={handleStartFromGuide}
            className="font-display py-3 px-10 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-xl sm:text-2xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] flex items-center gap-3 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            <span>
              {guideOpenedFromPlay ? 'Volver al Juego' : '¡Entendido, a Jugar!'}
            </span>
            <Play className="w-6 h-6 fill-current" aria-hidden="true" />
          </button>
        </footer>
      </div>
    );
  }

  /* ================= FASE 2: PANTALLA DE JUEGO INTERACTIVO ================= */
  return (
    <div
      data-testid="semaforo-game-screen"
      className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col pt-3 sm:pt-4 xl:pt-5 pb-0"
    >
      {/* Confetti Explosion on 100% (auto-unmounts after burst) */}
      {showCompleteConfetti && (
        <div
          className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          aria-hidden="true"
        >
          {CONFETTI_PIECES.map((piece, i) => (
            <span
              key={i}
              className="animate-confetti absolute top-0 w-3.5 h-5 rounded-sm"
              style={{
                left: piece.left,
                backgroundColor: piece.color,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* CLEAN 3-COLUMN TOP HEADER: [HOME + TITLE] | [CENTERED LIQUID PROGRESS BAR] | [FULLSCREEN TOP-RIGHT] */}
      <header className="relative z-20 w-full px-4 sm:px-6 xl:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 shrink-0">
        {/* Left: Home & Title Only */}
        <div className="flex items-center gap-2.5 shrink-0 justify-self-start min-w-0">
          <button
            type="button"
            onClick={onBackToLibrary}
            aria-label="Volver a la biblioteca"
            title="Biblioteca de Juegos"
            className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
          </button>

          <h1 className="font-display title-nutriplato-brand text-2xl sm:text-3xl xl:text-[34px] font-bold leading-none truncate py-0.5">
            El Semáforo
          </h1>
        </div>

        {/* Center: Clean Single Floating Liquid Capsule Bar Directly on #8bfffe (Zero Outer Box) */}
        <div
          data-testid="semaforo-progress-bar"
          className="justify-self-center relative flex items-center gap-2.5 sm:gap-3 shrink-0"
        >
          {/* Floating Crisp Percentage Indicator */}
          <span
            data-testid="semaforo-progress-percent"
            className={`font-display text-lg sm:text-xl xl:text-2xl font-bold tabular-nums min-w-[50px] text-right transition-colors duration-200 ${
              isWarningFlash ? 'text-[#e11d48]' : 'text-[#1E1B2E]'
            }`}
            style={{
              textShadow: '0 2px 0 rgba(255,255,255,0.85)',
            }}
          >
            {displayProgress}%
          </span>

          {/* Single Floating Capsule Track + Integrated Right Star Emblem */}
          <div className="relative flex items-center">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso de clasificación: ${progress}%`}
              className="relative w-44 sm:w-68 lg:w-84 xl:w-[390px] h-8 sm:h-9 rounded-full bg-[#ffffff] border-[3.5px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E,inset_0_3px_6px_rgba(30,27,46,0.14)] overflow-hidden"
            >
              {/* Subtle Glass Tube Inner Specular Depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, transparent 40%, transparent 78%, rgba(30,27,46,0.08) 100%)',
                }}
              />

              {/* Subtle Warning Glow Overlay on Incorrect Drop */}
              {isWarningFlash && (
                <div
                  key={`warn-${warningFlashKey}`}
                  aria-hidden="true"
                  className="animate-semaforo-warning-flash pointer-events-none absolute inset-0 z-20 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(252,62,126,0.42) 0%, rgba(252,62,126,0.18) 55%, rgba(252,62,126,0.45) 100%)',
                  }}
                />
              )}

              {/* GPU-Accelerated Bidirectional Fluid Column (Elastic Forward / Smooth Retreat) */}
              <div
                className={`relative w-full h-full rounded-l-full will-change-transform transition-transform ${
                  progressTrend === 'down'
                    ? 'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                    : 'duration-[660ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]'
                }`}
                style={{
                  transform: `translate3d(${progress - 100}%, 0, 0)`,
                }}
              >
                {/* Vibrant Luminous Liquid Gradient */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-l-full"
                >
                  <div
                    className={`absolute inset-y-0 left-0 ${
                      isComplete ? 'w-[200%] animate-meter-rainbow-h' : 'w-full'
                    }`}
                    style={{
                      backgroundImage: isWarningFlash
                        ? 'linear-gradient(90deg, #fb7185 0%, #fc3e7e 55%, #f43f5e 100%)'
                        : liquidTheme.gradient,
                    }}
                  />
                </div>

                {/* Soft Animated Curved Wave on Leading Edge */}
                {progress > 0 && progress < 100 && (
                  <svg
                    viewBox="0 0 18 120"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="animate-semaforo-liquid-wave-v pointer-events-none absolute -right-[8px] top-0 h-[200%] w-[13px]"
                  >
                    <path
                      d="M9 0 Q 17 15, 9 30 T 9 60 T 9 90 T 9 120 L0 120 L0 0 Z"
                      fill={isWarningFlash ? '#fc3e7e' : liquidTheme.waveColor}
                    />
                    <path
                      d="M9 0 Q 15 15, 9 30 T 9 60 T 9 90 T 9 120"
                      fill="none"
                      stroke="#ffffff"
                      strokeOpacity="0.82"
                      strokeWidth="2.4"
                    />
                  </svg>
                )}

                {/* Subtle Continuous Micro-Bubbles Drifting Inside Liquid */}
                {progress > 0 &&
                  HORIZONTAL_LIQUID_BUBBLES.map((b, idx) => (
                    <span
                      key={idx}
                      aria-hidden="true"
                      className="animate-semaforo-bubble-drift pointer-events-none absolute rounded-full border border-[#ffffff]/90"
                      style={{
                        left: b.left,
                        bottom: b.bottom,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        background:
                          'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.42) 68%, rgba(255,255,255,0.16) 100%)',
                        animationDelay: b.delay,
                        animationDuration: b.duration,
                      }}
                    />
                  ))}

                {/* Reactive Micro-Bubble Surge on Progress Increase */}
                {progress > 0 && showBubbleSurge && (
                  <div
                    key={`surge-${progressCelebrateKey}`}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                  >
                    {HORIZONTAL_SURGE_BUBBLES.map((b, idx) => (
                      <span
                        key={idx}
                        className="animate-semaforo-bubble-surge-h pointer-events-none absolute rounded-full border border-[#ffffff]"
                        style={{
                          left: b.left,
                          bottom: b.bottom,
                          width: `${b.size}px`,
                          height: `${b.size}px`,
                          background:
                            'radial-gradient(circle at 30% 30%, #ffffff 0%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.18) 100%)',
                          animationDelay: b.delay,
                          animationDuration: b.duration,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Specular Gloss Sweep Triggered on Every Percentage Increase */}
                {progress > 0 && progressCelebrateKey > 0 && (
                  <div
                    key={`gloss-${progressCelebrateKey}`}
                    aria-hidden="true"
                    className="animate-semaforo-shimmer-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 8%, rgba(255,255,255,0.72) 50%, transparent 92%)',
                    }}
                  />
                )}

                {/* Top Curved Specular Glass Gloss Strip */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2.5 top-1 h-1.5 sm:h-2 rounded-full bg-[#ffffff]/60"
                />
              </div>
            </div>

            {/* Integrated End Star Emblem with 3D Outline & Luminous Pulse on Correct Answer */}
            <div
              key={progressCelebrateKey > 0 ? `star-${progressCelebrateKey}` : 'star-idle'}
              className={`-ml-3.5 relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3.5px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] flex items-center justify-center shrink-0 transition-colors duration-300 ${
                progress > 0 ? 'bg-[#fee330]' : 'bg-[#ffffff]'
              } ${progressCelebrateKey > 0 && progress > 0 ? 'animate-star-goal-celebrate' : ''}`}
              style={
                progress > 0
                  ? {
                      boxShadow: `0 5px 0 #1E1B2E, 0 0 16px ${liquidTheme.glowColor}`,
                    }
                  : undefined
              }
              title="Meta 100%"
              aria-hidden="true"
            >
              {isComplete ? (
                <Trophy className="w-5 h-5 text-[#1E1B2E]" />
              ) : (
                <Star
                  className={`w-5 h-5 transition-colors duration-300 ${
                    progress > 0
                      ? 'fill-[#ffffff] text-[#1E1B2E]'
                      : 'text-[#1E1B2E]/45'
                  }`}
                />
              )}
            </div>
          </div>

          {/* Contrarreloj Digital Countdown Timer (ONLY rendered in Timed Mode) */}
          {gameMode === 'timed' && (
            <div
              data-testid="semaforo-timer"
              data-urgent={isUrgentTime ? 'true' : 'false'}
              role="timer"
              aria-live="off"
              aria-label={`Tiempo restante: ${formattedCountdown}`}
              className={`ml-1 sm:ml-2 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-10 sm:h-11 rounded-2xl border-[3.5px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] shrink-0 whitespace-nowrap transition-colors duration-200 ${
                isUrgentTime
                  ? 'bg-[#fc3e7e] text-[#ffffff] animate-semaforo-timer-urgent'
                  : 'bg-[#ffffff] text-[#1E1B2E]'
              }`}
            >
              <Timer
                className={`w-5 h-5 shrink-0 ${
                  isUrgentTime ? 'text-[#ffffff]' : 'text-[#8137ea]'
                }`}
                aria-hidden="true"
              />
              <span
                className="font-display text-lg sm:text-xl xl:text-2xl font-bold tabular-nums leading-none tracking-tight"
                style={isUrgentTime ? { textShadow: '0 2px 0 #1E1B2E' } : undefined}
              >
                {formattedCountdown}
              </span>
            </div>
          )}
        </div>

        {/* Right: Instructivo + Circular Purple Restart Button + Fullscreen Button in Top-Right Corner */}
        <div className="flex items-center justify-end gap-2 shrink-0 justify-self-end">
          <button
            type="button"
            data-testid="semaforo-open-guide-btn"
            onClick={handleOpenGuideFromPlay}
            aria-label="Ver instructivo"
            title="Ver Instructivo"
            className="font-display px-3 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-sm font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            <BookOpen className="w-4 h-4 text-[#8137ea] shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">Instructivo</span>
          </button>

          <button
            type="button"
            data-testid="semaforo-reset-btn"
            onClick={() => {
              playUiClickSound();
              startNewRound();
            }}
            aria-label="Reiniciar partida"
            title="Reiniciar partida"
            className="w-11 h-11 rounded-full bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] flex items-center justify-center cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fee330]"
          >
            <RotateCcw
              key={resetSpinKey}
              className={`w-5 h-5 ${resetSpinKey > 0 ? 'animate-semaforo-reset-spin' : ''}`}
              aria-hidden="true"
            />
          </button>

          <SoundToggleButton />

          <button
            type="button"
            data-testid="fullscreen-btn"
            onClick={onToggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={
              isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa para TV'
            }
            title={
              isFullscreen ? 'Salir de pantalla completa' : 'Pantalla Completa (TV)'
            }
            className={`p-2.5 rounded-2xl border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isFullscreen
                ? 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E]'
                : 'bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff]'
            }`}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* MAIN STAGE: [3D ANIMATED TRAFFIC LIGHT + 3 OPEN COLOR BANDS] | [RIGHT CONVEYOR BELT COLUMN] */}
      <main className="relative z-10 w-full flex-1 min-h-0 px-4 sm:px-6 xl:px-10 pt-3 flex items-stretch gap-3 sm:gap-5 xl:gap-6">
        {/* LEFT + CENTER: STANDING 3D TRAFFIC LIGHT ANCHORED TO FLOOR + 3 CLEAN OPEN COLOR BANDS */}
        <div className="flex-1 min-w-0 h-full grid grid-cols-[132px_1fr] sm:grid-cols-[160px_1fr] xl:grid-cols-[188px_1fr] items-stretch">
          {/* PROFESSIONAL 3D STANDING TRAFFIC LIGHT WITH PULSING LUMINOUS LENSES & FLOOR PEDESTAL */}
          <div
            data-testid="standing-traffic-light"
            className="relative h-full flex flex-col items-center justify-between pt-1 pb-0 select-none"
          >
            <div className="relative flex-1 min-h-0 w-full flex flex-col items-center">
              {/* Top Crown Cap */}
              <div
                aria-hidden="true"
                className="w-[74px] sm:w-[90px] xl:w-[102px] h-2.5 -mb-1 rounded-t-full border-[3.5px] border-b-0 border-[#1E1B2E]"
                style={{
                  background:
                    'linear-gradient(90deg, #524e68 0%, #343146 38%, #1e1c2b 100%)',
                }}
              />

              {/* 3D Shaded Vertical Casing Body */}
              <div
                className="relative w-[112px] sm:w-[132px] xl:w-[148px] flex-1 min-h-0 rounded-[38px] border-[4.5px] border-[#1E1B2E] shadow-[7px_8px_0_rgba(30,27,46,0.28)] grid grid-rows-3 py-2 sm:py-3"
                style={{
                  background:
                    'linear-gradient(90deg, #4b4761 0%, #322f43 20%, #232132 66%, #151320 100%)',
                }}
              >
                {/* Inner Recessed Panel Groove */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[6px] rounded-[31px] border-2 border-[#0e0c18]/75 shadow-[inset_0_4px_12px_rgba(0,0,0,0.48)]"
                />

                {/* Left Curved Metallic Edge Highlight */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-6 bottom-6 left-2.5 w-2 rounded-full bg-gradient-to-b from-[#ffffff]/28 via-[#ffffff]/14 to-[#ffffff]/6"
                />

                {/* Right Edge Deep Rim Reflection */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-8 bottom-8 right-2 w-1 rounded-full bg-[#ffffff]/8"
                />

                {/* Subtle Metallic Corner Bolts / Rivets */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 left-4 w-2 h-2 rounded-full bg-[#5b5772] border border-[#14121e]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 right-4 w-2 h-2 rounded-full bg-[#3d3a4f] border border-[#14121e]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3.5 left-4 w-2 h-2 rounded-full bg-[#5b5772] border border-[#14121e]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3.5 right-4 w-2 h-2 rounded-full bg-[#3d3a4f] border border-[#14121e]"
                />

                {LANE_ORDER.map((lightColor) => (
                  <div
                    key={lightColor}
                    className="relative flex items-center justify-center -mx-5 sm:-mx-6 xl:-mx-7"
                  >
                    <TrafficLightLensUnit
                      color={lightColor}
                      isLit={activeLitLight === lightColor}
                      isConfirmed={confirmedLight === lightColor}
                      clickable={selectedItem !== null}
                      onDragOver={(e) => handleLaneDragOver(e, lightColor)}
                      onDragLeave={(e) => handleLaneDragLeave(e, lightColor)}
                      onDrop={(e) => handleLaneDrop(e, lightColor)}
                      onClick={() => handleLaneClick(lightColor)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sturdy 3D Shaded Pole + Flanged Pedestal Base Anchored Flush to Bottom Edge */}
            <div className="shrink-0 w-full h-12 sm:h-14 xl:h-16 flex flex-col items-center justify-end">
              <svg
                viewBox="0 0 176 68"
                preserveAspectRatio="none"
                className="w-36 sm:w-40 xl:w-44 h-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="sem-pole-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#56526d" />
                    <stop offset="28%" stopColor="#726e8c" />
                    <stop offset="65%" stopColor="#353247" />
                    <stop offset="100%" stopColor="#1b1927" />
                  </linearGradient>
                  <linearGradient id="sem-base-dome" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4c4862" />
                    <stop offset="25%" stopColor="#37344a" />
                    <stop offset="72%" stopColor="#242233" />
                    <stop offset="100%" stopColor="#151320" />
                  </linearGradient>
                </defs>

                {/* Upper Mounting Collar */}
                <rect
                  x="64"
                  y="-4"
                  width="48"
                  height="11"
                  rx="4"
                  fill="url(#sem-pole-metal)"
                  stroke="#1E1B2E"
                  strokeWidth="4"
                />

                {/* Cylindrical Shaded Steel Pole */}
                <rect
                  x="74"
                  y="6"
                  width="28"
                  height="40"
                  fill="url(#sem-pole-metal)"
                  stroke="#1E1B2E"
                  strokeWidth="4.2"
                />
                <line
                  x1="81"
                  y1="10"
                  x2="81"
                  y2="42"
                  stroke="#ffffff"
                  strokeOpacity="0.3"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* Lower Collar Flange */}
                <rect
                  x="62"
                  y="37"
                  width="52"
                  height="10"
                  rx="4"
                  fill="url(#sem-pole-metal)"
                  stroke="#1E1B2E"
                  strokeWidth="3.8"
                />

                {/* Contoured Heavy Floor Pedestal Anchored Flush to Bottom */}
                <path
                  d="M 18 68 C 18 50, 36 45, 88 45 C 140 45, 158 50, 158 68 Z"
                  fill="url(#sem-base-dome)"
                  stroke="#1E1B2E"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 42 54 Q 88 50 134 54"
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.22"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* 3 CLEAN OPEN HORIZONTAL COLORED BANDS (NO ICON BADGES, NO DASHED SLOTS, FLOATING FOODS) */}
          <div className="h-full grid grid-rows-3 gap-3 sm:gap-4 pl-2 sm:pl-4 pb-12 sm:pb-14 xl:pb-16 min-h-0">
            {LANE_ORDER.map((lightColor, laneIdx) => {
              const rule = TRAFFIC_LIGHT_RULES[lightColor];
              const placedFoods = roundState.lanes[lightColor];
              const isHoveredOrDragged = activeLitLight === lightColor;
              const isConfirmedFlash = confirmedLight === lightColor;
              const isShaking = shakingLane === lightColor;
              const canTapPlace = selectedItem !== null;

              return (
                <div
                  key={lightColor}
                  role="button"
                  tabIndex={0}
                  data-testid={`semaforo-lane-${lightColor}`}
                  aria-label={`${rule.title}: ${rule.subtitle}. ${placedFoods.length} alimentos colocados`}
                  onClick={() => handleLaneClick(lightColor)}
                  onMouseEnter={() => {
                    if (selectedItemId) setHoverSelectLight(lightColor);
                  }}
                  onMouseLeave={() => {
                    if (hoverSelectLight === lightColor) setHoverSelectLight(null);
                  }}
                  onKeyDown={(e) => {
                    if (selectedItemId && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleLaneClick(lightColor);
                    }
                  }}
                  onDragOver={(e) => handleLaneDragOver(e, lightColor)}
                  onDragLeave={(e) => handleLaneDragLeave(e, lightColor)}
                  onDrop={(e) => handleLaneDrop(e, lightColor)}
                  style={{
                    backgroundColor: rule.bandHex,
                    transition: 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className={`relative rounded-[28px] border-[3.5px] border-[#1E1B2E] shadow-[0_7px_0_#1E1B2E] px-5 sm:px-7 py-2.5 sm:py-3 flex items-center gap-4 sm:gap-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                    isHoveredOrDragged || isConfirmedFlash
                      ? 'scale-[1.015] ring-4 ring-[#ffffff]'
                      : canTapPlace
                        ? 'cursor-pointer hover:scale-[1.01]'
                        : ''
                  } ${isShaking ? 'animate-plate-wiggle' : ''}`}
                >
                  {/* Clean Band Heading (Title & Subtitle Only, No Circular Icon Badge) */}
                  <div className="w-[144px] sm:w-[178px] xl:w-[202px] shrink-0 text-left">
                    <span
                      className="font-display text-xl sm:text-2xl xl:text-[28px] font-bold block leading-none"
                      style={{
                        color: rule.textOnBand,
                        textShadow:
                          rule.textOnBand === '#ffffff'
                            ? '0 2.5px 0 #1E1B2E'
                            : 'none',
                      }}
                    >
                      {rule.title}
                    </span>
                    <span
                      className="text-xs sm:text-sm xl:text-[15px] font-extrabold block mt-1.5 leading-tight"
                      style={{
                        color:
                          rule.textOnBand === '#ffffff'
                            ? 'rgba(255,255,255,0.95)'
                            : '#1E1B2E',
                      }}
                    >
                      {lightColor === 'red'
                        ? 'Evitar / Ocasional'
                        : lightColor === 'yellow'
                          ? 'Porciones moderadas'
                          : '¡Todos los días!'}
                    </span>
                    {canTapPlace && (
                      <span className="hidden xl:inline-block text-[11px] font-black uppercase tracking-wider mt-1 opacity-80">
                        Tecla {laneIdx + 1} o toca aquí
                      </span>
                    )}
                  </div>

                  {/* Open Continuous Stage: Adaptive Organic Cluster for Unlimited Classified Foods */}
                  <div
                    className={`flex-1 h-full relative flex items-center min-w-0 overflow-visible px-1 sm:px-2 ${
                      placedFoods.length <= 5
                        ? 'justify-around gap-2 sm:gap-4'
                        : 'justify-start flex-wrap content-center gap-x-1 gap-y-0.5'
                    }`}
                  >
                    {placedFoods.map((placed, idx) => {
                      const isJustPlaced = placed.id === lastPlacedId;
                      const preset =
                        FLOATING_FOOD_PRESETS[idx % FLOATING_FOOD_PRESETS.length];
                      const sizeClasses =
                        placedFoods.length <= 5
                          ? 'w-[92px] h-[92px] sm:w-[116px] sm:h-[116px] xl:w-[136px] xl:h-[136px]'
                          : placedFoods.length <= 10
                            ? 'w-[68px] h-[68px] sm:w-[82px] sm:h-[82px] xl:w-[96px] xl:h-[96px]'
                            : 'w-[54px] h-[54px] sm:w-[64px] sm:h-[64px] xl:w-[74px] xl:h-[74px]';
                      return (
                        <div
                          key={placed.id}
                          data-testid={`semaforo-placed-${placed.foodId}`}
                          className={`relative flex items-center justify-center ${
                            placedFoods.length <= 5 ? 'flex-1 max-w-[156px] h-full' : 'shrink-0'
                          }`}
                          style={{
                            transform: `translateY(${
                              placedFoods.length <= 5 ? preset.translateY : Math.round(preset.translateY * 0.45)
                            }px) rotate(${preset.rotate}deg)`,
                          }}
                        >
                          {isJustPlaced && <SparkleBurst color={rule.bandHex} />}
                          <div
                            className={`relative ${sizeClasses} flex items-center justify-center ${
                              isJustPlaced ? 'animate-drop-bounce' : ''
                            }`}
                            style={{
                              filter: 'drop-shadow(0 8px 10px rgba(30, 27, 46, 0.26))',
                            }}
                          >
                            <div
                              className="alimento-3d-wrapper w-full h-full pointer-events-none"
                              style={{
                                animationDelay: [
                                  '0s',
                                  '-1.2s',
                                  '-2.5s',
                                  '-3.6s',
                                  '-0.8s',
                                  '-2.1s',
                                ][idx % 6],
                              }}
                            >
                              <FoodIllustration
                                foodId={placed.foodId}
                                className="w-full h-full object-contain pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT VERTICAL CONVEYOR-BELT COLUMN (GPU SUB-PIXEL 60/120 FPS PING-PONG) */}
        <aside
          aria-label="Alimentos por clasificar"
          data-testid="semaforo-right-column"
          className="w-[166px] sm:w-[198px] xl:w-[228px] shrink-0 h-full flex flex-col pb-3 sm:pb-4 xl:pb-5 min-h-0"
        >
          <div
            ref={trayScrollRef}
            data-testid="semaforo-tray-scroll"
            className="relative flex-1 min-h-0 overflow-hidden select-none pr-3"
          >
            {/* Soft top & bottom fade viewport so food cards glide cleanly in and out */}
            <div
              className="w-full h-full overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 18px, black calc(100% - 18px), transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 18px, black calc(100% - 18px), transparent 100%)',
              }}
            >
              {roundState.tray.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-center px-2">
                  <p className="font-display text-lg font-bold text-[#1E1B2E]">
                    ¡Todos clasificados!
                  </p>
                </div>
              ) : (
                <div
                  ref={trayTrackRef}
                  className="will-change-transform px-2 py-3 flex flex-col items-center gap-4"
                  style={{ transform: 'translate3d(0, 0px, 0)' }}
                >
                  {roundState.tray.map((entry, idx) => {
                    const { item, rotationDeg } = entry;
                    const isSelected =
                      selectedItemId === item.id || focusedItemId === item.id;
                    const isDragging = draggingItemId === item.id;
                    const isShaking = shakingItemId === item.id;
                    const trayStagger = [
                      '0s',
                      '-1.2s',
                      '-2.5s',
                      '-3.6s',
                      '-0.7s',
                      '-1.9s',
                      '-3.1s',
                    ][idx % 7];

                    return (
                      <button
                        key={item.id}
                        type="button"
                        draggable
                        data-testid={`semaforo-tray-item-${item.foodId}`}
                        onDragStart={(e) => handleDragStartFood(e, item)}
                        onDragEnd={handleDragEndFood}
                        onClick={() => openFocusedFood(item.id)}
                        aria-pressed={isSelected}
                        aria-label={`${item.name}. Toca para votar o arrastra hacia el semáforo`}
                        style={{
                          transform: isSelected
                            ? 'scale(1.06) rotate(0deg)'
                            : `rotate(${rotationDeg}deg)`,
                        }}
                        className={`food-option group shrink-0 w-[132px] h-[132px] sm:w-[152px] sm:h-[152px] xl:w-[172px] xl:h-[172px] p-2.5 rounded-[26px] border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] flex items-center justify-center cursor-pointer active:cursor-grabbing transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                          isSelected
                            ? 'bg-[#fee330] ring-4 ring-[#8137ea]'
                            : 'bg-[#ffffff] hover:bg-[#FFFDF7] hover:scale-105'
                        } ${isDragging ? 'arrastrando' : ''} ${
                          isShaking ? 'animate-plate-wiggle bg-[#fc3e7e]/25' : ''
                        }`}
                      >
                        <div
                          className={`alimento-3d-wrapper pointer-events-none ${
                            isDragging ? 'arrastrando' : ''
                          }`}
                          style={{ animationDelay: trayStagger }}
                        >
                          <FoodIllustration
                            foodId={item.foodId}
                            className="w-24 h-24 sm:w-28 sm:h-28 xl:w-[136px] xl:h-[136px] object-contain pointer-events-none"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* GPU-composited interactive purple scroll indicator */}
            <div
              ref={trayScrollbarRef}
              data-semaforo-scrollbar="true"
              aria-hidden="true"
              className="absolute top-2 bottom-2 right-0.5 w-2 rounded-full bg-[#1E1B2E]/10 transition-opacity duration-200"
            >
              <div
                ref={trayThumbRef}
                className="w-full rounded-full bg-[#8137ea]/55 hover:bg-[#8137ea]/85 cursor-grab active:cursor-grabbing will-change-transform"
                style={{ height: '48px', transform: 'translate3d(0, 0px, 0)' }}
              />
            </div>
          </div>
        </aside>
      </main>

      {/* FOCUSED COLOR VOTING OVERLAY WHEN CLICKING A TRAY FOOD */}
      {focusedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Clasificar alimento en el semáforo"
          data-testid="semaforo-focus-overlay"
          onClick={closeFocusedFood}
          className={`fixed inset-0 z-30 bg-[#1E1B2E]/55 flex flex-col items-center justify-between pt-2 pb-4 sm:pt-3 sm:pb-6 px-4 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isClosingFocus ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Synced Contrarreloj Countdown Display Inside Focus Overlay */}
          {gameMode === 'timed' && (
            <div
              aria-hidden="true"
              className={`fixed top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 h-10 rounded-2xl border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] whitespace-nowrap transition-colors duration-200 ${
                isUrgentTime
                  ? 'bg-[#fc3e7e] text-[#ffffff] animate-semaforo-timer-urgent'
                  : 'bg-[#ffffff] text-[#1E1B2E]'
              }`}
            >
              <Timer
                className={`w-5 h-5 shrink-0 ${
                  isUrgentTime ? 'text-[#ffffff]' : 'text-[#8137ea]'
                }`}
              />
              <span
                className="font-display text-lg sm:text-xl font-bold tabular-nums leading-none"
                style={isUrgentTime ? { textShadow: '0 2px 0 #1E1B2E' } : undefined}
              >
                {formattedCountdown}
              </span>
            </div>
          )}

          {/* Discrete Close (✕) Button */}
          <button
            type="button"
            data-testid="semaforo-focus-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              closeFocusedFood();
            }}
            aria-label="Cerrar selección sin clasificar"
            title="Cerrar (Esc)"
            className="fixed top-5 right-5 sm:top-7 sm:right-7 z-40 w-11 h-11 rounded-full bg-[#ffffff]/95 hover:bg-[#fee330] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#1E1B2E] flex items-center justify-center cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            <X className="w-6 h-6 stroke-[3]" aria-hidden="true" />
          </button>

          {/* Full-Height Layout: Giant Interactive 3D Food Takes Top/Center Space + Color Buttons Anchored Lower */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative flex-1 min-h-0 w-full max-w-5xl flex flex-col items-center justify-between gap-2 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isClosingFocus ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            {/* Extra-Large Interactive 3D Text-Free Food Illustration (No Hover Glow) */}
            <div
              key={focusedItem.id}
              className="relative flex-1 min-h-0 w-full flex items-center justify-center animate-focus-food-elastic"
            >
              <FocusedFood3DShowcase
                foodId={focusedItem.foodId}
                foodName={focusedItem.name}
              />
            </div>

            {/* Bottom Controls: Optional Hint + 3 Large Tactile Circular Color Buttons */}
            <div className="shrink-0 flex flex-col items-center gap-3 pb-1">
              {focusHint && (
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="semaforo-focus-hint"
                  className="animate-guide-fade-slide max-w-xl rounded-3xl bg-[#ffffff] border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] px-6 py-3 text-center"
                >
                  <p className="font-body text-base sm:text-lg font-extrabold text-[#1E1B2E] leading-snug">
                    {focusHint}
                  </p>
                </div>
              )}

              <div
                role="group"
                aria-label="Elige el color del semáforo"
                className="flex items-center justify-center gap-7 sm:gap-11"
              >
                {(
                  [
                    {
                      color: 'red' as TrafficLightColor,
                      bg: '#fc3e7e',
                      highlight: '#FFB3C4',
                      label: 'Clasificar en Luz Roja',
                    },
                    {
                      color: 'yellow' as TrafficLightColor,
                      bg: '#fee330',
                      highlight: '#FFFFD1',
                      label: 'Clasificar en Luz Amarilla',
                    },
                    {
                      color: 'green' as TrafficLightColor,
                      bg: '#5dd118',
                      highlight: '#DCFFAD',
                      label: 'Clasificar en Luz Verde',
                    },
                  ] as const
                ).map((option) => {
                  const isCircleShaking = shakingCircleColor === option.color;
                  const isCircleConfirmed = confirmedCircleColor === option.color;
                  return (
                    <button
                      key={option.color}
                      type="button"
                      data-testid={`focus-vote-${option.color}`}
                      onClick={() => handleFocusColorVote(option.color)}
                      disabled={Boolean(confirmedCircleColor)}
                      aria-label={option.label}
                      style={{
                        backgroundColor: option.bg,
                      }}
                      className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[4.5px] border-[#1E1B2E] shadow-[0_8px_0_#1E1B2E] hover:scale-108 active:translate-y-[5px] flex items-center justify-center cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffffff] ${
                        isCircleShaking ? 'animate-plate-wiggle' : ''
                      } ${
                        isCircleConfirmed
                          ? 'animate-focus-circle-confirm ring-4 ring-[#ffffff]'
                          : ''
                      }`}
                    >
                      {/* Glossy curved glass reflection */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-3 left-4 w-7 h-4 rounded-full -rotate-25 opacity-85"
                        style={{ backgroundColor: option.highlight }}
                      />
                      {isCircleConfirmed && (
                        <Check
                          className="w-11 h-11 text-[#ffffff] drop-shadow-[0_2px_0_#1E1B2E] stroke-[3.5]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINAL 100% VICTORY MODAL */}
      {showVictoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="semaforo-victory-heading"
          data-testid="semaforo-victory-modal"
          className="fixed inset-0 z-40 bg-[#1E1B2E]/60 flex items-center justify-center p-4"
        >
          <div className="animate-modal-pop w-full max-w-lg rounded-[32px] bg-[#ffffff] border-[4px] border-[#1E1B2E] shadow-[0_10px_0_#1E1B2E] p-7 sm:p-8 text-center flex flex-col items-center gap-4">
            <div className="animate-trophy-celebrate w-20 h-20 rounded-3xl bg-[#fee330] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-[#1E1B2E]" aria-hidden="true" />
            </div>

            <h2
              id="semaforo-victory-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-[#8137ea] leading-tight text-balance"
            >
              ¡Felicidades! Eres un experto del Semáforo Saludable
            </h2>

            <p className="text-base sm:text-lg font-bold text-[#1E1B2E]/85 leading-relaxed">
              Clasificaste el 100% de los alimentos en sus luces Roja, Amarilla y Verde.
              ¡Ya sabes qué elegir todos los días!
            </p>

            {gameMode === 'timed' && (
              <p className="font-display text-base sm:text-lg font-bold text-[#1E1B2E] tabular-nums">
                Tiempo restante: {formattedCountdown} · Reto de {timedMinutes} min
              </p>
            )}

            <div className="w-full flex flex-col gap-3 pt-2">
              <button
                type="button"
                data-testid="semaforo-play-again-btn"
                onClick={() => startNewRound()}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-lg font-black border-[3px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                <span>Jugar Otra Ronda</span>
              </button>

              <button
                type="button"
                data-testid="semaforo-victory-change-mode-btn"
                onClick={handleOpenModeSelector}
                className="w-full py-3 px-6 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-base font-extrabold border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
                <span>Cambiar Modo de Juego</span>
              </button>

              <button
                type="button"
                onClick={onBackToLibrary}
                className="w-full py-3 px-6 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-base font-extrabold border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                Volver a la Biblioteca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATED TIME'S UP DEFEAT MODAL (CONTRARRELOJ 00:00) */}
      {showTimeUpModal && (
        <SemaforoTimeUpModal
          progress={progress}
          timedMinutes={timedMinutes}
          onRetryTimed={() => startNewRound(timedMinutes)}
          onChangeMode={handleOpenModeSelector}
        />
      )}
    </div>
  );
};
