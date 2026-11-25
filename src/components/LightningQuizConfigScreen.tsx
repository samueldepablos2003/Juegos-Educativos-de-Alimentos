import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Home,
  Play,
  Sparkles,
  Timer,
  Users,
  Zap,
} from 'lucide-react';
import {
  QUIZ_DIFFICULTY_META,
  QuizDifficultyFilter,
} from '../data/lightningQuizQuestions';
import {
  LIGHTNING_QUESTION_COUNTS,
  LIGHTNING_TIMED_DURATIONS_MIN,
  LightningPlayFormat,
  LightningQuestionCount,
  LightningQuizConfig,
  LightningTimeMode,
  LightningTimedDurationMinutes,
} from '../game/lightningQuizRules';
import { SoundToggleButton } from './SoundToggleButton';
import { playUiClickSound } from '../utils/soundSystem';

interface LightningQuizConfigScreenProps {
  initialConfig: LightningQuizConfig;
  onBackToLibrary: () => void;
  onOpenGuide?: () => void;
  onStartQuiz: (config: LightningQuizConfig) => void;
}

const DIFFICULTY_ORDER: QuizDifficultyFilter[] = [
  'facil',
  'medio',
  'dificil',
  'mixto',
];

export const LightningQuizConfigScreen: React.FC<
  LightningQuizConfigScreenProps
> = ({
  initialConfig,
  onBackToLibrary,
  onOpenGuide,
  onStartQuiz,
}) => {
  const [playFormat, setPlayFormat] = useState<LightningPlayFormat>(
    initialConfig.playFormat
  );
  const [timeMode, setTimeMode] = useState<LightningTimeMode>(
    initialConfig.timeMode
  );
  const [difficulty, setDifficulty] = useState<QuizDifficultyFilter>(
    initialConfig.difficulty
  );
  const [questionCount, setQuestionCount] = useState<LightningQuestionCount>(
    initialConfig.questionCount
  );
  const [timedMinutes, setTimedMinutes] =
    useState<LightningTimedDurationMinutes>(initialConfig.timedDurationMinutes);

  const selectedModeCard: 'normal' | 'contrarreloj' | 'teams' =
    playFormat === 'teams'
      ? 'teams'
      : timeMode === 'contrarreloj'
        ? 'contrarreloj'
        : 'normal';

  const handleSelectModeCard = (card: 'normal' | 'contrarreloj' | 'teams') => {
    playUiClickSound();
    if (card === 'normal') {
      setPlayFormat('individual');
      setTimeMode('normal');
    } else if (card === 'contrarreloj') {
      setPlayFormat('individual');
      setTimeMode('contrarreloj');
    } else {
      setPlayFormat('teams');
    }
  };

  const handleConfirm = () => {
    onStartQuiz({
      playFormat,
      timeMode,
      difficulty,
      questionCount,
      timedDurationMinutes: timedMinutes,
    });
  };

  const activeDiffMeta = QUIZ_DIFFICULTY_META[difficulty];

  return (
    <div
      data-testid="lightning-config-screen"
      className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between px-5 py-3.5 sm:px-8 sm:py-4 xl:px-12 xl:py-5 gap-3 sm:gap-4"
    >
      {/* Top Header */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 sm:gap-4 shrink-0">
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

          <h1 className="font-display title-nutriplato-brand text-[clamp(1.25rem,2.3vw,2.25rem)] font-bold leading-[1.2] px-1 py-1 whitespace-normal sm:whitespace-nowrap">
            Cuestionario Relámpago
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenGuide && (
            <button
              type="button"
              data-testid="lightning-back-to-guide-btn"
              onClick={() => {
                playUiClickSound();
                onOpenGuide();
              }}
              className="font-display px-4 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-sm sm:text-base font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
            >
              <BookOpen className="w-4 h-4 text-[#8137ea] shrink-0" aria-hidden="true" />
              <span>Ver Instructivo</span>
            </button>
          )}

          <SoundToggleButton />
        </div>
      </header>

      {/* Main Config Stage — Fullscreen Expanded Width & Unclipped Cards */}
      <main className="relative z-10 w-full flex-1 min-h-0 overflow-y-auto flex flex-col items-center py-2 px-1">
        <div className="w-full max-w-[1680px] h-[730.875px] my-auto flex flex-col items-center justify-center gap-4 sm:gap-5 xl:gap-6 pb-2">
          <div className="w-full text-center shrink-0 px-2">
            <p className="text-[clamp(0.95rem,1.25vw,1.25rem)] font-extrabold text-[#1E1B2E]/85 leading-snug">
              Elige modalidad, dificultad y cantidad de preguntas antes de comenzar
            </p>
          </div>

          {/* ROW 1: 3 MODALIDAD CARDS (Normal · Contrarreloj · Modo en Equipos) — Unconstrained Height, Zero Clipping */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 xl:gap-7 items-stretch">
            {/* Card 1: Normal Individual */}
            <button
              type="button"
              data-testid="lightning-mode-normal"
              aria-pressed={selectedModeCard === 'normal'}
              onClick={() => handleSelectModeCard('normal')}
              style={{
                background:
                  'linear-gradient(155deg, #ffffff 0%, #f4ffe8 65%, #dcfce7 100%)',
              }}
              className={`relative w-full rounded-[32px] border-[4.5px] border-[#1E1B2E] border-b-[10px] flex flex-col text-left cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                selectedModeCard === 'normal'
                  ? 'ring-[5px] ring-[#fee330] -translate-y-0.5 shadow-[0_12px_0_rgba(30,27,46,0.22)]'
                  : 'hover:-translate-y-0.5 shadow-[0_8px_0_rgba(30,27,46,0.16)] opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className="w-full rounded-t-[27px] px-5 py-3.5 sm:px-6 sm:py-4 xl:px-7 xl:py-5 border-b-[4px] border-[#1E1B2E] flex items-center gap-3.5 sm:gap-4 shrink-0"
                style={{
                  background:
                    'linear-gradient(112deg, #16a34a 0%, #5dd118 55%, #84cc16 100%)',
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-[#16a34a]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-display text-[clamp(1.35rem,1.9vw,2rem)] font-bold text-[#ffffff] leading-tight"
                    style={{ textShadow: '0 3px 0 #1E1B2E' }}
                  >
                    Modo Normal
                  </h3>
                  <span className="block text-sm sm:text-base xl:text-lg font-black text-[#ffffff]/95 mt-0.5 leading-snug">
                    Individual · Sin tiempo
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 sm:px-6 sm:py-5 xl:px-7 xl:py-6 flex-1 flex flex-col justify-center">
                <p className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-extrabold text-[#1E1B2E]/90 leading-relaxed">
                  Responde a tu propio ritmo, aprende con cada alimento en 3D y
                  llena la barra hasta el 100%.
                </p>
              </div>
            </button>

            {/* Card 2: Contrarreloj Individual */}
            <button
              type="button"
              data-testid="lightning-mode-contrarreloj"
              aria-pressed={selectedModeCard === 'contrarreloj'}
              onClick={() => handleSelectModeCard('contrarreloj')}
              style={{
                background:
                  'linear-gradient(155deg, #ffffff 0%, #fff5f8 65%, #ffe4ec 100%)',
              }}
              className={`relative w-full rounded-[32px] border-[4.5px] border-[#1E1B2E] border-b-[10px] flex flex-col text-left cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                selectedModeCard === 'contrarreloj'
                  ? 'ring-[5px] ring-[#fee330] -translate-y-0.5 shadow-[0_12px_0_rgba(30,27,46,0.22)]'
                  : 'hover:-translate-y-0.5 shadow-[0_8px_0_rgba(30,27,46,0.16)] opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className="w-full rounded-t-[27px] px-5 py-3.5 sm:px-6 sm:py-4 xl:px-7 xl:py-5 border-b-[4px] border-[#1E1B2E] flex items-center gap-3.5 sm:gap-4 shrink-0"
                style={{
                  background:
                    'linear-gradient(112deg, #e11d48 0%, #fc3e7e 56%, #fb7185 100%)',
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl bg-[#fee330] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center shrink-0">
                  <Timer className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-[#1E1B2E]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-display text-[clamp(1.35rem,1.9vw,2rem)] font-bold text-[#ffffff] leading-tight"
                    style={{ textShadow: '0 3px 0 #1E1B2E' }}
                  >
                    Contrarreloj
                  </h3>
                  <span className="block text-sm sm:text-base xl:text-lg font-black text-[#ffffff]/95 mt-0.5 leading-snug">
                    Individual · Contra el reloj
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 sm:px-6 sm:py-5 xl:px-7 xl:py-6 flex-1 flex flex-col justify-center">
                <p className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-extrabold text-[#1E1B2E]/90 leading-relaxed">
                  ¡Sé veloz! Completa todas las preguntas antes de que el reloj
                  llegue a 00:00 o pierdes el reto.
                </p>
              </div>
            </button>

            {/* Card 3: Modo en Equipos (Equipo 1 vs Equipo 2) */}
            <button
              type="button"
              data-testid="lightning-mode-teams"
              aria-pressed={selectedModeCard === 'teams'}
              onClick={() => handleSelectModeCard('teams')}
              style={{
                background:
                  'linear-gradient(155deg, #ffffff 0%, #f5f0ff 65%, #ede9fe 100%)',
              }}
              className={`relative w-full rounded-[32px] border-[4.5px] border-[#1E1B2E] border-b-[10px] flex flex-col text-left cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                selectedModeCard === 'teams'
                  ? 'ring-[5px] ring-[#fee330] -translate-y-0.5 shadow-[0_12px_0_rgba(30,27,46,0.22)]'
                  : 'hover:-translate-y-0.5 shadow-[0_8px_0_rgba(30,27,46,0.16)] opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className="w-full rounded-t-[27px] px-5 py-3.5 sm:px-6 sm:py-4 xl:px-7 xl:py-5 border-b-[4px] border-[#1E1B2E] flex items-center gap-3.5 sm:gap-4 shrink-0"
                style={{
                  background:
                    'linear-gradient(112deg, #6d28d9 0%, #8137ea 54%, #a855f7 100%)',
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl bg-[#fee330] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-[#1E1B2E]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-display text-[clamp(1.35rem,1.9vw,2rem)] font-bold text-[#ffffff] leading-tight"
                    style={{ textShadow: '0 3px 0 #1E1B2E' }}
                  >
                    Modo en Equipos
                  </h3>
                  <span className="block text-sm sm:text-base xl:text-lg font-black text-[#ffffff]/95 mt-0.5 leading-snug">
                    Equipo 1 vs. Equipo 2
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 sm:px-6 sm:py-5 xl:px-7 xl:py-6 flex-1 flex flex-col justify-center">
                <p className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-extrabold text-[#1E1B2E]/90 leading-relaxed">
                  Dos paneles paralelos por turnos alternos con reloj por turno
                  opcional hasta coronar al equipo ganador.
                </p>
              </div>
            </button>
          </div>

          {/* ROW 2: UNIFIED SETTINGS CARD (Difficulty + Question Count + Optional Timer) */}
          <section
            aria-label="Opciones del cuestionario"
            className="w-full shrink-0 rounded-[32px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[10px] shadow-[0_12px_0_rgba(30,27,46,0.2)] px-6 py-4 sm:px-8 sm:py-5 xl:px-10 xl:py-6 flex flex-col justify-between gap-4 sm:gap-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 xl:gap-12 items-start">
              {/* Left: Difficulty Picker */}
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-xl sm:text-2xl xl:text-[26px] font-bold text-[#1E1B2E] flex items-center gap-2.5">
                    <Zap
                      className="w-6 h-6 xl:w-7 xl:h-7 text-[#8137ea] fill-[#fee330]"
                      aria-hidden="true"
                    />
                    Dificultad
                  </span>
                  <span className="text-sm sm:text-base xl:text-lg font-extrabold text-[#1E1B2E]/70 truncate">
                    {activeDiffMeta.label}
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Nivel de dificultad"
                  className="grid grid-cols-4 gap-2.5 sm:gap-3"
                >
                  {DIFFICULTY_ORDER.map((diff) => {
                    const meta = QUIZ_DIFFICULTY_META[diff];
                    const isActive = difficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        data-testid={`lightning-diff-${diff}`}
                        aria-pressed={isActive}
                        onClick={() => {
                          playUiClickSound();
                          setDifficulty(diff);
                        }}
                        style={
                          isActive
                            ? { backgroundColor: meta.accentHex }
                            : undefined
                        }
                        className={`font-display py-2.5 sm:py-3.5 xl:py-4 px-3 rounded-2xl border-[3.5px] border-[#1E1B2E] text-base sm:text-xl xl:text-2xl font-bold whitespace-nowrap cursor-pointer transition-[transform,background-color] duration-150 active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                          isActive
                            ? diff === 'medio'
                              ? 'text-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] scale-[1.03]'
                              : 'text-[#ffffff] shadow-[0_5px_0_#1E1B2E] scale-[1.03]'
                            : 'bg-[#FFFDF7] hover:bg-[#fee330]/35 text-[#1E1B2E] shadow-[0_4px_0_#1E1B2E]'
                        }`}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>

                <p className="text-sm sm:text-base xl:text-lg font-extrabold text-[#1E1B2E]/80 leading-snug">
                  {activeDiffMeta.shortDesc}
                </p>
              </div>

              {/* Right: Question Count + Timer Options */}
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-xl sm:text-2xl xl:text-[26px] font-bold text-[#1E1B2E]">
                    Cantidad de preguntas
                  </span>
                  <span className="text-sm sm:text-base xl:text-lg font-extrabold text-[#1E1B2E]/70 tabular-nums">
                    {playFormat === 'teams'
                      ? `${questionCount} por equipo (${questionCount * 2} total)`
                      : `${questionCount} preguntas`}
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Cantidad de preguntas"
                  className="grid grid-cols-4 gap-2.5 sm:gap-3"
                >
                  {LIGHTNING_QUESTION_COUNTS.map((count) => {
                    const isPicked = questionCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        data-testid={`lightning-count-${count}`}
                        aria-pressed={isPicked}
                        onClick={() => {
                          playUiClickSound();
                          setQuestionCount(count);
                        }}
                        className={`font-display py-2.5 sm:py-3.5 xl:py-4 px-3 rounded-2xl border-[3.5px] border-[#1E1B2E] text-lg sm:text-2xl xl:text-[26px] font-bold tabular-nums whitespace-nowrap cursor-pointer transition-[transform,background-color] duration-150 active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                          isPicked
                            ? 'bg-[#fee330] text-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] scale-[1.03]'
                            : 'bg-[#FFFDF7] hover:bg-[#fee330]/35 text-[#1E1B2E] shadow-[0_4px_0_#1E1B2E]'
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>

                {/* Timer Toggle (for Teams) & Duration Selector (when Contrarreloj is active) */}
                {(timeMode === 'contrarreloj' || playFormat === 'teams') && (
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t-2 border-[#1E1B2E]/10">
                    {playFormat === 'teams' ? (
                      <button
                        type="button"
                        data-testid="lightning-teams-timer-toggle"
                        aria-pressed={timeMode === 'contrarreloj'}
                        onClick={() => {
                          playUiClickSound();
                          setTimeMode((prev) =>
                            prev === 'contrarreloj' ? 'normal' : 'contrarreloj'
                          );
                        }}
                        className={`font-display px-4 py-2 sm:py-2.5 rounded-2xl border-[3px] border-[#1E1B2E] text-sm sm:text-base xl:text-lg font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
                          timeMode === 'contrarreloj'
                            ? 'bg-[#fc3e7e] text-[#ffffff] shadow-[0_4px_0_#1E1B2E]'
                            : 'bg-[#FFFDF7] text-[#1E1B2E] shadow-[0_3px_0_#1E1B2E]'
                        }`}
                      >
                        <Clock className="w-5 h-5" aria-hidden="true" />
                        <span>
                          {timeMode === 'contrarreloj'
                            ? 'Contrarreloj por turno: Sí'
                            : 'Activar Contrarreloj'}
                        </span>
                      </button>
                    ) : (
                      <span className="font-display text-base sm:text-lg xl:text-xl font-bold text-[#9f1239] flex items-center gap-2">
                        <Clock className="w-5 h-5" aria-hidden="true" />
                        Tiempo límite
                      </span>
                    )}

                    {timeMode === 'contrarreloj' && (
                      <div
                        role="group"
                        aria-label={
                          playFormat === 'teams'
                            ? 'Duración por turno en minutos'
                            : 'Duración en minutos'
                        }
                        className="flex items-center gap-2"
                      >
                        {LIGHTNING_TIMED_DURATIONS_MIN.map((mins) => {
                          const active = timedMinutes === mins;
                          return (
                            <button
                              key={mins}
                              type="button"
                              data-testid={`lightning-duration-${mins}`}
                              aria-pressed={active}
                              onClick={() => {
                                playUiClickSound();
                                setTimedMinutes(mins);
                              }}
                              className={`font-display px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border-[3px] border-[#1E1B2E] text-sm sm:text-base xl:text-lg font-bold tabular-nums whitespace-nowrap cursor-pointer transition-[transform,background-color] duration-150 ${
                                active
                                  ? 'bg-[#fc3e7e] text-[#ffffff] shadow-[0_4px_0_#1E1B2E]'
                                  : 'bg-[#ffffff] hover:bg-[#fee330]/40 text-[#1E1B2E] shadow-[0_3px_0_#1E1B2E]'
                              }`}
                            >
                              {playFormat === 'teams'
                                ? `${mins} min/turno`
                                : `${mins} min`}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Start Primary CTA */}
            <div className="flex justify-center shrink-0">
              <button
                type="button"
                data-testid="lightning-start-btn"
                onClick={handleConfirm}
                className="font-display w-full sm:w-auto sm:min-w-[420px] xl:min-w-[500px] py-3.5 sm:py-4.5 px-10 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-2xl sm:text-[26px] xl:text-[28px] font-bold border-[4px] border-[#1E1B2E] shadow-[0_7px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-3.5 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
                style={{ textShadow: '0 2.5px 0 #1E1B2E' }}
              >
                <span>
                  {playFormat === 'teams'
                    ? '¡Iniciar Duelo por Equipos!'
                    : '¡Comenzar Cuestionario!'}
                </span>
                <Play className="w-7 h-7 fill-current shrink-0" aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
