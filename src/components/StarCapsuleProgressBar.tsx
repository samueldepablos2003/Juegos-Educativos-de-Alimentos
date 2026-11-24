import React from 'react';

export interface StarCapsuleProgressBarProps {
  /** Integer 0..100 */
  progress: number;
  /** Optional accessible label */
  ariaLabel?: string;
  /** Size variant for main headers or compact team panels */
  size?: 'sm' | 'md' | 'lg';
  /** Flash coral/red briefly when an error happens */
  isWarningFlash?: boolean;
  /** Key incremented on error to retrigger flash */
  warningFlashKey?: number;
  /** Key incremented on increase to retrigger shimmer sweep */
  celebrateKey?: number;
  /** Optional custom fill gradient */
  fillGradient?: string;
  /** Optional data-testid */
  testId?: string;
}

const SIZE_CLASSES: Record<
  NonNullable<StarCapsuleProgressBarProps['size']>,
  {
    percent: string;
    track: string;
    starWrap: string;
    starSvg: string;
  }
> = {
  sm: {
    percent: 'text-sm sm:text-base min-w-[40px]',
    track: 'w-32 sm:w-44 h-6 border-[3px] shadow-[0_3px_0_#1E1B2E,inset_0_2px_4px_rgba(30,27,46,0.14)]',
    starWrap: 'w-9 h-9 -ml-4 border-[3px] shadow-[0_3px_0_#1E1B2E]',
    starSvg: 'w-5 h-5',
  },
  md: {
    percent: 'text-base sm:text-lg xl:text-xl min-w-[46px]',
    track: 'w-40 sm:w-56 lg:w-64 xl:w-72 h-7 sm:h-8 border-[3.5px] shadow-[0_4px_0_#1E1B2E,inset_0_2px_5px_rgba(30,27,46,0.14)]',
    starWrap: 'w-11 h-11 sm:w-12 sm:h-12 -ml-5 border-[3.5px] shadow-[0_4px_0_#1E1B2E]',
    starSvg: 'w-6 h-6',
  },
  lg: {
    percent: 'text-lg sm:text-xl xl:text-2xl min-w-[52px]',
    track: 'w-44 sm:w-68 lg:w-80 xl:w-[370px] h-8 sm:h-9 border-[3.5px] shadow-[0_5px_0_#1E1B2E,inset_0_3px_6px_rgba(30,27,46,0.14)]',
    starWrap: 'w-12 h-12 sm:w-[54px] sm:h-[54px] -ml-5 border-[3.5px] shadow-[0_5px_0_#1E1B2E]',
    starSvg: 'w-7 h-7',
  },
};

const DEFAULT_GRADIENT =
  'linear-gradient(90deg, #a3e635 0%, #5dd118 52%, #22c55e 100%)';

const COMPLETE_GRADIENT =
  'linear-gradient(90deg, #fee330 0%, #5dd118 35%, #22d3ee 68%, #fee330 100%)';

export const StarCapsuleProgressBar: React.FC<StarCapsuleProgressBarProps> = React.memo(
  ({
    progress,
    ariaLabel,
    size = 'lg',
    isWarningFlash = false,
    warningFlashKey = 0,
    celebrateKey = 0,
    fillGradient,
    testId,
  }) => {
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    const isComplete = clamped >= 100;
    const classes = SIZE_CLASSES[size];

    const resolvedGradient = isWarningFlash
      ? 'linear-gradient(90deg, #fb7185 0%, #ef4444 55%, #dc2626 100%)'
      : isComplete
        ? COMPLETE_GRADIENT
        : fillGradient ?? DEFAULT_GRADIENT;

    return (
      <div
        data-testid={testId}
        className="relative inline-flex items-center gap-2 sm:gap-2.5 shrink-0"
      >
        <span
          className={`font-display font-bold tabular-nums text-right transition-colors duration-200 ${classes.percent} ${
            isWarningFlash ? 'text-[#dc2626]' : 'text-[#1E1B2E]'
          }`}
          style={{ textShadow: '0 2px 0 rgba(255,255,255,0.88)' }}
        >
          {clamped}%
        </span>

        <div className="relative flex items-center">
          <div
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel ?? `Progreso: ${clamped}%`}
            className={`relative rounded-full bg-[#ffffff] border-[#1E1B2E] overflow-hidden ${classes.track}`}
          >
            {/* Subtle Glass Tube Specular Depth */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, transparent 40%, transparent 78%, rgba(30,27,46,0.08) 100%)',
              }}
            />

            {/* Warning Flash Overlay on Error */}
            {isWarningFlash && (
              <div
                key={`warn-${warningFlashKey}`}
                aria-hidden="true"
                className="animate-semaforo-warning-flash pointer-events-none absolute inset-0 z-20 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(239,68,68,0.42) 0%, rgba(239,68,68,0.18) 55%, rgba(239,68,68,0.45) 100%)',
                }}
              />
            )}

            {/* GPU-Accelerated Elastic Liquid Fill */}
            <div
              className="relative w-full h-full rounded-l-full will-change-transform transition-transform duration-[560ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transform: `translate3d(${clamped - 100}%, 0, 0)`,
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-l-full"
              >
                <div
                  className={`absolute inset-y-0 left-0 ${
                    isComplete ? 'w-[200%] animate-meter-rainbow-h' : 'w-full'
                  }`}
                  style={{ backgroundImage: resolvedGradient }}
                />
              </div>

              {clamped > 0 && celebrateKey > 0 && (
                <div
                  key={`gloss-${celebrateKey}`}
                  aria-hidden="true"
                  className="animate-semaforo-shimmer-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 8%, rgba(255,255,255,0.72) 50%, transparent 92%)',
                  }}
                />
              )}

              {/* Top Curved Gloss Highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 top-1 h-1.5 rounded-full bg-[#ffffff]/60"
              />
            </div>
          </div>

          {/* Integrated Right Circular Star Emblem */}
          <div
            key={`star-${isComplete ? 'full' : celebrateKey}`}
            aria-hidden="true"
            className={`relative z-10 rounded-full border-[#1E1B2E] flex items-center justify-center shrink-0 transition-colors duration-200 ${classes.starWrap} ${
              isComplete
                ? 'bg-[#fee330] animate-meter-goal-pulse'
                : clamped > 0
                  ? 'bg-[#fffbeb]'
                  : 'bg-[#ffffff]'
            }`}
          >
            <svg viewBox="0 0 28 28" className={classes.starSvg}>
              <path
                d="M14 2.5 L17.3 9.7 L25.2 10.6 L19.2 15.9 L20.9 23.6 L14 19.6 L7.1 23.6 L8.8 15.9 L2.8 10.6 L10.7 9.7 Z"
                fill={
                  isComplete
                    ? '#ffffff'
                    : clamped >= 50
                      ? '#fee330'
                      : clamped > 0
                        ? '#fde047'
                        : 'none'
                }
                stroke={clamped > 0 ? '#1E1B2E' : '#94a3b8'}
                strokeWidth="2.3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

StarCapsuleProgressBar.displayName = 'StarCapsuleProgressBar';
