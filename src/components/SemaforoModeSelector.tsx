import React, { useState } from 'react';
import {
  BookOpen,
  Gamepad2,
  Home,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  SEMAFORO_TIMED_DURATIONS_MIN,
  SemaforoGameMode,
  SemaforoTimedDurationMinutes,
} from '../game/semaforoRules';
import { SoundToggleButton } from './SoundToggleButton';
import { playUiClickSound } from '../utils/soundSystem';

interface SemaforoModeSelectorProps {
  currentMode: SemaforoGameMode;
  selectedMinutes: SemaforoTimedDurationMinutes;
  onBackToLibrary: () => void;
  onBackToGuide: () => void;
  onSelectNormal: () => void;
  onConfirmTimed: (minutes: SemaforoTimedDurationMinutes) => void;
}

const NormalModeBookIcon: React.FC = () => (
  <svg
    viewBox="0 0 88 88"
    className="w-20 h-20 sm:w-24 sm:h-24 xl:w-[104px] xl:h-[104px] shrink-0 drop-shadow-[0_4px_0_rgba(30,27,46,0.28)]"
    aria-hidden="true"
  >
    {/* Open Book Base Pages */}
    <path
      d="M12 31 C22 25, 36 26, 44 33 C52 26, 66 25, 76 31 L76 68 C66 62, 52 63, 44 70 C36 63, 22 62, 12 68 Z"
      fill="#ffffff"
      stroke="#1E1B2E"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Book Spine Divider */}
    <line
      x1="44"
      y1="33"
      x2="44"
      y2="70"
      stroke="#1E1B2E"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Page Lines Left */}
    <line
      x1="20"
      y1="42"
      x2="36"
      y2="43"
      stroke="#5dd118"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <line
      x1="20"
      y1="52"
      x2="35"
      y2="53"
      stroke="#1E1B2E"
      strokeOpacity="0.28"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Page Lines Right */}
    <line
      x1="52"
      y1="43"
      x2="68"
      y2="42"
      stroke="#5dd118"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <line
      x1="53"
      y1="53"
      x2="68"
      y2="52"
      stroke="#1E1B2E"
      strokeOpacity="0.28"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Floating Golden Learning Star */}
    <path
      d="M44 8 L48.3 17.5 L58.6 18.6 L50.8 25.5 L53 35.6 L44 30.3 L35 35.6 L37.2 25.5 L29.4 18.6 L39.7 17.5 Z"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <circle cx="41" cy="19.5" r="2.2" fill="#ffffff" opacity="0.9" />
  </svg>
);

const TimedModeStopwatchIcon: React.FC = () => (
  <svg
    viewBox="0 0 88 88"
    className="w-20 h-20 sm:w-24 sm:h-24 xl:w-[104px] xl:h-[104px] shrink-0 drop-shadow-[0_4px_0_rgba(30,27,46,0.28)]"
    aria-hidden="true"
  >
    {/* Top Crown Button */}
    <rect
      x="34"
      y="8"
      width="20"
      height="8"
      rx="4"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="3.5"
    />
    <rect
      x="40"
      y="16"
      width="8"
      height="7"
      fill="#1E1B2E"
    />
    {/* Angled Side Trigger Button */}
    <path
      d="M64 23 L71 17 L76 23 L69 29 Z"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    {/* Outer Vibrant Stopwatch Rim */}
    <circle
      cx="44"
      cy="51"
      r="29"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="4.2"
    />
    {/* Crisp White Dial Face */}
    <circle
      cx="44"
      cy="51"
      r="21.5"
      fill="#ffffff"
      stroke="#1E1B2E"
      strokeWidth="3"
    />
    {/* Active Speed Wedge */}
    <path
      d="M44 51 L44 33 A18 18 0 0 1 60 59 Z"
      fill="#fc3e7e"
      opacity="0.28"
    />
    {/* Dial Tick Marks */}
    <line x1="44" y1="33" x2="44" y2="37" stroke="#1E1B2E" strokeWidth="3" strokeLinecap="round" />
    <line x1="62" y1="51" x2="58" y2="51" stroke="#1E1B2E" strokeWidth="3" strokeLinecap="round" />
    <line x1="44" y1="69" x2="44" y2="65" stroke="#1E1B2E" strokeWidth="3" strokeLinecap="round" />
    <line x1="26" y1="51" x2="30" y2="51" stroke="#1E1B2E" strokeWidth="3" strokeLinecap="round" />
    {/* Clock Hands */}
    <line
      x1="44"
      y1="51"
      x2="44"
      y2="37"
      stroke="#1E1B2E"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
    <line
      x1="44"
      y1="51"
      x2="56"
      y2="56"
      stroke="#fc3e7e"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
    {/* Center Hub */}
    <circle cx="44" cy="51" r="4" fill="#1E1B2E" />
  </svg>
);

const PausedClockTimeUpIllustration: React.FC = () => (
  <svg
    viewBox="0 0 132 118"
    className="w-28 h-24 sm:w-32 sm:h-28 shrink-0 animate-semaforo-clock-bounce"
    aria-hidden="true"
  >
    {/* Soft Ground Contact Shadow */}
    <ellipse cx="66" cy="109" rx="44" ry="7" fill="#1E1B2E" opacity="0.14" />

    {/* Side Alarm Bells */}
    <path
      d="M27 28 C21 20, 29 11, 39 16 L44 22 L32 33 Z"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M105 28 C111 20, 103 11, 93 16 L88 22 L100 33 Z"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* Top Handle Stem */}
    <rect
      x="55"
      y="10"
      width="22"
      height="8"
      rx="4"
      fill="#8137ea"
      stroke="#1E1B2E"
      strokeWidth="3.5"
    />
    <rect x="62" y="18" width="8" height="7" fill="#1E1B2E" />

    {/* Clock Feet */}
    <path d="M40 94 L32 105" stroke="#1E1B2E" strokeWidth="6" strokeLinecap="round" />
    <path d="M92 94 L100 105" stroke="#1E1B2E" strokeWidth="6" strokeLinecap="round" />

    {/* Main Coral Clock Body */}
    <circle
      cx="66"
      cy="61"
      r="38"
      fill="#fc3e7e"
      stroke="#1E1B2E"
      strokeWidth="4.8"
    />
    {/* Glossy Top Rim Reflection */}
    <path
      d="M42 36 A30 30 0 0 1 64 29"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.55"
      strokeWidth="4.5"
      strokeLinecap="round"
    />

    {/* White Inner Dial */}
    <circle
      cx="66"
      cy="61"
      r="28.5"
      fill="#FFFDF7"
      stroke="#1E1B2E"
      strokeWidth="3.5"
    />

    {/* Pause Bars Inside Clock Face (Signaling Time Stopped Clearly) */}
    <rect
      x="54"
      y="47"
      width="9"
      height="28"
      rx="4.5"
      fill="#8137ea"
      stroke="#1E1B2E"
      strokeWidth="3"
    />
    <rect
      x="69"
      y="47"
      width="9"
      height="28"
      rx="4.5"
      fill="#8137ea"
      stroke="#1E1B2E"
      strokeWidth="3"
    />

    {/* Expressive Mini Ringing Arcs */}
    <path
      d="M15 24 C12 31, 13 38, 17 44"
      fill="none"
      stroke="#fc3e7e"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M117 24 C120 31, 119 38, 115 44"
      fill="none"
      stroke="#fc3e7e"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const SemaforoModeSelector: React.FC<SemaforoModeSelectorProps> = ({
  currentMode,
  selectedMinutes,
  onBackToLibrary,
  onBackToGuide,
  onSelectNormal,
  onConfirmTimed,
}) => {
  const [isTimedSelected, setIsTimedSelected] = useState<boolean>(
    currentMode === 'timed'
  );
  const [draftMinutes, setDraftMinutes] =
    useState<SemaforoTimedDurationMinutes>(selectedMinutes);

  return (
    <div
      data-testid="semaforo-mode-screen"
      className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between px-4 py-3 sm:px-7 sm:py-4 xl:px-10 xl:py-5 gap-3 sm:gap-4"
    >
      {/* Clean Header Matching El Semáforo Visual Identity */}
      <header className="relative z-10 w-full flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToLibrary}
            aria-label="Volver a la biblioteca"
            title="Biblioteca de Juegos"
            className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fee330]"
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
            data-testid="semaforo-back-to-guide-btn"
            onClick={() => {
              playUiClickSound();
              onBackToGuide();
            }}
            className="font-display px-4 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-sm sm:text-base font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            <BookOpen className="w-4 h-4 text-[#8137ea] shrink-0" aria-hidden="true" />
            <span>Ver Instructivo</span>
          </button>

          <SoundToggleButton />
        </div>
      </header>

      {/* Main Selection Stage: Fullscreen-Expanded Title + Two Large Side-by-Side Interactive Mode Cards */}
      <main className="relative z-10 w-full flex-1 min-h-0 flex flex-col items-center justify-center gap-4 sm:gap-6 xl:gap-7 max-w-[1620px] mx-auto pb-2 sm:pb-4">
        <h2 className="font-display title-nutriplato-brand text-3xl sm:text-5xl xl:text-[54px] font-bold leading-none text-center text-balance shrink-0 py-0.5">
          Elige tu Modo de Juego
        </h2>

        <div className="w-full flex-1 min-h-0 max-h-[680px] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 xl:gap-10 items-stretch">
          {/* TARJETA 1: MODO NORMAL (EDUCATIVO) */}
          <button
            type="button"
            data-testid="semaforo-mode-normal-card"
            onClick={() => {
              playUiClickSound();
              onSelectNormal();
            }}
            style={{
              background:
                'linear-gradient(155deg, #ffffff 0%, #f4ffe8 62%, #dcfce7 100%)',
            }}
            className="group relative w-full h-full rounded-[38px] border-[4.5px] border-[#1E1B2E] border-b-[12px] shadow-[0_14px_0_rgba(30,27,46,0.22)] overflow-hidden flex flex-col text-left cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            {/* Solid Green Header Band */}
            <div
              className="relative w-full px-7 py-5 sm:px-9 sm:py-6 xl:px-10 xl:py-7 border-b-[4.5px] border-[#1E1B2E] flex items-center gap-5 shrink-0 overflow-hidden"
              style={{
                background:
                  'linear-gradient(112deg, #16a34a 0%, #5dd118 54%, #84cc16 100%)',
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-1.5 h-3.5 rounded-full bg-[#ffffff]/25"
              />
              <NormalModeBookIcon />
              <div className="min-w-0">
                <h3
                  className="font-display text-3xl sm:text-4xl xl:text-[42px] font-bold text-[#ffffff] leading-none"
                  style={{ textShadow: '0 3px 0 #1E1B2E' }}
                >
                  Modo Normal
                </h3>
                <p className="text-base sm:text-lg xl:text-[22px] font-black text-[#ffffff]/95 mt-1.5 leading-tight">
                  Educativo · Sin límite de tiempo
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="relative flex-1 w-full px-7 py-6 sm:px-9 sm:py-8 xl:px-11 xl:py-9 flex flex-col justify-between gap-6">
              <p className="text-lg sm:text-2xl xl:text-[26px] font-extrabold text-[#1E1B2E]/90 leading-[1.46]">
                Modo 100% educativo para aprender sin prisas. Observa cada alimento,
                conversa sobre sus nutrientes y clasifícalo con calma a tu propio ritmo.
              </p>

              <div className="w-full pt-1">
                <span className="font-display w-full py-4 sm:py-5 px-8 rounded-2xl bg-[#5dd118] group-hover:bg-[#52be12] text-[#ffffff] text-xl sm:text-2xl xl:text-[26px] font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] flex items-center justify-center gap-3 whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <span>Jugar Modo Normal</span>
                  <Play className="w-6 h-6 fill-current shrink-0" aria-hidden="true" />
                </span>
              </div>
            </div>
          </button>

          {/* TARJETA 2: MODO CONTRARRELOJ (DESAFÍO) */}
          <div
            role="button"
            tabIndex={0}
            data-testid="semaforo-mode-timed-card"
            aria-expanded={isTimedSelected}
            onClick={() => {
              playUiClickSound();
              setIsTimedSelected(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsTimedSelected(true);
              }
            }}
            style={{
              background:
                'linear-gradient(155deg, #ffffff 0%, #fff5f8 62%, #ffe4ec 100%)',
            }}
            className={`group relative w-full h-full rounded-[38px] border-[4.5px] border-[#1E1B2E] border-b-[12px] shadow-[0_14px_0_rgba(30,27,46,0.22)] overflow-hidden flex flex-col text-left cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
              isTimedSelected
                ? 'ring-4 ring-[#fee330] -translate-y-1'
                : 'hover:-translate-y-1.5'
            }`}
          >
            {/* Solid Coral Header Band */}
            <div
              className="relative w-full px-7 py-5 sm:px-9 sm:py-6 xl:px-10 xl:py-7 border-b-[4.5px] border-[#1E1B2E] flex items-center gap-5 shrink-0 overflow-hidden"
              style={{
                background:
                  'linear-gradient(112deg, #e11d48 0%, #fc3e7e 56%, #fb7185 100%)',
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-1.5 h-3.5 rounded-full bg-[#ffffff]/25"
              />
              <TimedModeStopwatchIcon />
              <div className="min-w-0">
                <h3
                  className="font-display text-3xl sm:text-4xl xl:text-[42px] font-bold text-[#ffffff] leading-none"
                  style={{ textShadow: '0 3px 0 #1E1B2E' }}
                >
                  Modo Contrarreloj
                </h3>
                <p className="text-base sm:text-lg xl:text-[22px] font-black text-[#ffffff]/95 mt-1.5 leading-tight">
                  Desafío · Carrera contra el reloj
                </p>
              </div>
            </div>

            {/* Card Body with Integrated Duration Selector */}
            <div className="relative flex-1 w-full px-7 py-6 sm:px-9 sm:py-8 xl:px-11 xl:py-9 flex flex-col justify-between gap-5">
              <p className="text-lg sm:text-2xl xl:text-[26px] font-extrabold text-[#1E1B2E]/90 leading-[1.46]">
                ¡Pon a prueba tu rapidez! Clasifica todos los alimentos antes de que el
                reloj llegue a cero para completar la barra al 100%.
              </p>

              {/* Integrated 4-Option Duration Selector */}
              <div className="w-full flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base sm:text-lg xl:text-xl font-bold text-[#9f1239]">
                    Duración del reto
                  </span>
                  <span className="text-sm sm:text-base xl:text-lg font-extrabold text-[#1E1B2E]/65 tabular-nums">
                    {String(draftMinutes).padStart(2, '0')}:00
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Duración del modo contrarreloj"
                  className="grid grid-cols-4 gap-2.5 sm:gap-3.5"
                >
                  {SEMAFORO_TIMED_DURATIONS_MIN.map((minutes) => {
                    const isPicked = draftMinutes === minutes;
                    return (
                      <button
                        key={minutes}
                        type="button"
                        data-testid={`semaforo-duration-${minutes}`}
                        aria-pressed={isPicked}
                        onClick={(e) => {
                          e.stopPropagation();
                          playUiClickSound();
                          setIsTimedSelected(true);
                          setDraftMinutes(minutes);
                        }}
                        className={`font-display py-3.5 sm:py-4 px-2.5 rounded-2xl border-[3px] border-[#1E1B2E] text-base sm:text-xl xl:text-2xl font-bold tabular-nums whitespace-nowrap cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                          isPicked
                            ? isTimedSelected
                              ? 'bg-[#fee330] text-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] scale-[1.04]'
                              : 'bg-[#fee330]/85 text-[#1E1B2E] shadow-[0_4px_0_#1E1B2E]'
                            : 'bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E]/80 shadow-[0_4px_0_#1E1B2E]'
                        }`}
                      >
                        {minutes} min
                      </button>
                    );
                  })}
                </div>

                {isTimedSelected ? (
                  <button
                    type="button"
                    data-testid="semaforo-mode-timed-confirm-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      playUiClickSound();
                      onConfirmTimed(draftMinutes);
                    }}
                    className="animate-guide-fade-slide font-display w-full py-4 sm:py-5 px-8 rounded-2xl bg-[#fc3e7e] hover:bg-[#e11d48] text-[#ffffff] text-xl sm:text-2xl xl:text-[26px] font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fee330]"
                  >
                    <span>Continuar</span>
                    <Play className="w-6 h-6 fill-current shrink-0" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="font-display w-full py-4 sm:py-5 px-8 rounded-2xl bg-[#ffffff] group-hover:bg-[#fee330] text-[#1E1B2E] text-xl sm:text-2xl xl:text-[26px] font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] flex items-center justify-center gap-2 whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <span>Seleccionar Contrarreloj</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface SemaforoTimeUpModalProps {
  progress: number;
  timedMinutes: SemaforoTimedDurationMinutes;
  onRetryTimed: () => void;
  onChangeMode: () => void;
}

export const SemaforoTimeUpModal: React.FC<SemaforoTimeUpModalProps> = ({
  progress,
  timedMinutes,
  onRetryTimed,
  onChangeMode,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="semaforo-timeup-heading"
      data-testid="semaforo-timeup-modal"
      className="fixed inset-0 z-40 bg-[#1E1B2E]/60 flex items-center justify-center p-4"
    >
      <div className="animate-modal-pop w-full max-w-lg rounded-[34px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] shadow-[0_14px_0_rgba(30,27,46,0.28)] p-7 sm:p-8 text-center flex flex-col items-center gap-4">
        <PausedClockTimeUpIllustration />

        <div className="flex flex-col items-center gap-1">
          <h2
            id="semaforo-timeup-heading"
            className="font-display text-3xl sm:text-4xl font-bold text-[#fc3e7e] leading-tight text-balance"
            style={{ textShadow: '0 2px 0 rgba(30,27,46,0.12)' }}
          >
            ¡Se acabó el tiempo!
          </h2>
          <p className="font-display text-lg sm:text-xl font-bold text-[#8137ea]">
            ¡Inténtalo de nuevo!
          </p>
        </div>

        {/* Round Score Progress Summary */}
        <div className="w-full flex flex-col items-center gap-2 py-1">
          <div className="flex items-baseline justify-center gap-2 text-[#1E1B2E]">
            <span
              data-testid="semaforo-timeup-progress"
              className="font-display text-3xl sm:text-4xl font-bold tabular-nums text-[#1E1B2E]"
            >
              {progress}%
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#1E1B2E]/70">
              completado · Reto de {timedMinutes} min
            </span>
          </div>

          <div
            aria-hidden="true"
            className="w-full max-w-xs h-5 rounded-full bg-[#FFFDF7] border-[3px] border-[#1E1B2E] overflow-hidden shadow-[inset_0_2px_4px_rgba(30,27,46,0.12)]"
          >
            <div
              className="h-full rounded-l-full"
              style={{
                width: `${Math.max(4, Math.min(100, progress))}%`,
                background:
                  'linear-gradient(90deg, #fee330 0%, #5dd118 65%, #22d3ee 100%)',
              }}
            />
          </div>
        </div>

        <p className="text-base sm:text-lg font-extrabold text-[#1E1B2E]/85 leading-relaxed max-w-md">
          ¡Estuviste muy cerca! Cada intento te hace más rápido
        </p>

        <div className="w-full flex flex-col gap-3 pt-1">
          <button
            type="button"
            data-testid="semaforo-retry-timed-btn"
            onClick={onRetryTimed}
            className="font-display w-full py-3.5 px-6 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-lg sm:text-xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            <span>Reintentar Contrarreloj</span>
            <RotateCcw className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            data-testid="semaforo-change-mode-btn"
            onClick={onChangeMode}
            className="font-display w-full py-3 px-6 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-base sm:text-lg font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
          >
            <Gamepad2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Cambiar Modo de Juego</span>
          </button>
        </div>
      </div>
    </div>
  );
};
