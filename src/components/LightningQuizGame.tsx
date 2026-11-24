import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Gamepad2,
  Home,
  Maximize2,
  Minimize2,
  RotateCcw,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  LIGHTNING_QUIZ_QUESTIONS,
  LightningQuizQuestion,
  QUIZ_DIFFICULTY_META,
} from '../data/lightningQuizQuestions';
import { LIGHTNING_TUTORIAL_SLIDES } from '../data/minigameTutorials';
import {
  advanceIndividualQuestion,
  advanceTeamTurn,
  computeIndividualProgress,
  computeTeamAccuracyProgress,
  createIndividualQuizSession,
  createTeamQuizSession,
  DEFAULT_LIGHTNING_CONFIG,
  expireActiveTeamTurn,
  formatQuizCountdown,
  IndividualQuizState,
  isQuizCountdownUrgent,
  LightningQuizConfig,
  markIndividualTimeExpired,
  submitIndividualAnswer,
  submitTeamAnswer,
  TeamId,
  TeamQuizState,
  TeamSlotState,
  willAdvanceFinishTeamMatch,
} from '../game/lightningQuizRules';
import {
  playAnswerRevealSound,
  playCardSelectSound,
} from '../utils/superpowerAudio';
import { playTimerTickSound, playTimeUpSound } from '../utils/plateAudio';
import {
  playQuizWrongSoftSound,
  playUiClickSound,
  playVictoryFanfareSound,
  setBgmTheme,
} from '../utils/soundSystem';
import { FoodIllustration } from './FoodIllustration';
import { StarCapsuleProgressBar } from './StarCapsuleProgressBar';
import { LightningQuizConfigScreen } from './LightningQuizConfigScreen';
import { MinigameTutorialScreen } from './MinigameTutorialScreen';
import { SoundToggleButton } from './SoundToggleButton';

interface LightningQuizGameProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onBackToLibrary: () => void;
}

type QuizScreenView = 'guide' | 'config' | 'playing';

const CONFETTI_PIECES = [
  { left: '7%', color: '#fee330', delay: '0s', duration: '2.4s' },
  { left: '16%', color: '#5dd118', delay: '0.2s', duration: '2.7s' },
  { left: '26%', color: '#fc3e7e', delay: '0.1s', duration: '2.3s' },
  { left: '38%', color: '#8137ea', delay: '0.35s', duration: '2.6s' },
  { left: '50%', color: '#ffffff', delay: '0.15s', duration: '2.5s' },
  { left: '62%', color: '#5dd118', delay: '0.25s', duration: '2.8s' },
  { left: '74%', color: '#fc3e7e', delay: '0.05s', duration: '2.4s' },
  { left: '84%', color: '#fee330', delay: '0.3s', duration: '2.6s' },
  { left: '93%', color: '#8137ea', delay: '0.18s', duration: '2.5s' },
];

interface CorrectFoodRevealOverlayProps {
  question: LightningQuizQuestion;
  eyebrowLabel: string;
  ctaLabel: string;
  onContinue: () => void;
}

const CorrectFoodRevealOverlay: React.FC<CorrectFoodRevealOverlayProps> = ({
  question,
  eyebrowLabel,
  ctaLabel,
  onContinue,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-reveal-heading"
      data-testid="lightning-correct-reveal-overlay"
      className="animate-quiz-reveal-backdrop fixed inset-0 z-40 flex items-center justify-center p-5 sm:p-8 xl:p-12 bg-[#1E1B2E]/58 backdrop-blur-md overflow-hidden"
    >
      <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.78fr)] items-center justify-items-center gap-5 sm:gap-8 lg:gap-10">
        {/* DOMINANT FREE-FLOATING 3D FOOD PROTAGONIST (Elastic GPU Scale-Up, Seamless Halo) */}
        <div
          key={question.id}
          data-testid="lightning-reveal-floating-food"
          className="animate-quiz-food-hero relative flex flex-col items-center justify-center select-none pointer-events-none"
        >
          <div className="relative flex items-center justify-center w-[clamp(290px,min(50vw,68vh),560px)] h-[clamp(290px,min(50vw,68vh),560px)]">
            {/* Soft Seamless Celebratory Glow (Zero Visible Circle Rim) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-20 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(254,227,48,0.52) 0%, rgba(93,209,24,0.24) 32%, rgba(139,255,254,0.10) 52%, rgba(255,255,255,0) 68%)',
              }}
            />

            {/* Floating Comic Sparkles Around the Protagonist Food */}
            <svg
              viewBox="0 0 28 28"
              aria-hidden="true"
              className="animate-aaa-sparkle pointer-events-none absolute top-3 left-4 w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_3px_0_rgba(30,27,46,0.45)]"
            >
              <path
                d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
                fill="#fee330"
                stroke="#1E1B2E"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 28 28"
              aria-hidden="true"
              className="animate-aaa-sparkle pointer-events-none absolute top-10 right-2 w-7 h-7 sm:w-9 sm:h-9 drop-shadow-[0_3px_0_rgba(30,27,46,0.45)]"
              style={{ animationDelay: '0.45s' }}
            >
              <path
                d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
                fill="#5dd118"
                stroke="#1E1B2E"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 28 28"
              aria-hidden="true"
              className="animate-aaa-sparkle pointer-events-none absolute bottom-10 left-6 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_3px_0_rgba(30,27,46,0.45)]"
              style={{ animationDelay: '0.9s' }}
            >
              <path
                d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
                fill="#8bfffe"
                stroke="#1E1B2E"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>

            {/* Giant Fluid 3D Food Illustration */}
            <div
              className="relative z-10 w-full h-full flex items-center justify-center"
              style={{
                filter:
                  'drop-shadow(0 26px 32px rgba(15,12,26,0.46)) drop-shadow(0 0 22px rgba(255,255,255,0.34))',
              }}
            >
              <div className="alimento-3d-wrapper w-full h-full">
                <FoodIllustration
                  foodId={question.foodId}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Grounded Soft Floating Shadow in Mid-Air */}
          <span
            aria-hidden="true"
            className="w-[56%] h-6 rounded-full -mt-2"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(15,12,26,0.42) 0%, rgba(15,12,26,0) 72%)',
            }}
          />
        </div>

        {/* SINGLE UNIFIED INFORMATION CARD: Status Header + Food Name + Description + Next Button */}
        <div
          data-testid="lightning-reveal-info-card"
          className="animate-quiz-reveal-pop relative w-full max-w-[560px] rounded-[34px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] shadow-[0_20px_42px_rgba(15,12,26,0.38)] overflow-hidden flex flex-col"
        >
          {/* Vibrant Solid Green Success Ribbon */}
          <div
            className="relative w-full px-6 py-4 sm:px-8 sm:py-4.5 border-b-[4px] border-[#1E1B2E] flex items-center justify-center lg:justify-start gap-3 overflow-hidden"
            style={{
              background:
                'linear-gradient(112deg, #16a34a 0%, #5dd118 54%, #84cc16 100%)',
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-1.5 h-2.5 rounded-full bg-[#ffffff]/25"
            />
            <span className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ffffff] border-[2.5px] border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#16a34a] stroke-[3.4]" aria-hidden="true" />
            </span>
            <span
              id="quiz-reveal-heading"
              className="relative z-10 font-display text-2xl sm:text-3xl font-bold text-[#ffffff] tracking-wide leading-tight"
              style={{ textShadow: '0 2.5px 0 #1E1B2E' }}
            >
              {eyebrowLabel}
            </span>
          </div>

          {/* Unified Info Body: Name + Explanation + Action CTA */}
          <div className="w-full px-6 py-6 sm:px-8 sm:py-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5">
            <div className="flex flex-col items-center lg:items-start gap-2.5 w-full">
              <h3 className="font-display title-nutriplato-brand text-3xl sm:text-4xl xl:text-[46px] font-bold leading-none py-0.5">
                {question.foodName}
              </h3>

              <p
                data-testid="lightning-reveal-explanation"
                className="text-base sm:text-xl xl:text-[22px] font-extrabold text-[#1E1B2E]/92 leading-relaxed"
              >
                {question.explanation}
              </p>
            </div>

            <button
              type="button"
              data-testid="lightning-reveal-continue-btn"
              onClick={onContinue}
              className="font-display mt-1 w-full py-4 px-7 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff] text-xl sm:text-2xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fee330]"
              style={{ textShadow: '0 2px 0 #1E1B2E' }}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-6 h-6 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuizTimeUpModalProps {
  title: string;
  subtitle: string;
  summaryLine: string;
  onRetry: () => void;
  onChangeMode: () => void;
}

const QuizTimeUpModal: React.FC<QuizTimeUpModalProps> = ({
  title,
  subtitle,
  summaryLine,
  onRetry,
  onChangeMode,
}) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="lightning-timeup-heading"
    data-testid="lightning-timeup-modal"
    className="fixed inset-0 z-40 bg-[#1E1B2E]/60 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <div className="animate-modal-pop w-full max-w-lg rounded-[34px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] shadow-[0_14px_0_rgba(30,27,46,0.28)] p-7 sm:p-8 text-center flex flex-col items-center gap-4">
      <div className="animate-semaforo-clock-bounce w-24 h-24 rounded-3xl bg-[#fc3e7e] border-[4px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] flex items-center justify-center">
        <Clock className="w-12 h-12 text-[#ffffff] stroke-[2.5]" aria-hidden="true" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2
          id="lightning-timeup-heading"
          className="font-display text-3xl sm:text-4xl font-bold text-[#fc3e7e] leading-tight text-balance"
        >
          {title}
        </h2>
        <p className="font-display text-lg sm:text-xl font-bold text-[#8137ea]">
          {subtitle}
        </p>
      </div>

      <p className="text-base sm:text-lg font-extrabold text-[#1E1B2E]/85 leading-relaxed">
        {summaryLine}
      </p>

      <div className="w-full flex flex-col gap-3 pt-1">
        <button
          type="button"
          data-testid="lightning-retry-btn"
          onClick={onRetry}
          className="font-display w-full py-3.5 px-6 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-lg sm:text-xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150"
        >
          <RotateCcw className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Reintentar Contrarreloj</span>
        </button>

        <button
          type="button"
          data-testid="lightning-change-mode-btn"
          onClick={onChangeMode}
          className="font-display w-full py-3 px-6 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-base sm:text-lg font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150"
        >
          <Gamepad2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Cambiar Modo de Juego</span>
        </button>
      </div>
    </div>
  </div>
);

interface TeamPanelCardProps {
  slot: TeamSlotState;
  isActiveTurn: boolean;
  isFeedbackPhase: boolean;
  willFinishAfterFeedback: boolean;
  errorShakeKey: number;
  celebrateKey: number;
  onSelectOption: (teamId: TeamId, optionIdx: number) => void;
  onAdvanceWrongTurn: () => void;
}

const TeamPanelCard: React.FC<TeamPanelCardProps> = ({
  slot,
  isActiveTurn,
  isFeedbackPhase,
  willFinishAfterFeedback,
  errorShakeKey,
  celebrateKey,
  onSelectOption,
  onAdvanceWrongTurn,
}) => {
  const isTeam1 = slot.teamId === 'team1';
  const currentQuestion = slot.questions[slot.currentIndex] ?? null;
  const accuracyPct = computeTeamAccuracyProgress(slot);
  const diffMeta = currentQuestion
    ? QUIZ_DIFFICULTY_META[currentQuestion.difficulty]
    : null;
  const isWrongFeedback =
    isActiveTurn && isFeedbackPhase && slot.lastOutcome === 'wrong';

  const headerGradient = isTeam1
    ? 'linear-gradient(112deg, #6d28d9 0%, #8137ea 54%, #9333ea 100%)'
    : 'linear-gradient(112deg, #be123c 0%, #fc3e7e 54%, #f43f5e 100%)';

  return (
    <section
      data-testid={`team-panel-${slot.teamId}`}
      aria-label={slot.name}
      className={`relative w-full rounded-[32px] xl:rounded-[36px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] flex flex-col transition-[transform,opacity] duration-200 ${
        isActiveTurn
          ? 'ring-[5px] ring-[#fee330] shadow-[0_14px_0_rgba(30,27,46,0.24)] opacity-100'
          : 'shadow-[0_10px_0_rgba(30,27,46,0.14)] opacity-75'
      }`}
    >
      {/* Team Header Banner (No Food Spoilers) */}
      <div
        className="rounded-t-[27px] xl:rounded-t-[31px] px-5 py-3 sm:px-6 sm:py-3.5 xl:px-7 xl:py-4.5 border-b-[4px] border-[#1E1B2E] flex items-center justify-between gap-3 shrink-0"
        style={{ background: headerGradient }}
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-2xl bg-[#fee330] border-[3px] border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] flex items-center justify-center shrink-0">
            <Zap
              className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 text-[#1E1B2E] fill-[#1E1B2E]"
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <h2
              className="font-display text-[clamp(1.35rem,2vw,2.15rem)] font-bold text-[#ffffff] leading-tight"
              style={{ textShadow: '0 3px 0 #1E1B2E' }}
            >
              {slot.name}
            </h2>
            <span className="block text-xs sm:text-sm xl:text-base font-black text-[#ffffff]/95 mt-0.5">
              {slot.completed
                ? 'Rondas completadas'
                : isActiveTurn
                  ? '¡Es tu turno!'
                  : 'Esperando turno...'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 text-lg sm:text-xl xl:text-2xl font-black text-[#ffffff] tabular-nums shrink-0">
          <span
            data-testid={`team-correct-${slot.teamId}`}
            className="inline-flex items-center gap-1"
            style={{ textShadow: '0 2px 0 #1E1B2E' }}
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.2] text-[#a3e635]" aria-hidden="true" />
            {slot.correctCount}
          </span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span
            data-testid={`team-wrong-${slot.teamId}`}
            className="inline-flex items-center gap-1"
            style={{ textShadow: '0 2px 0 #1E1B2E' }}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.2] text-[#fee330]" aria-hidden="true" />
            {slot.wrongCount}
          </span>
        </div>
      </div>

      {/* Team Progress Sub-strip */}
      <div className="px-5 py-2.5 sm:px-6 sm:py-3 xl:px-7 bg-[#FFFDF7] border-b-[3px] border-[#1E1B2E]/10 flex items-center justify-between gap-3 shrink-0">
        <span className="font-display text-sm sm:text-base xl:text-lg font-bold text-[#1E1B2E]/85 tabular-nums whitespace-nowrap">
          Pregunta {Math.min(slot.currentIndex + 1, slot.questions.length)} /{' '}
          {slot.questions.length}
          {diffMeta ? ` · ${diffMeta.label}` : ''}
        </span>

        <StarCapsuleProgressBar
          progress={accuracyPct}
          size="md"
          isWarningFlash={isWrongFeedback}
          warningFlashKey={errorShakeKey}
          celebrateKey={celebrateKey}
          ariaLabel={`Aciertos de ${slot.name}: ${accuracyPct}%`}
        />
      </div>

      {/* Team Question & 3 Options — Unclipped Full Visibility */}
      <div className="flex-1 p-5 sm:p-6 xl:p-7 flex flex-col justify-between gap-3.5 sm:gap-4 xl:gap-5">
        {slot.completed || !currentQuestion ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
            <Trophy className="w-14 h-14 text-[#fee330] stroke-[#1E1B2E]" aria-hidden="true" />
            <p className="font-display text-2xl xl:text-3xl font-bold text-[#1E1B2E]">
              ¡{slot.name} terminó sus preguntas!
            </p>
            <p className="text-base xl:text-xl font-extrabold text-[#1E1B2E]/75 tabular-nums">
              {slot.correctCount} aciertos · {slot.wrongCount} errores
            </p>
          </div>
        ) : (
          <>
            <p
              data-testid={`team-question-${slot.teamId}`}
              className="font-display text-[clamp(1.1rem,1.65vw,1.75rem)] font-bold text-[#1E1B2E] leading-snug text-balance"
            >
              {currentQuestion.question}
            </p>

            <div className="flex flex-col justify-center gap-2.5 sm:gap-3 xl:gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isPickedWrong =
                  isWrongFeedback && slot.lastSelectedOptionIndex === idx;
                const isRightHint =
                  isWrongFeedback && idx === currentQuestion.correctIndex;
                const canClick = isActiveTurn && !isFeedbackPhase;

                let btnClasses =
                  'bg-[#ffffff] text-[#1E1B2E] border-[#1E1B2E]';
                if (canClick) {
                  btnClasses =
                    'bg-[#ffffff] hover:bg-[#fee330]/35 text-[#1E1B2E] border-[#1E1B2E] cursor-pointer active:translate-y-[2px]';
                }
                if (isPickedWrong) {
                  btnClasses =
                    'animate-quiz-wrong-red bg-[#fee2e2] text-[#dc2626] border-[#dc2626] cursor-default';
                } else if (isRightHint) {
                  btnClasses =
                    'bg-[#dcfce7] text-[#15803d] border-[#16a34a] cursor-default';
                } else if (!canClick) {
                  btnClasses =
                    'bg-[#ffffff]/75 text-[#1E1B2E]/65 border-[#1E1B2E]/60 cursor-not-allowed';
                }

                return (
                  <button
                    key={`${currentQuestion.id}-${idx}-${isPickedWrong ? errorShakeKey : 0}`}
                    type="button"
                    data-testid={`team-${slot.teamId}-option-${idx}`}
                    disabled={!canClick}
                    onClick={() => onSelectOption(slot.teamId, idx)}
                    className={`w-full min-h-[52px] sm:min-h-[58px] xl:min-h-[68px] px-4 sm:px-5 xl:px-6 py-2.5 sm:py-3 rounded-2xl xl:rounded-[20px] border-[3.5px] shadow-[0_5px_0_#1E1B2E] text-left font-bold text-[clamp(0.95rem,1.25vw,1.35rem)] flex items-center justify-between gap-3 transition-[transform,background-color,color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${btnClasses}`}
                  >
                    <span className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <span
                        className={`w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-xl border-[2.5px] font-display font-bold text-base sm:text-lg xl:text-xl flex items-center justify-center shrink-0 tabular-nums ${
                          isPickedWrong
                            ? 'bg-[#ef4444] text-[#ffffff] border-[#991b1b]'
                            : 'bg-[#fee330] text-[#1E1B2E] border-[#1E1B2E]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className={`leading-snug ${
                          isPickedWrong ? 'text-[#dc2626] font-black' : ''
                        }`}
                      >
                        {option}
                      </span>
                    </span>

                    {isPickedWrong && (
                      <span className="inline-flex items-center gap-1 font-display text-sm sm:text-base font-bold text-[#dc2626] shrink-0">
                        <X className="w-5 h-5 stroke-[3]" aria-hidden="true" />
                        Error
                      </span>
                    )}
                    {isRightHint && (
                      <span className="inline-flex items-center gap-1 font-display text-sm sm:text-base font-bold text-[#15803d] shrink-0">
                        <Check className="w-5 h-5 stroke-[3]" aria-hidden="true" />
                        Correcta
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isWrongFeedback && (
              <div className="animate-guide-fade-slide pt-3 border-t-2 border-[#ef4444]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                <p className="text-sm sm:text-base font-extrabold text-[#b91c1c] leading-snug">
                  ¡Fallo registrado! {currentQuestion.explanation}
                </p>
                <button
                  type="button"
                  data-testid="team-advance-after-wrong-btn"
                  onClick={onAdvanceWrongTurn}
                  className="font-display py-2.5 px-5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff] text-sm sm:text-base xl:text-lg font-bold border-[3px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>
                    {willFinishAfterFeedback
                      ? 'Ver Equipo Ganador'
                      : 'Siguiente Turno'}
                  </span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export const LightningQuizGame: React.FC<LightningQuizGameProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onBackToLibrary,
}) => {
  const [screen, setScreen] = useState<QuizScreenView>('guide');
  const [returnScreen, setReturnScreen] = useState<'config' | 'playing'>(
    'config'
  );
  const [config, setConfig] = useState<LightningQuizConfig>(
    DEFAULT_LIGHTNING_CONFIG
  );
  const [individualState, setIndividualState] =
    useState<IndividualQuizState | null>(null);
  const [teamState, setTeamState] = useState<TeamQuizState | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    DEFAULT_LIGHTNING_CONFIG.timedDurationMinutes * 60
  );
  const [errorShakeKey, setErrorShakeKey] = useState<number>(0);
  const [isWarningFlash, setIsWarningFlash] = useState<boolean>(false);
  const [celebrateKey, setCelebrateKey] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [turnTimedOutNotice, setTurnTimedOutNotice] = useState<string | null>(
    null
  );

  const turnDurationSeconds = config.timedDurationMinutes * 60;

  const startSessionWithConfig = useCallback((nextConfig: LightningQuizConfig) => {
    setConfig(nextConfig);
    setErrorShakeKey(0);
    setIsWarningFlash(false);
    setCelebrateKey(0);
    setShowConfetti(false);
    setTurnTimedOutNotice(null);
    setRemainingSeconds(nextConfig.timedDurationMinutes * 60);

    if (nextConfig.playFormat === 'teams') {
      setIndividualState(null);
      setTeamState(createTeamQuizSession(LIGHTNING_QUIZ_QUESTIONS, nextConfig));
    } else {
      setTeamState(null);
      setIndividualState(
        createIndividualQuizSession(LIGHTNING_QUIZ_QUESTIONS, nextConfig)
      );
    }

    playCardSelectSound(true);
    setScreen('playing');
  }, []);

  // Determine whether countdown timer should tick:
  // - Individual Contrarreloj: ticks continuously during 'playing'
  // - Teams Contrarreloj: ticks strictly per active team's 'answering' turn (pauses during reveal/feedback)
  const isTimerRunning =
    screen === 'playing' &&
    config.timeMode === 'contrarreloj' &&
    ((config.playFormat === 'individual' &&
      individualState?.status === 'playing') ||
      (config.playFormat === 'teams' && teamState?.phase === 'answering'));

  useEffect(() => {
    if (!isTimerRunning) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          playTimeUpSound(true);
          if (config.playFormat === 'individual') {
            setIndividualState((s) => (s ? markIndividualTimeExpired(s) : s));
            return 0;
          }
          // Teams Contrarreloj: penalize timed-out turn, advance to opposing team,
          // and automatically reset the countdown back to full configured turn time
          setErrorShakeKey((k) => k + 1);
          setIsWarningFlash(true);
          setTeamState((s) => {
            if (!s) return s;
            const expiredTeamName = s.teams[s.activeTeam].name;
            const nextState = expireActiveTeamTurn(s);
            if (nextState.phase === 'answering') {
              setTurnTimedOutNotice(`¡Tiempo de ${expiredTeamName} agotado!`);
            } else {
              setTurnTimedOutNotice(null);
            }
            return nextState;
          });
          return turnDurationSeconds;
        }
        if (next <= 15) {
          playTimerTickSound(true, true);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning, config.playFormat, turnDurationSeconds]);

  // Auto-clear brief per-turn timeout notice
  useEffect(() => {
    if (!turnTimedOutNotice) return;
    const timer = window.setTimeout(() => setTurnTimedOutNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [turnTimedOutNotice]);

  // Playful kids' suspense soundtrack during Contrarreloj or competitive Modo en Equipos
  useEffect(() => {
    const isIndividualContrarrelojActive =
      screen === 'playing' &&
      config.playFormat === 'individual' &&
      config.timeMode === 'contrarreloj' &&
      individualState?.status === 'playing';
    const isTeamsMatchActive =
      screen === 'playing' &&
      config.playFormat === 'teams' &&
      (teamState?.phase === 'answering' || teamState?.phase === 'feedback');

    setBgmTheme(
      isIndividualContrarrelojActive || isTeamsMatchActive
        ? 'suspense'
        : 'cheerful'
    );
    return () => {
      setBgmTheme('cheerful');
    };
  }, [
    screen,
    config.playFormat,
    config.timeMode,
    individualState?.status,
    teamState?.phase,
  ]);

  // Brief warning flash auto-clear
  useEffect(() => {
    if (!isWarningFlash) return;
    const timer = window.setTimeout(() => setIsWarningFlash(false), 620);
    return () => window.clearTimeout(timer);
  }, [isWarningFlash, errorShakeKey]);

  // Victory confetti burst
  const isVictoryNow =
    (config.playFormat === 'individual' && individualState?.status === 'won') ||
    (config.playFormat === 'teams' && teamState?.phase === 'finished');

  useEffect(() => {
    if (!isVictoryNow) {
      setShowConfetti(false);
      return;
    }
    playVictoryFanfareSound(true);
    setShowConfetti(true);
    const timer = window.setTimeout(() => setShowConfetti(false), 3800);
    return () => window.clearTimeout(timer);
  }, [isVictoryNow]);

  // Individual handlers
  const handleIndividualOptionClick = useCallback((optionIndex: number) => {
    setIndividualState((prev) => {
      if (!prev) return prev;
      const result = submitIndividualAnswer(prev, optionIndex);
      if (result.ignored) return prev;

      if (result.isCorrect) {
        playAnswerRevealSound(true);
        setCelebrateKey((k) => k + 1);
      } else {
        playQuizWrongSoftSound(true);
        setErrorShakeKey((k) => k + 1);
        setIsWarningFlash(true);
      }
      return result.nextState;
    });
  }, []);

  const handleIndividualContinue = useCallback(() => {
    playCardSelectSound(true);
    setIndividualState((prev) => (prev ? advanceIndividualQuestion(prev) : prev));
  }, []);

  // Teams handlers
  const handleTeamOptionClick = useCallback(
    (teamId: TeamId, optionIndex: number) => {
      setTeamState((prev) => {
        if (!prev) return prev;
        const result = submitTeamAnswer(prev, teamId, optionIndex);
        if (result.ignored) return prev;

        if (result.isCorrect) {
          playAnswerRevealSound(true);
          setCelebrateKey((k) => k + 1);
        } else {
          playQuizWrongSoftSound(true);
          setErrorShakeKey((k) => k + 1);
          setIsWarningFlash(true);
        }
        return result.nextState;
      });
    },
    []
  );

  const handleTeamAdvance = useCallback(() => {
    playCardSelectSound(true);
    setTurnTimedOutNotice(null);
    setTeamState((prev) => {
      if (!prev) return prev;
      const next = advanceTeamTurn(prev);
      if (config.timeMode === 'contrarreloj' && next.phase === 'answering') {
        setRemainingSeconds(config.timedDurationMinutes * 60);
      }
      return next;
    });
  }, [config.timeMode, config.timedDurationMinutes]);

  // Keyboard shortcuts (1, 2, 3 to answer; Enter/Space to continue after feedback)
  useEffect(() => {
    if (screen !== 'playing') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (config.playFormat === 'individual' && individualState) {
        if (individualState.status !== 'playing') return;
        if (individualState.showingCorrectReveal) {
          if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            handleIndividualContinue();
          }
          return;
        }
        if (e.key === '1' || e.key === '2' || e.key === '3') {
          e.preventDefault();
          handleIndividualOptionClick(Number(e.key) - 1);
        }
        return;
      }

      if (config.playFormat === 'teams' && teamState) {
        if (teamState.phase === 'feedback') {
          if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            handleTeamAdvance();
          }
          return;
        }
        if (teamState.phase === 'answering') {
          if (e.key === '1' || e.key === '2' || e.key === '3') {
            e.preventDefault();
            handleTeamOptionClick(teamState.activeTeam, Number(e.key) - 1);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    screen,
    config.playFormat,
    individualState,
    teamState,
    handleIndividualOptionClick,
    handleIndividualContinue,
    handleTeamOptionClick,
    handleTeamAdvance,
  ]);

  if (screen === 'guide') {
    return (
      <MinigameTutorialScreen
        gameTitle="Cuestionario Relámpago"
        slides={LIGHTNING_TUTORIAL_SLIDES}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        onBackToLibrary={onBackToLibrary}
        onOpenModeSelector={() => setScreen('config')}
        ctaLabel={
          returnScreen === 'playing'
            ? 'Volver al Cuestionario'
            : '¡Entendido, a Jugar!'
        }
        onFinishTutorial={() => {
          playCardSelectSound(true);
          setScreen(returnScreen);
        }}
        testId="lightning-guide-screen"
      />
    );
  }

  if (screen === 'config') {
    return (
      <LightningQuizConfigScreen
        initialConfig={config}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        onBackToLibrary={onBackToLibrary}
        onOpenGuide={() => {
          setReturnScreen('config');
          setScreen('guide');
        }}
        onStartQuiz={startSessionWithConfig}
      />
    );
  }

  const isUrgent =
    config.timeMode === 'contrarreloj' && isQuizCountdownUrgent(remainingSeconds);

  const activeIndividualQuestion =
    individualState?.questions[individualState.currentIndex] ?? null;
  const individualProgress = individualState
    ? computeIndividualProgress(individualState)
    : 0;

  const activeTeamSlot = teamState ? teamState.teams[teamState.activeTeam] : null;
  const activeTeamCorrectQuestion =
    teamState &&
    teamState.phase === 'feedback' &&
    activeTeamSlot?.lastOutcome === 'correct'
      ? activeTeamSlot.questions[activeTeamSlot.currentIndex] ?? null
      : null;

  return (
    <div
      data-testid="lightning-quiz-game"
      className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between px-4 py-3 sm:px-6 sm:py-4 xl:px-8 xl:py-5 gap-3"
    >
      {/* Victory Confetti */}
      {showConfetti && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
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

      {/* TOP HEADER */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Home + Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToLibrary}
            aria-label="Volver a la biblioteca"
            title="Biblioteca de Juegos"
            className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
          </button>

          <h1 className="font-display title-nutriplato-brand text-[clamp(1.15rem,1.9vw,1.95rem)] font-bold leading-[1.2] px-1 py-1 whitespace-normal sm:whitespace-nowrap">
            Cuestionario Relámpago
          </h1>
        </div>

        {/* Center: Progress Bar (Individual) OR Active Turn Indicator (Teams) */}
        {config.playFormat === 'individual' && individualState ? (
          <StarCapsuleProgressBar
            progress={individualProgress}
            size="md"
            isWarningFlash={isWarningFlash}
            warningFlashKey={errorShakeKey}
            celebrateKey={celebrateKey}
            testId="lightning-progress-bar"
            ariaLabel={`Progreso del cuestionario: ${individualProgress}%`}
          />
        ) : teamState ? (
          <div
            data-testid="lightning-turn-indicator"
            className={`font-display px-4 sm:px-5 py-2 rounded-2xl border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center gap-2 text-sm sm:text-base xl:text-lg font-bold whitespace-nowrap transition-colors ${
              turnTimedOutNotice
                ? 'bg-[#fee2e2] text-[#b91c1c]'
                : 'bg-[#ffffff] text-[#1E1B2E]'
            }`}
          >
            <Users className="w-5 h-5 text-[#8137ea] shrink-0" aria-hidden="true" />
            <span>
              {teamState.phase === 'finished'
                ? 'Duelo Finalizado'
                : turnTimedOutNotice
                  ? `${turnTimedOutNotice} · Turno: ${teamState.teams[teamState.activeTeam].name}`
                  : `Turno: ${teamState.teams[teamState.activeTeam].name}`}
            </span>
          </div>
        ) : null}

        {/* Right: Timer (if Contrarreloj) + Stats (Individual) + Mode + Reset + Fullscreen */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {config.timeMode === 'contrarreloj' && (
            <div
              data-testid="lightning-countdown"
              aria-label={
                config.playFormat === 'teams'
                  ? `Tiempo del turno: ${formatQuizCountdown(remainingSeconds)}`
                  : `Tiempo restante: ${formatQuizCountdown(remainingSeconds)}`
              }
              title={
                config.playFormat === 'teams'
                  ? 'Tiempo por turno (se reinicia en cada cambio de turno)'
                  : 'Tiempo límite restante'
              }
              className={`font-display px-3.5 py-2 rounded-2xl border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center gap-1.5 text-sm sm:text-base font-bold tabular-nums whitespace-nowrap ${
                isUrgent
                  ? 'bg-[#fc3e7e] text-[#ffffff] animate-semaforo-timer-urgent'
                  : 'bg-[#ffffff] text-[#1E1B2E]'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {config.playFormat === 'teams'
                  ? `Turno · ${formatQuizCountdown(remainingSeconds)}`
                  : formatQuizCountdown(remainingSeconds)}
              </span>
            </div>
          )}

          {config.playFormat === 'individual' && individualState && (
            <div
              data-testid="lightning-individual-hud"
              className="hidden md:flex items-center gap-2 rounded-2xl bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] px-3.5 py-1.5 font-display text-sm font-bold tabular-nums whitespace-nowrap"
            >
              <span className="text-[#1E1B2E]">
                Pregunta{' '}
                {Math.min(
                  individualState.currentIndex + 1,
                  individualState.questions.length
                )}{' '}
                / {individualState.questions.length}
              </span>
              <span className="text-[#1E1B2E]/30" aria-hidden="true">
                ·
              </span>
              <span className="text-[#16a34a]">
                {individualState.correctCount} aciertos
              </span>
              <span className="text-[#1E1B2E]/30" aria-hidden="true">
                ·
              </span>
              <span className="text-[#dc2626]">
                {individualState.wrongCount} errores
              </span>
            </div>
          )}

          <button
            type="button"
            data-testid="lightning-open-guide-btn"
            onClick={() => {
              playUiClickSound();
              setReturnScreen('playing');
              setScreen('guide');
            }}
            aria-label="Ver instructivo"
            title="Ver Instructivo"
            className="font-display px-3 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-xs sm:text-sm font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150"
          >
            <BookOpen className="w-4 h-4 text-[#8137ea] shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">Instructivo</span>
          </button>

          <button
            type="button"
            data-testid="lightning-open-config-btn"
            onClick={() => {
              playUiClickSound();
              setScreen('config');
            }}
            className="font-display px-3.5 py-2 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-xs sm:text-sm font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150"
          >
            <Gamepad2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Modo de Juego</span>
          </button>

          <button
            type="button"
            onClick={() => startSessionWithConfig(config)}
            aria-label="Reiniciar partida"
            title="Reiniciar partida"
            className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
          </button>

          <SoundToggleButton />

          <button
            type="button"
            data-testid="fullscreen-btn"
            onClick={onToggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={
              isFullscreen
                ? 'Salir de pantalla completa'
                : 'Pantalla completa para TV'
            }
            className={`hidden sm:flex p-2.5 rounded-2xl border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ${
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

      {/* MAIN PLAY STAGE */}
      <main className="relative z-10 w-full flex-1 min-h-0 overflow-y-auto flex flex-col items-center py-1 sm:py-2 px-1">
        {/* ================= INDIVIDUAL MODE ================= */}
        {config.playFormat === 'individual' && individualState && (
          <>
            {individualState.status === 'won' ? (
              <div
                data-testid="lightning-victory-card"
                className="animate-modal-pop w-full max-w-xl my-auto mx-auto rounded-[36px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] shadow-[0_16px_0_rgba(30,27,46,0.24)] p-8 sm:p-10 text-center flex flex-col items-center gap-5"
              >
                <div className="animate-trophy-celebrate w-24 h-24 rounded-3xl bg-[#fee330] border-[4px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-[#1E1B2E]" aria-hidden="true" />
                </div>

                <h2 className="font-display text-3xl sm:text-4xl xl:text-[46px] font-bold text-[#8137ea] leading-tight">
                  ¡Ganaste el Cuestionario!
                </h2>

                <p className="text-xl sm:text-2xl font-black text-[#1E1B2E] tabular-nums">
                  <span className="text-[#16a34a]">
                    {individualState.correctCount} /{' '}
                    {individualState.questions.length} aciertos
                  </span>
                  {' · '}
                  <span className="text-[#dc2626]">
                    {individualState.wrongCount}{' '}
                    {individualState.wrongCount === 1 ? 'error' : 'errores'}
                  </span>
                </p>

                {config.timeMode === 'contrarreloj' && (
                  <p className="text-base sm:text-lg font-extrabold text-[#1E1B2E]/75 tabular-nums">
                    Tiempo restante: {formatQuizCountdown(remainingSeconds)}
                  </p>
                )}

                <p className="text-base sm:text-xl font-bold text-[#1E1B2E]/80 leading-relaxed">
                  ¡Eres un súper campeón de la nutrición saludable!
                </p>

                <div className="w-full flex flex-col gap-3.5 pt-1">
                  <button
                    type="button"
                    data-testid="lightning-play-again-btn"
                    onClick={() => startSessionWithConfig(config)}
                    className="font-display w-full py-4 px-6 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-xl sm:text-2xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <RotateCcw className="w-6 h-6" aria-hidden="true" />
                    <span>Jugar Otra Partida</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScreen('config')}
                    className="font-display w-full py-3.5 px-6 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-lg sm:text-xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Gamepad2 className="w-6 h-6" aria-hidden="true" />
                    <span>Cambiar Configuración</span>
                  </button>
                </div>
              </div>
            ) : activeIndividualQuestion ? (
              <div
                key={activeIndividualQuestion.id}
                data-testid="lightning-question-card"
                className="animate-detail-stage-enter w-full max-w-[1320px] h-[730.875px] my-auto mx-auto rounded-[36px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] shadow-[0_16px_0_rgba(30,27,46,0.22)] flex flex-col"
              >
                {/* Clean Purple Header WITHOUT Food Spoiler */}
                <div
                  className="rounded-t-[31px] px-7 sm:px-9 py-4 xl:py-5 border-b-[4px] border-[#1E1B2E] flex items-center justify-between gap-4 shrink-0"
                  style={{
                    background:
                      'linear-gradient(112deg, #6d28d9 0%, #8137ea 56%, #9333ea 100%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Zap
                      className="w-7 h-7 xl:w-8 xl:h-8 fill-[#fee330] text-[#1E1B2E] shrink-0"
                      aria-hidden="true"
                    />
                    <span
                      className="font-display text-xl sm:text-2xl xl:text-[28px] font-bold uppercase tracking-wider text-[#ffffff]"
                      style={{ textShadow: '0 2.5px 0 #1E1B2E' }}
                    >
                      Pregunta Relámpago
                    </span>
                  </div>

                  <span
                    className="font-display text-base sm:text-lg xl:text-xl font-bold text-[#fee330] whitespace-nowrap"
                    style={{ textShadow: '0 2px 0 #1E1B2E' }}
                  >
                    Nivel {QUIZ_DIFFICULTY_META[activeIndividualQuestion.difficulty].label}
                  </span>
                </div>

                {/* Question & 3 Numbered Options */}
                <div className="flex-1 min-h-0 p-7 sm:p-9 xl:p-11 flex flex-col justify-between gap-6">
                  <p
                    data-testid="lightning-question-text"
                    className="font-display text-2xl sm:text-3xl xl:text-[38px] font-bold text-[#1E1B2E] leading-snug text-balance"
                  >
                    {activeIndividualQuestion.question}
                  </p>

                  <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-5">
                    {activeIndividualQuestion.options.map((option, idx) => {
                      const isWrongAttempt =
                        individualState.wrongOptionIndicesOnCurrent.includes(idx);
                      const isDisabled =
                        isWrongAttempt ||
                        individualState.showingCorrectReveal ||
                        individualState.status !== 'playing';

                      return (
                        <button
                          key={`${activeIndividualQuestion.id}-${idx}-${
                            isWrongAttempt ? errorShakeKey : 0
                          }`}
                          type="button"
                          data-testid={`lightning-option-${idx}`}
                          disabled={isDisabled}
                          onClick={() => handleIndividualOptionClick(idx)}
                          className={`w-full min-h-[72px] sm:min-h-[84px] xl:min-h-[96px] px-6 sm:px-7 py-4 rounded-2xl xl:rounded-[24px] border-[3.5px] shadow-[0_6px_0_#1E1B2E] text-left font-bold text-lg sm:text-2xl xl:text-[26px] flex items-center justify-between gap-4 transition-[transform,background-color,color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                            isWrongAttempt
                              ? 'animate-quiz-wrong-red bg-[#fee2e2] border-[#dc2626] text-[#dc2626] cursor-default'
                              : isDisabled
                                ? 'bg-[#ffffff]/70 border-[#1E1B2E] text-[#1E1B2E]/60 cursor-default'
                                : 'bg-[#ffffff] hover:bg-[#fee330]/35 border-[#1E1B2E] text-[#1E1B2E] cursor-pointer active:translate-y-[3px]'
                          }`}
                        >
                          <span className="flex items-center gap-4 sm:gap-5 min-w-0">
                            <span
                              className={`w-11 h-11 sm:w-12 sm:h-12 xl:w-[54px] xl:h-[54px] rounded-xl border-[2.5px] font-display font-bold text-xl xl:text-2xl flex items-center justify-center shrink-0 tabular-nums ${
                                isWrongAttempt
                                  ? 'bg-[#ef4444] text-[#ffffff] border-[#991b1b]'
                                  : 'bg-[#fee330] text-[#1E1B2E] border-[#1E1B2E]'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span
                              className={`leading-snug transition-colors duration-150 ${
                                isWrongAttempt ? 'text-[#dc2626] font-black' : ''
                              }`}
                            >
                              {option}
                            </span>
                          </span>

                          {isWrongAttempt && (
                            <span className="inline-flex items-center gap-1.5 font-display text-base sm:text-lg font-bold text-[#dc2626] shrink-0">
                              <X className="w-6 h-6 stroke-[3]" aria-hidden="true" />
                              ¡Intenta otra!
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Compact Stats Footer */}
                  <div className="flex md:hidden items-center justify-between text-xs font-extrabold text-[#1E1B2E]/80 tabular-nums pt-1 border-t border-[#1E1B2E]/10 shrink-0">
                    <span>
                      Pregunta {individualState.currentIndex + 1} /{' '}
                      {individualState.questions.length}
                    </span>
                    <span>
                      {individualState.correctCount} aciertos ·{' '}
                      {individualState.wrongCount} errores
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* ================= COMPETITIVE TEAMS MODE (EQUIPO 1 vs EQUIPO 2) ================= */}
        {config.playFormat === 'teams' && teamState && (
          <>
            {teamState.phase === 'finished' ? (
              <div
                data-testid="lightning-teams-winner-card"
                className="animate-modal-pop w-full max-w-3xl my-auto mx-auto rounded-[36px] bg-[#ffffff] border-[4.5px] border-[#1E1B2E] border-b-[11px] shadow-[0_16px_0_rgba(30,27,46,0.24)] p-8 sm:p-10 text-center flex flex-col items-center gap-6"
              >
                <div className="animate-trophy-celebrate w-24 h-24 rounded-3xl bg-[#fee330] border-[4px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-[#1E1B2E]" aria-hidden="true" />
                </div>

                <h2 className="font-display text-3xl sm:text-4xl xl:text-[48px] font-bold text-[#8137ea] leading-tight">
                  {teamState.winner === 'team1'
                    ? '¡Ganó el Equipo 1!'
                    : teamState.winner === 'team2'
                      ? '¡Ganó el Equipo 2!'
                      : '¡Empate de Campeones!'}
                </h2>

                {/* Side-by-Side Final Scoreboard */}
                <div className="w-full grid grid-cols-2 gap-5">
                  {(['team1', 'team2'] as const).map((tid) => {
                    const t = teamState.teams[tid];
                    const isWinner = teamState.winner === tid;
                    return (
                      <div
                        key={tid}
                        className={`rounded-3xl border-[3.5px] border-[#1E1B2E] p-5 sm:p-6 flex flex-col items-center gap-2 ${
                          isWinner
                            ? 'bg-[#fef9c3] shadow-[0_6px_0_#1E1B2E]'
                            : 'bg-[#FFFDF7]'
                        }`}
                      >
                        <span className="font-display text-2xl sm:text-3xl font-bold text-[#1E1B2E]">
                          {t.name} {isWinner ? '🏆' : ''}
                        </span>
                        <span className="font-display text-3xl sm:text-4xl font-bold text-[#16a34a] tabular-nums">
                          {t.correctCount} aciertos
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-[#dc2626] tabular-nums">
                          {t.wrongCount} {t.wrongCount === 1 ? 'error' : 'errores'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full flex flex-col sm:flex-row gap-4 pt-1">
                  <button
                    type="button"
                    data-testid="lightning-teams-rematch-btn"
                    onClick={() => startSessionWithConfig(config)}
                    className="font-display flex-1 py-4 px-6 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-xl sm:text-2xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <RotateCcw className="w-6 h-6" aria-hidden="true" />
                    <span>Jugar Revancha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScreen('config')}
                    className="font-display flex-1 py-4 px-6 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-xl sm:text-2xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Gamepad2 className="w-6 h-6" aria-hidden="true" />
                    <span>Cambiar Modo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                data-testid="lightning-teams-arena"
                className="w-full max-w-[1720px] h-[730.875px] my-auto mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 xl:gap-8 items-stretch py-1"
              >
                <TeamPanelCard
                  slot={teamState.teams.team1}
                  isActiveTurn={teamState.activeTeam === 'team1'}
                  isFeedbackPhase={teamState.phase === 'feedback'}
                  willFinishAfterFeedback={willAdvanceFinishTeamMatch(teamState)}
                  errorShakeKey={errorShakeKey}
                  celebrateKey={celebrateKey}
                  onSelectOption={handleTeamOptionClick}
                  onAdvanceWrongTurn={handleTeamAdvance}
                />
                <TeamPanelCard
                  slot={teamState.teams.team2}
                  isActiveTurn={teamState.activeTeam === 'team2'}
                  isFeedbackPhase={teamState.phase === 'feedback'}
                  willFinishAfterFeedback={willAdvanceFinishTeamMatch(teamState)}
                  errorShakeKey={errorShakeKey}
                  celebrateKey={celebrateKey}
                  onSelectOption={handleTeamOptionClick}
                  onAdvanceWrongTurn={handleTeamAdvance}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* DYNAMIC 3D FOOD REVEAL OVERLAY — INDIVIDUAL MODE */}
      {config.playFormat === 'individual' &&
        individualState?.showingCorrectReveal &&
        activeIndividualQuestion && (
          <CorrectFoodRevealOverlay
            key={activeIndividualQuestion.id}
            question={activeIndividualQuestion}
            eyebrowLabel="¡Respuesta Correcta!"
            ctaLabel={
              individualState.currentIndex >= individualState.questions.length - 1
                ? 'Ver Resultado Final'
                : 'Siguiente Pregunta'
            }
            onContinue={handleIndividualContinue}
          />
        )}

      {/* DYNAMIC 3D FOOD REVEAL OVERLAY — TEAMS MODE */}
      {config.playFormat === 'teams' &&
        teamState &&
        activeTeamSlot &&
        activeTeamCorrectQuestion && (
          <CorrectFoodRevealOverlay
            key={activeTeamCorrectQuestion.id}
            question={activeTeamCorrectQuestion}
            eyebrowLabel={`¡Correcto, ${activeTeamSlot.name}!`}
            ctaLabel={
              willAdvanceFinishTeamMatch(teamState)
                ? 'Ver Equipo Ganador'
                : `Turno del ${
                    teamState.activeTeam === 'team1' ? 'Equipo 2' : 'Equipo 1'
                  }`
            }
            onContinue={handleTeamAdvance}
          />
        )}

      {/* TIME UP MODAL — INDIVIDUAL CONTRARRELOJ */}
      {config.playFormat === 'individual' &&
        individualState?.status === 'lost_time' && (
          <QuizTimeUpModal
            title="¡Se acabó el tiempo!"
            subtitle="¡Inténtalo de nuevo!"
            summaryLine={`Lograste ${individualState.correctCount} de ${individualState.questions.length} aciertos (${individualProgress}%) en ${config.timedDurationMinutes} min.`}
            onRetry={() => startSessionWithConfig(config)}
            onChangeMode={() => setScreen('config')}
          />
        )}

      {/* TIME UP MODAL — TEAMS CONTRARRELOJ */}
      {config.playFormat === 'teams' && teamState?.phase === 'lost_time' && (
        <QuizTimeUpModal
          title="¡Se acabó el tiempo!"
          subtitle={
            teamState.winner === 'team1'
              ? 'Ventaja final: Equipo 1'
              : teamState.winner === 'team2'
                ? 'Ventaja final: Equipo 2'
                : '¡Empate en el marcador!'
          }
          summaryLine={`Equipo 1: ${teamState.teams.team1.correctCount} aciertos (${teamState.teams.team1.wrongCount} errores) · Equipo 2: ${teamState.teams.team2.correctCount} aciertos (${teamState.teams.team2.wrongCount} errores).`}
          onRetry={() => startSessionWithConfig(config)}
          onChangeMode={() => setScreen('config')}
        />
      )}
    </div>
  );
};
