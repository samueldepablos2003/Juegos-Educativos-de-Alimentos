import React, { memo, useEffect, useRef, useState } from 'react';
import { Sparkles, Star, Trophy } from 'lucide-react';

interface PlateProgressBarProps {
  filledCount: number;
  totalSlots?: number;
}

const AMBIENT_LIQUID_BUBBLES = [
  { left: '18%', size: 7, delay: '0s', duration: '2.6s' },
  { left: '62%', size: 10, delay: '0.45s', duration: '3.1s' },
  { left: '36%', size: 6, delay: '0.95s', duration: '2.3s' },
  { left: '74%', size: 8, delay: '1.35s', duration: '2.9s' },
  { left: '26%', size: 9, delay: '1.8s', duration: '3.4s' },
  { left: '50%', size: 5, delay: '0.25s', duration: '2.2s' },
  { left: '80%', size: 6, delay: '2.15s', duration: '2.7s' },
  { left: '42%', size: 8, delay: '1.55s', duration: '3.0s' },
  { left: '16%', size: 5, delay: '2.5s', duration: '2.4s' },
  { left: '66%', size: 7, delay: '0.7s', duration: '2.8s' },
];

const SURGE_LIQUID_BUBBLES = [
  { left: '20%', size: 9, delay: '0s', duration: '1.15s' },
  { left: '46%', size: 11, delay: '0.06s', duration: '1.3s' },
  { left: '70%', size: 8, delay: '0.1s', duration: '1.1s' },
  { left: '32%', size: 7, delay: '0.14s', duration: '1.25s' },
  { left: '58%', size: 9, delay: '0.18s', duration: '1.35s' },
  { left: '78%', size: 6, delay: '0.22s', duration: '1.05s' },
  { left: '38%', size: 10, delay: '0.08s', duration: '1.4s' },
];

function getLiquidTheme(percent: number): {
  gradient: string;
  waveColor: string;
  waveBackColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
} {
  if (percent >= 100) {
    return {
      gradient:
        'linear-gradient(0deg, #fee330 0%, #5dd118 25%, #4efcfb 50%, #fc3e7e 75%, #fee330 100%)',
      waveColor: '#fc3e7e',
      waveBackColor: '#ff7aa8',
      glowColor: 'rgba(254, 227, 48, 0.85)',
      badgeBg: 'bg-[#5dd118]',
      badgeText: 'text-[#ffffff]',
    };
  }
  if (percent >= 80) {
    return {
      gradient:
        'linear-gradient(0deg, #fee330 0%, #6ee724 50%, #22d3ee 100%)',
      waveColor: '#22d3ee',
      waveBackColor: '#67e8f9',
      glowColor: 'rgba(34, 211, 238, 0.65)',
      badgeBg: 'bg-[#fee330]',
      badgeText: 'text-[#1E1B2E]',
    };
  }
  if (percent >= 60) {
    return {
      gradient:
        'linear-gradient(0deg, #fee330 0%, #98e020 46%, #5dd118 100%)',
      waveColor: '#5dd118',
      waveBackColor: '#86ef3c',
      glowColor: 'rgba(93, 209, 24, 0.55)',
      badgeBg: 'bg-[#ffffff]',
      badgeText: 'text-[#1E1B2E]',
    };
  }
  if (percent >= 40) {
    return {
      gradient: 'linear-gradient(0deg, #f59e0b 0%, #fee330 52%, #a3e635 100%)',
      waveColor: '#a3e635',
      waveBackColor: '#bef264',
      glowColor: 'rgba(163, 230, 53, 0.55)',
      badgeBg: 'bg-[#ffffff]',
      badgeText: 'text-[#1E1B2E]',
    };
  }
  return {
    gradient: 'linear-gradient(0deg, #f97316 0%, #fbbf24 55%, #fee330 100%)',
    waveColor: '#fee330',
    waveBackColor: '#fef08a',
    glowColor: 'rgba(254, 227, 48, 0.55)',
    badgeBg: 'bg-[#ffffff]',
    badgeText: 'text-[#1E1B2E]',
  };
}

export const PlateProgressBar: React.FC<PlateProgressBarProps> = memo(
  ({ filledCount, totalSlots = 5 }) => {
    const percent = Math.min(
      100,
      Math.max(0, Math.round((filledCount / totalSlots) * 100))
    );
    const isComplete = percent >= 100;
    const theme = getLiquidTheme(percent);

    const prevPercentRef = useRef<number>(percent);
    const [displayPercent, setDisplayPercent] = useState<number>(percent);
    const [burstKey, setBurstKey] = useState<number>(0);
    const [showBubbleSurge, setShowBubbleSurge] = useState<boolean>(false);
    const [deltaLabel, setDeltaLabel] = useState<string | null>(null);

    // Smooth rolling percentage counter + gentle rising bubbles & "+20%" label (zero screen/bar shake)
    useEffect(() => {
      const start = prevPercentRef.current;
      const end = percent;
      const diff = end - start;

      let rafId = 0;
      const durationMs = 520;
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayPercent(Math.round(start + diff * eased));
        if (t < 1) {
          rafId = window.requestAnimationFrame(tick);
        }
      };

      if (diff !== 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayPercent(end);
      }

      let deltaTimer: number | undefined;
      let surgeTimer: number | undefined;
      if (diff > 0) {
        setBurstKey((k) => k + 1);
        setShowBubbleSurge(true);
        setDeltaLabel(end >= 100 ? '¡100%!' : `+${diff}%`);
        deltaTimer = window.setTimeout(() => {
          setDeltaLabel(null);
        }, 950);
        surgeTimer = window.setTimeout(() => {
          setShowBubbleSurge(false);
        }, 1600);
      }

      prevPercentRef.current = end;

      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
        if (deltaTimer !== undefined) window.clearTimeout(deltaTimer);
        if (surgeTimer !== undefined) window.clearTimeout(surgeTimer);
      };
    }, [percent]);

    const statusText = `${displayPercent}%`;

    return (
      <div
        className="shrink-0 flex flex-col items-center justify-center gap-2.5 pl-1 sm:pl-2.5 z-20 self-start mt-1 sm:mt-2"
        data-testid="plate-progress-bar"
        aria-label={`Progreso del plato: ${percent}%`}
      >
        {/* Top 100% Goal Trophy / Steady Star Emblem (Zero shake or vibration) */}
        <div
          className={`relative shrink-0 w-14 h-14 sm:w-[64px] sm:h-[64px] xl:w-[70px] xl:h-[70px] rounded-2xl border-[3.5px] border-[#1E1B2E] flex items-center justify-center shadow-[0_5px_0_#1E1B2E] transition-colors duration-200 ${
            isComplete
              ? 'bg-[#fee330] text-[#1E1B2E] ring-4 ring-[#ffffff]/90'
              : percent > 0
                ? 'bg-[#fee330] text-[#1E1B2E]'
                : 'bg-[#ffffff] text-[#1E1B2E]/45'
          }`}
          style={
            percent > 0
              ? {
                  boxShadow: `0 5px 0 #1E1B2E, 0 0 18px ${theme.glowColor}`,
                }
              : undefined
          }
          title="Meta 100%"
          aria-hidden="true"
        >
          {/* GPU-composited inner fill glow rising inside the star badge (scaleY instead of clip-path) */}
          {!isComplete && percent > 0 && (
            <span
              className="pointer-events-none absolute inset-1 rounded-xl bg-[#ffffff]/35 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `scaleY(${Math.max(0, Math.min(1, percent / 100))})`,
              }}
            />
          )}

          {isComplete ? (
            <Trophy className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 stroke-[2.6] pointer-events-none" />
          ) : (
            <Star
              className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] pointer-events-none transition-colors duration-200 ${
                percent > 0 ? 'fill-[#ffffff] text-[#1E1B2E]' : ''
              }`}
            />
          )}
        </div>

        {/* Prominent Wider & Taller Vertical Glass Tube with GPU-Accelerated Smooth Rising Liquid */}
        <div className="relative flex items-center justify-center">
          {/* Outer Glass Cylinder */}
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`relative w-14 sm:w-[68px] xl:w-[76px] h-[280px] sm:h-[360px] lg:h-[420px] xl:h-[470px] max-h-[calc(100vh_-_315px)] min-h-[210px] rounded-full bg-[#ffffff] border-[3.5px] border-[#1E1B2E] shadow-[0_7px_0_#1E1B2E,inset_0_4px_12px_rgba(30,27,46,0.14)] overflow-hidden ${
              isComplete ? 'ring-4 ring-[#fee330]' : ''
            }`}
          >
            {/* Subtle Inner Glass Reflection Texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, transparent 30%, transparent 76%, rgba(30,27,46,0.09) 100%)',
              }}
            />

            {/* Pure GPU Rising Liquid Column (translate3d instead of height transition — zero reflow) */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translate3d(0, ${100 - percent}%, 0)`,
              }}
            >
              {/* Liquid Gradient Fill Layer (oversized GPU-translated strip when rainbow complete) */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute inset-x-0 top-0 ${
                    isComplete ? 'h-[200%] animate-meter-rainbow' : 'h-full'
                  }`}
                  style={{
                    backgroundImage: theme.gradient,
                  }}
                />
              </div>

              {/* Dual-Layer Animated Liquid Wave Crest Riding Top Meniscus */}
              {percent > 0 && percent < 100 && (
                <>
                  {/* Back Translucent Wave */}
                  <svg
                    viewBox="0 0 120 20"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="animate-meter-wave-slow pointer-events-none absolute -top-[11px] left-0 w-[200%] h-[16px] opacity-55"
                  >
                    <path
                      d="M0 10 Q 15 18, 30 10 T 60 10 T 90 10 T 120 10 L120 20 L0 20 Z"
                      fill={theme.waveBackColor}
                    />
                  </svg>

                  {/* Front Crisp Glossy Liquid Wave */}
                  <svg
                    viewBox="0 0 120 20"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="animate-meter-wave pointer-events-none absolute -top-[10px] left-0 w-[200%] h-[15px]"
                  >
                    <path
                      d="M0 10 Q 15 2, 30 10 T 60 10 T 90 10 T 120 10 L120 20 L0 20 Z"
                      fill={theme.waveColor}
                    />
                    <path
                      d="M0 10 Q 15 3.5, 30 10 T 60 10 T 90 10 T 120 10"
                      fill="none"
                      stroke="#ffffff"
                      strokeOpacity="0.78"
                      strokeWidth="2.4"
                    />
                  </svg>
                </>
              )}

              {/* Gentle Rising Liquid Luminance Sweep */}
              {percent > 0 && (
                <div
                  aria-hidden="true"
                  className="animate-progress-shimmer-vertical pointer-events-none absolute inset-x-0 -bottom-1/2 h-1/2"
                  style={{
                    background:
                      'linear-gradient(15deg, transparent 14%, rgba(255, 255, 255, 0.48) 50%, transparent 86%)',
                  }}
                />
              )}

              {/* Left Glossy Tube Highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-2.5 left-2 w-2.5 sm:w-3 rounded-full bg-[#ffffff]/60"
              />
            </div>

            {/* Bubbles clipped cleanly inside the filled liquid height */}
            {percent > 0 && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `inset(${100 - percent}% 0 0 0)`,
                }}
              >
                {AMBIENT_LIQUID_BUBBLES.map((b, idx) => (
                  <span
                    key={idx}
                    className="animate-meter-bubble pointer-events-none absolute bottom-1 rounded-full border border-[#ffffff]/90"
                    style={{
                      left: b.left,
                      width: `${b.size}px`,
                      height: `${b.size}px`,
                      background:
                        'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 65%, rgba(255,255,255,0.18) 100%)',
                      animationDelay: b.delay,
                      animationDuration: b.duration,
                    }}
                  />
                ))}

                {showBubbleSurge && (
                  <div
                    key={`surge-${burstKey}`}
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                  >
                    {SURGE_LIQUID_BUBBLES.map((b, idx) => (
                      <span
                        key={idx}
                        className="animate-meter-bubble-surge pointer-events-none absolute bottom-0 rounded-full border border-[#ffffff]"
                        style={{
                          left: b.left,
                          width: `${b.size}px`,
                          height: `${b.size}px`,
                          background:
                            'radial-gradient(circle at 30% 30%, #ffffff 0%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.2) 100%)',
                          animationDelay: b.delay,
                          animationDuration: b.duration,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4 Steady Milestone Checkpoints (20%, 40%, 60%, 80%) */}
            <div className="pointer-events-none absolute inset-0 flex flex-col-reverse justify-evenly items-center">
              {[20, 40, 60, 80].map((milestone) => {
                const reached = percent >= milestone;
                return (
                  <div
                    key={milestone}
                    className="relative w-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span
                      className={`w-full h-[2px] transition-colors duration-200 ${
                        reached ? 'bg-[#ffffff]/55' : 'bg-[#1E1B2E]/14'
                      }`}
                    />
                    <span
                      className={`absolute w-3 h-3 rounded-full border-2 border-[#1E1B2E] transition-colors duration-200 ${
                        reached
                          ? 'bg-[#fee330] shadow-[0_0_8px_rgba(254,227,48,0.85)]'
                          : 'bg-[#ffffff] opacity-80'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gentle Floating "+20%" Score Indicator Next to the Liquid Crest */}
          {deltaLabel && (
            <div
              key={`delta-${burstKey}`}
              aria-hidden="true"
              className="animate-meter-delta pointer-events-none absolute left-[calc(100%+10px)] z-30 whitespace-nowrap px-3 py-1 rounded-xl bg-[#fee330] border-[2.5px] border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] font-display text-sm sm:text-base font-bold text-[#1E1B2E] flex items-center gap-1"
              style={{
                bottom: `calc(${Math.min(Math.max(percent, 12), 92)}% - 14px)`,
              }}
            >
              <Sparkles className="w-4 h-4 text-[#8137ea] pointer-events-none" />
              <span>{deltaLabel}</span>
            </div>
          )}
        </div>

        {/* Steady Percentage Counter Pill (Zero Shake/Pop) */}
        <div
          className={`px-3.5 py-1.5 rounded-2xl border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] transition-colors duration-200 ${theme.badgeBg} ${theme.badgeText}`}
        >
          <span
            data-testid="plate-progress-percent"
            className="font-display text-base sm:text-lg font-bold tabular-nums leading-none block"
          >
            {statusText}
          </span>
        </div>
      </div>
    );
  }
);

PlateProgressBar.displayName = 'PlateProgressBar';
