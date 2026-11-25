import React, { useEffect, useState } from 'react';
import { RotateCcw, Home, BarChart3, Gamepad2, Timer } from 'lucide-react';
import { FAMILY_TIPS, GameMode, PlateState } from '../data/foods';
import { isRainbowPlate } from '../game/rules';
import { formatNutriPlatoTime } from '../game/nutriplatoModes';
import { FoodIllustration } from './FoodIllustration';

interface VictoryModalProps {
  plate: PlateState;
  mode: GameMode;
  tipIndex: number;
  timedSummary?: {
    minutes: number;
    remainingSeconds: number;
  };
  onPlayAgain: () => void;
  onChangeMode?: () => void;
  onGoTitle: () => void;
  onOpenVolunteer: () => void;
}

const CONFETTI_PIECES = [
  { left: '6%', color: '#fc3e7e', delay: '0s', dur: '3.4s' },
  { left: '14%', color: '#fee330', delay: '0.5s', dur: '3.8s' },
  { left: '22%', color: '#5dd118', delay: '0.2s', dur: '3.2s' },
  { left: '31%', color: '#4efcfb', delay: '0.9s', dur: '4.1s' },
  { left: '40%', color: '#fc3e7e', delay: '0.3s', dur: '3.5s' },
  { left: '52%', color: '#fee330', delay: '0.7s', dur: '3.9s' },
  { left: '61%', color: '#8137ea', delay: '0.1s', dur: '3.3s' },
  { left: '70%', color: '#5dd118', delay: '0.6s', dur: '4.0s' },
  { left: '79%', color: '#fee330', delay: '0.4s', dur: '3.6s' },
  { left: '88%', color: '#4efcfb', delay: '0.8s', dur: '3.7s' },
  { left: '94%', color: '#8137ea', delay: '0.2s', dur: '3.4s' },
];

export const VictoryModal: React.FC<VictoryModalProps> = ({
  plate,
  tipIndex,
  timedSummary,
  onPlayAgain,
  onChangeMode,
  onGoTitle,
  onOpenVolunteer,
}) => {
  const rainbow = isRainbowPlate([...plate.vegetables, ...plate.fruits]);
  const chosenFoods = Array.from(
    new Map(
      [
        ...plate.vegetables,
        ...plate.fruits,
        ...plate.cereals,
        ...plate.protein,
        ...plate.fats,
        ...(plate.hydration ? [plate.hydration] : []),
      ].map((f) => [f.id, f])
    ).values()
  );

  const familyTip = FAMILY_TIPS[tipIndex % FAMILY_TIPS.length];
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowConfetti(false), 4900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-heading"
      className="fixed inset-0 z-40 bg-[#1E1B2E]/65 flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Animated Confetti (automatically unmounted after falling to keep DOM lightweight) */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          {CONFETTI_PIECES.map((c, idx) => (
            <div
              key={idx}
              className="animate-confetti absolute -top-6 w-4 h-6 rounded-sm"
              style={{
                left: c.left,
                backgroundColor: c.color,
                animationDelay: c.delay,
                animationDuration: c.dur,
              }}
            />
          ))}
        </div>
      )}

      {/* Victory Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#ffffff] border-4 border-[#1E1B2E] rounded-3xl shadow-[0_12px_0_#1E1B2E] p-5 xl:p-7 flex flex-col gap-4 max-h-[94vh] overflow-y-auto">
        {/* Top Header with Medal SVG */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Bespoke Golden Medal SVG */}
          <svg
            viewBox="0 0 110 110"
            className="w-24 h-24 shrink-0 drop-shadow-md animate-puppy-breathe"
            aria-hidden="true"
          >
            <path d="M35 60 L22 102 L42 94 L50 105 L54 64 Z" fill="#fc3e7e" stroke="#1E1B2E" strokeWidth="3" />
            <path d="M75 60 L88 102 L68 94 L60 105 L56 64 Z" fill="#8137ea" stroke="#1E1B2E" strokeWidth="3" />
            <circle cx="55" cy="46" r="34" fill="#fee330" stroke="#1E1B2E" strokeWidth="4" />
            <circle cx="55" cy="46" r="26" fill="#ffffff" fillOpacity="0.45" stroke="#1E1B2E" strokeWidth="2.5" />
            <path
              d="M55 24 L61 37 L75 39 L65 49 L67 63 L55 56 L43 63 L45 49 L35 39 L49 37 Z"
              fill="#5dd118"
              stroke="#1E1B2E"
              strokeWidth="2.4"
            />
          </svg>

          <div className="flex-1">
            <p className="text-sm font-extrabold uppercase tracking-wider text-[#8137ea]">
              NutriPlato · ¡Misión Cumplida!
            </p>
            <h2
              id="victory-heading"
              className="font-display text-3xl xl:text-4xl font-bold text-[#1E1B2E] leading-tight"
            >
              ¡Eres un Súper Chef Saludable!
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {rainbow && (
                <p className="inline-block text-sm xl:text-base font-extrabold text-[#1E1B2E] bg-[#fee330] px-3 py-1 rounded-xl border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E]">
                  Bonus Desbloqueado: ¡Plato Arcoíris de Colores!
                </p>
              )}
              {timedSummary && (
                <p className="inline-flex items-center gap-1.5 text-sm xl:text-base font-extrabold text-[#ffffff] bg-[#fc3e7e] px-3 py-1 rounded-xl border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] tabular-nums">
                  <Timer className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    Contrarreloj ({timedSummary.minutes} min) · Tiempo restante{' '}
                    {formatNutriPlatoTime(timedSummary.remainingSeconds)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Superpowers Summary Grid */}
        <div>
          <h3 className="text-sm xl:text-base font-extrabold text-[#1E1B2E] mb-2">
            Los superpoderes de tu plato:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {chosenFoods.map((food, idx) => {
              const staggerDelays = ['0s', '-1.2s', '-2.5s', '-3.5s', '-0.8s'];
              return (
                <div
                  key={food.id}
                  className="bg-[#FFFDF7] border-2 border-[#1E1B2E] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-[0_3px_0_#1E1B2E]"
                >
                  <div
                    className="alimento-3d-wrapper"
                    style={{ animationDelay: staggerDelays[idx % staggerDelays.length] }}
                  >
                    <FoodIllustration foodId={food.id} className="w-16 h-16" />
                  </div>
                  <span className="text-xs xl:text-sm font-extrabold text-[#1E1B2E] mt-1 leading-tight">
                    {food.name}
                  </span>
                  <span className="text-[11px] font-bold text-[#8137ea] mt-0.5 leading-tight">
                    {food.superpower}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practical Tip for the Family */}
        <div className="bg-[#4efcfb]/20 border-2 border-[#1E1B2E] rounded-2xl p-3.5 xl:p-4">
          <h3 className="text-sm xl:text-base font-black text-[#1E1B2E]">
            Consejo Práctico para la Familia:
          </h3>
          <p className="text-sm xl:text-base font-semibold text-[#1E1B2E] mt-1 leading-snug">
            {familyTip}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onOpenVolunteer}
            className="px-4 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#FFFDF7] border-2 border-[#1E1B2E] border-b-[4px] text-sm font-bold text-[#1E1B2E] flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#8137ea]" aria-hidden="true" />
            <span>Panel Voluntario</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 ml-auto">
            {onChangeMode && (
              <button
                type="button"
                onClick={onChangeMode}
                className="px-4 py-3 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] text-base font-extrabold text-[#1E1B2E] flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Modo de Juego</span>
              </button>
            )}

            <button
              type="button"
              onClick={onGoTitle}
              className="px-5 py-3 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] text-base font-extrabold text-[#1E1B2E] flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              data-start="true"
              onClick={onPlayAgain}
              className="px-7 py-3 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-lg xl:text-xl font-black border-[3px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              <span>Jugar Otra Vez</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
