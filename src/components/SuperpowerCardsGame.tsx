import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Home,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SUPERPOWER_CARDS, SuperpowerCard } from '../data/superpowerCards';
import { SUPERPOWER_TUTORIAL_SLIDES } from '../data/minigameTutorials';
import { dealRandomTrioRound, TOTAL_ROUNDS } from '../game/superpowerRules';
import {
  playCardFlipMagicSound,
  playCardSelectSound,
  playCardShuffleSound,
} from '../utils/superpowerAudio';
import { playUiClickSound, playVictoryFanfareSound } from '../utils/soundSystem';
import { FoodIllustration } from './FoodIllustration';
import { MinigameTutorialScreen } from './MinigameTutorialScreen';
import { SoundToggleButton } from './SoundToggleButton';

interface SuperpowerCardsGameProps {
  onBackToLibrary: () => void;
}

const VOTE_PROMPT =
  '¡Hora de votar! ¿De cuál de estos tres alimentos quieren descubrir su superpoder?';

const CONFETTI_PIECES = [
  { left: '8%', color: '#fee330', delay: '0s', duration: '2.4s' },
  { left: '18%', color: '#5dd118', delay: '0.2s', duration: '2.7s' },
  { left: '30%', color: '#fc3e7e', delay: '0.1s', duration: '2.3s' },
  { left: '42%', color: '#8137ea', delay: '0.35s', duration: '2.6s' },
  { left: '54%', color: '#ffffff', delay: '0.15s', duration: '2.5s' },
  { left: '66%', color: '#5dd118', delay: '0.25s', duration: '2.8s' },
  { left: '78%', color: '#fc3e7e', delay: '0.05s', duration: '2.4s' },
  { left: '90%', color: '#fee330', delay: '0.3s', duration: '2.6s' },
];

const FloatingSuperpowerIcon: React.FC = () => (
  <svg
    viewBox="0 0 72 72"
    className="superpower-floating-icon w-14 h-14 xl:w-16 xl:h-16 shrink-0"
    aria-hidden="true"
  >
    <circle cx="36" cy="36" r="28" fill="#8137ea" fillOpacity="0.14" />
    <path
      d="M36 9 L42.8 25.5 L60.5 27 L47 38.6 L51.2 56 L36 46.6 L20.8 56 L25 38.6 L11.5 27 L29.2 25.5 Z"
      fill="#fee330"
      stroke="#1E1B2E"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <circle cx="57" cy="15" r="4.5" fill="#fc3e7e" />
    <circle cx="15" cy="52" r="3.5" fill="#4efcfb" />
  </svg>
);

const FloatingHomeTipIcon: React.FC = () => (
  <svg
    viewBox="0 0 72 72"
    className="superpower-floating-icon w-14 h-14 xl:w-16 xl:h-16 shrink-0"
    aria-hidden="true"
  >
    <circle cx="36" cy="36" r="28" fill="#5dd118" fillOpacity="0.16" />
    <path
      d="M14 35 L36 16 L58 35 V55 C58 57.5 56 59.5 53.5 59.5 H18.5 C16 59.5 14 57.5 14 55 Z"
      fill="#5dd118"
      stroke="#1E1B2E"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <path
      d="M36 47 C36 47 26.5 40.5 26.5 34.2 C26.5 30.8 29.2 28.5 32.1 28.5 C34 28.5 35.3 29.5 36 30.8 C36.7 29.5 38 28.5 39.9 28.5 C42.8 28.5 45.5 30.8 45.5 34.2 C45.5 40.5 36 47 36 47 Z"
      fill="#fc3e7e"
      stroke="#1E1B2E"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowTriangleIcon: React.FC<{ direction: 'left' | 'right' }> = ({
  direction,
}) => (
  <svg
    viewBox="0 0 36 36"
    className={`w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 ${
      direction === 'left' ? 'rotate-180' : ''
    }`}
    aria-hidden="true"
  >
    <path
      d="M11 6.8 C11 4.9 13.1 3.8 14.7 4.8 L28.4 13.9 C29.9 14.9 29.9 17.1 28.4 18.1 L14.7 27.2 C13.1 28.2 11 27.1 11 25.2 Z"
      transform="translate(0, 2)"
      fill="currentColor"
      stroke="#1E1B2E"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkleAccentSvg: React.FC<{ className?: string; fill?: string }> = ({
  className = 'w-5 h-5',
  fill = '#fee330',
}) => (
  <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
    <path
      d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
      fill={fill}
      stroke="#1E1B2E"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

interface InteractiveAAA3DCardProps {
  variant: 'superpower' | 'hometip';
  ariaLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enterDelayMs: number;
}

const InteractiveAAA3DCard: React.FC<InteractiveAAA3DCardProps> = React.memo(({
  variant,
  ariaLabel,
  eyebrow,
  title,
  description,
  icon,
  enterDelayMs,
}) => {
  const isPower = variant === 'superpower';

  return (
    <div
      className="aaa-card-3d-scene animate-detail-card-3d"
      style={{ animationDelay: `${enterDelayMs}ms` }}
    >
      <section
        aria-label={ariaLabel}
        className={`tarjeta-info-amplia ${
          isPower ? 'aaa-card-superpower' : 'aaa-card-hometip'
        }`}
      >
        {/* VIBRANT GLOSSY AAA HEADER RIBBON */}
        <div
          className="relative z-10 flex items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-b-[3.5px] border-[#1E1B2E]"
          style={{
            background: isPower
              ? 'linear-gradient(112deg, #7c2ae8 0%, #9b4dff 54%, #fc3e7e 100%)'
              : 'linear-gradient(112deg, #4cc610 0%, #5dd118 52%, #10b981 100%)',
          }}
        >
          {/* Glossy curved top highlight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-1 h-3 rounded-full bg-[#ffffff]/25"
          />

          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
            <div
              className={`aaa-card-layer-badge w-14 h-14 xl:w-16 xl:h-16 rounded-2xl border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center shrink-0 ${
                isPower ? 'bg-[#fee330]' : 'bg-[#FFFDF7]'
              }`}
            >
              {icon}
            </div>

            <div className="min-w-0">
              <span className="block font-display text-sm sm:text-base xl:text-lg font-bold uppercase tracking-wider text-[#ffffff] drop-shadow-[0_2px_0_#1E1B2E] leading-tight">
                {eyebrow}
              </span>
            </div>
          </div>

          {/* Decorative floating comic stars */}
          <div className="relative z-10 flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <SparkleAccentSvg
              className="w-6 h-6 animate-aaa-sparkle"
              fill={isPower ? '#fee330' : '#fee330'}
            />
            <SparkleAccentSvg
              className="w-4 h-4 animate-aaa-sparkle"
              fill={isPower ? '#4efcfb' : '#ffffff'}
            />
          </div>
        </div>

        {/* COLOR-TINTED COMIC CARD BODY */}
        <div className="relative z-10 px-6 sm:px-8 py-5 xl:py-6 flex flex-col gap-2.5">
          {/* Subtle comic halftone dot texture in bottom-right corner */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-0 bottom-0 w-44 h-24 opacity-80 ${
              isPower ? 'aaa-card-halftone-purple' : 'aaa-card-halftone-green'
            }`}
            style={{
              maskImage: 'radial-gradient(circle at 100% 100%, black 22%, transparent 74%)',
              WebkitMaskImage:
                'radial-gradient(circle at 100% 100%, black 22%, transparent 74%)',
            }}
          />

          <div className="aaa-card-layer-content relative z-10 flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`w-2.5 h-8 rounded-full border-2 border-[#1E1B2E] shrink-0 ${
                  isPower ? 'bg-[#fc3e7e]' : 'bg-[#fee330]'
                }`}
              />
              <h3
                className={`font-display text-2xl sm:text-3xl xl:text-[34px] font-bold leading-tight text-balance ${
                  isPower ? 'text-[#3b0764]' : 'text-[#14532d]'
                }`}
              >
                {title}
              </h3>
            </div>

            <p className="text-base sm:text-lg xl:text-[21px] font-extrabold text-[#1E1B2E]/90 leading-relaxed pl-0.5">
              {description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

interface InteractiveFood3DShowcaseProps {
  foodId: string;
  foodName: string;
}

const InteractiveFood3DShowcase: React.FC<InteractiveFood3DShowcaseProps> = React.memo(({
  foodId,
  foodName,
}) => {
  const [tapPulseKey, setTapPulseKey] = useState<number>(0);

  const handleTap = () => {
    playCardSelectSound(true);
    setTapPulseKey((prev) => prev + 1);
  };

  return (
    <div
      className="aaa-food-3d-scene relative flex items-center justify-center"
      onClick={handleTap}
      role="img"
      aria-label={`Ilustración 3D animada de ${foodName}`}
    >
      <div
        key={tapPulseKey}
        className={`aaa-food-3d-target flex items-center justify-center ${
          tapPulseKey > 0 ? 'animate-aaa-card-tap' : ''
        }`}
      >
        <div className="alimento-3d-wrapper relative cursor-pointer">
          <FoodIllustration
            foodId={foodId}
            className="w-[550px] h-[500px] object-contain pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
});

export const SuperpowerCardsGame: React.FC<SuperpowerCardsGameProps> = ({
  onBackToLibrary,
}) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);
  const [roundsHistory, setRoundsHistory] = useState<SuperpowerCard[][]>(() => [
    dealRandomTrioRound(SUPERPOWER_CARDS, new Set()),
  ]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [exploredCards, setExploredCards] = useState<SuperpowerCard[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'none' | 'next' | 'prev'>('none');
  const [roundAnimKey, setRoundAnimKey] = useState<number>(0);
  const [explorationFinished, setExplorationFinished] = useState<boolean>(false);
  const [showCelebrationConfetti, setShowCelebrationConfetti] = useState<boolean>(false);

  const currentCards = roundsHistory[currentRoundIdx] ?? [];
  const selectedCard: SuperpowerCard | null =
    selectedIndex !== null ? currentCards[selectedIndex] ?? null : null;

  useEffect(() => {
    if (!explorationFinished) {
      setShowCelebrationConfetti(false);
      return;
    }
    setShowCelebrationConfetti(true);
    const timer = window.setTimeout(() => {
      setShowCelebrationConfetti(false);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [explorationFinished]);

  const handlePreviousRound = useCallback(() => {
    if (currentRoundIdx <= 0) return;
    playCardShuffleSound(true);
    setSelectedIndex(null);
    setExplorationFinished(false);
    setSlideDirection('prev');
    setRoundAnimKey((prev) => prev + 1);
    setCurrentRoundIdx((prev) => Math.max(0, prev - 1));
  }, [currentRoundIdx]);

  const handleNextRound = useCallback(() => {

    if (currentRoundIdx >= TOTAL_ROUNDS - 1) {
      playVictoryFanfareSound(true);
      setSelectedIndex(null);
      setExplorationFinished(true);
      return;
    }

    playCardShuffleSound(true);
    setSelectedIndex(null);
    setSlideDirection('next');
    setRoundAnimKey((prev) => prev + 1);

    const nextIdx = currentRoundIdx + 1;
    if (nextIdx < roundsHistory.length) {
      setCurrentRoundIdx(nextIdx);
      return;
    }

    const usedIds = new Set<string>();
    roundsHistory.forEach((trio) => {
      trio.forEach((c) => usedIds.add(c.id));
    });
    const prevRoundIds = new Set(currentCards.map((c) => c.id));
    const nextTrio = dealRandomTrioRound(
      SUPERPOWER_CARDS,
      usedIds,
      prevRoundIds
    );

    setRoundsHistory((prev) => [...prev, nextTrio]);
    setCurrentRoundIdx(nextIdx);
  }, [currentRoundIdx, roundsHistory, currentCards]);

  const handleRestartSession = useCallback(() => {
    playCardShuffleSound(true);
    setRoundsHistory([dealRandomTrioRound(SUPERPOWER_CARDS, new Set())]);
    setCurrentRoundIdx(0);
    setExploredCards([]);
    setSelectedIndex(null);
    setExplorationFinished(false);
    setSlideDirection('next');
    setRoundAnimKey((prev) => prev + 1);
  }, []);

  const handleSelectCard = useCallback(
    (idx: number) => {
      const card = currentCards[idx];
      if (!card) return;
      playCardSelectSound(true);
      playCardFlipMagicSound(true);
      setSelectedIndex(idx);
      setExploredCards((prev) =>
        prev.some((c) => c.id === card.id) ? prev : [...prev, card]
      );
    },
    [currentCards]
  );

  const handleReturnToCards = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (explorationFinished) return;

      if (selectedIndex === null) {
        if (e.key === '1' || e.key === '2' || e.key === '3') {
          e.preventDefault();
          handleSelectCard(Number(e.key) - 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePreviousRound();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextRound();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handleReturnToCards();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    explorationFinished,
    selectedIndex,
    handleSelectCard,
    handlePreviousRound,
    handleNextRound,
    handleReturnToCards,
  ]);

  const cardGridAnimClass =
    slideDirection === 'next'
      ? 'animate-cards-slide-right'
      : slideDirection === 'prev'
        ? 'animate-cards-slide-left'
        : '';

  if (showTutorial) {
    return (
      <MinigameTutorialScreen
        gameTitle="Cartas del Superpoder"
        slides={SUPERPOWER_TUTORIAL_SLIDES}
        onBackToLibrary={onBackToLibrary}
        ctaLabel={hasStartedOnce ? 'Volver a las Cartas' : '¡Entendido, a Jugar!'}
        onFinishTutorial={() => {
          playCardSelectSound(true);
          setHasStartedOnce(true);
          setShowTutorial(false);
        }}
        testId="superpower-guide-screen"
      />
    );
  }

  return (
    <div
      data-testid="superpower-game"
      className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between p-4 xl:p-6"
    >
      {/* Celebration Confetti on Exploration Completion */}
      {showCelebrationConfetti && (
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

      {/* TOP HEADER */}
      <header className="relative z-10 flex items-center justify-between gap-4 shrink-0">
        {selectedCard === null ? (
          <>
            {/* Left Cluster: Home + Title + Purple Fullscreen Button */}
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

              <div className="min-w-0">
                <h1 className="font-display title-nutriplato-brand text-2xl sm:text-3xl xl:text-[34px] font-bold leading-none truncate py-0.5">
                  Cartas del Superpoder
                </h1>
                <p className="text-xs xl:text-sm font-extrabold text-[#1E1B2E]/85 mt-0.5 truncate">
                  ¿Cuál Elegimos Hoy?
                </p>
              </div>

              <button
                type="button"
                data-testid="superpower-guide-btn"
                onClick={() => {
                  playUiClickSound();
                  setShowTutorial(true);
                }}
                aria-label="Ver instructivo"
                title="Ver Instructivo"
                className="font-display px-3 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-sm sm:text-base font-bold border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <BookOpen className="w-4 h-4 text-[#8137ea] shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Instructivo</span>
              </button>

              <SoundToggleButton />
            </div>

            {/* Right Cluster: 10-Round Segmented Progress Bar + Quick Quiz Trigger */}
            <div
              data-testid="rounds-progress-bar"
              aria-label={`Progreso de rondas: Ronda ${currentRoundIdx + 1} de ${TOTAL_ROUNDS}`}
              className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] px-3.5 py-2 shrink-0"
            >
              <span className="font-display text-sm sm:text-base xl:text-lg font-bold text-[#1E1B2E] tabular-nums whitespace-nowrap">
                Ronda {currentRoundIdx + 1} / {TOTAL_ROUNDS}
              </span>

              <div
                className="flex items-center gap-1.5"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={TOTAL_ROUNDS}
                aria-valuenow={currentRoundIdx + 1}
              >
                {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => {
                  const isCompleted = idx < currentRoundIdx;
                  const isActive = idx === currentRoundIdx;
                  return (
                    <span
                      key={idx}
                      data-testid={`round-segment-${idx + 1}`}
                      className={`block w-4 h-5 sm:w-5 sm:h-5 xl:w-6 xl:h-6 rounded-lg border-2 border-[#1E1B2E] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isCompleted
                          ? 'bg-[#5dd118] shadow-[0_2px_0_#1E1B2E]'
                          : isActive
                            ? 'bg-[#fee330] shadow-[0_2px_0_#1E1B2E] scale-110'
                            : 'bg-[#FFFDF7]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* DETAIL VIEW HEADER: Compact Back Icon + Title on Left, Fullscreen on Top-Right */
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                data-testid="back-to-cards-btn"
                onClick={handleReturnToCards}
                aria-label="Volver a las 3 cartas"
                title="Volver a las 3 cartas (Esc)"
                className="p-2.5 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] text-[#ffffff] cursor-pointer shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1E1B2E]"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <h1 className="font-display title-nutriplato-brand text-2xl sm:text-3xl xl:text-[34px] font-bold leading-none truncate py-0.5">
                Cartas del Superpoder
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <SoundToggleButton />
            </div>
          </div>
        )}
      </header>

      {/* MAIN STAGE */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-2 xl:py-3">
        {explorationFinished ? (
          /* ================= EDUCATIONAL EXPLORATION COMPLETE ================= */
          <div
            data-testid="superpower-exploration-complete"
            className="animate-modal-pop w-full max-w-lg mx-auto rounded-[32px] bg-[#ffffff] border-[3.5px] border-[#1E1B2E] shadow-[0_10px_0_#1E1B2E] p-7 sm:p-8 text-center flex flex-col items-center gap-4"
          >
            <div className="animate-trophy-celebrate w-20 h-20 rounded-3xl bg-[#fee330] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[#1E1B2E]" aria-hidden="true" />
            </div>

            <h2
              id="rounds-complete-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-[#8137ea] leading-tight"
            >
              ¡Exploración Completada!
            </h2>

            <p className="text-lg sm:text-xl font-black text-[#1E1B2E]">
              {exploredCards.length > 0 ? (
                <>
                  Descubriste el superpoder de{' '}
                  <span className="text-[#5dd118] tabular-nums">
                    {exploredCards.length}
                  </span>{' '}
                  {exploredCards.length === 1 ? 'alimento' : 'alimentos'}
                </>
              ) : (
                'Recorriste las 10 rondas de cartas nutritivas'
              )}
            </p>

            <p className="text-base font-bold text-[#1E1B2E]/80 leading-relaxed">
              ¡Excelente aprendizaje! Puedes seguir explorando nuevas combinaciones de cartas cuando quieras.
            </p>

            <div className="w-full flex flex-col gap-3 pt-2">
              <button
                type="button"
                data-testid="restart-rounds-btn"
                onClick={handleRestartSession}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-lg font-black border-[3px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                <span>Explorar 10 Rondas Nuevas</span>
              </button>

              <button
                type="button"
                onClick={onBackToLibrary}
                className="w-full py-3 px-5 rounded-2xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] text-base font-extrabold border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                Volver a la Biblioteca
              </button>
            </div>
          </div>
        ) : selectedCard === null ? (
          /* ================= VOTING PHASE: 3 FRAMED FLASHCARDS + LATERAL ARROWS ================= */
          <div className="h-full min-h-0 flex flex-col justify-between gap-4 w-full">
            {/* Middle Arena: [◀] + [3 Framed Flashcards] + [▶] */}
            <div className="flex-1 min-h-0 flex items-center gap-3 sm:gap-5 xl:gap-7 py-1">
              {/* Left Navigation Arrow (◀) */}
              <button
                type="button"
                data-testid="prev-round-btn"
                onClick={handlePreviousRound}
                disabled={currentRoundIdx === 0}
                aria-label="Ronda anterior"
                title={
                  currentRoundIdx === 0
                    ? 'Estás en la primera ronda'
                    : 'Volver a la ronda anterior'
                }
                className={`shrink-0 w-14 h-20 sm:w-16 sm:h-24 xl:w-[74px] xl:h-28 rounded-3xl border-[3px] border-[#1E1B2E] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                  currentRoundIdx === 0
                    ? 'bg-[#ffffff]/70 text-[#1E1B2E]/30 shadow-[0_3px_0_#1E1B2E] opacity-45 cursor-not-allowed'
                    : 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] cursor-pointer hover:scale-105'
                }`}
              >
                <ArrowTriangleIcon direction="left" />
              </button>

              {/* 3 Framed Flashcards Grid */}
              <div
                key={roundAnimKey}
                className={`flex-1 min-h-0 h-[550px] mt-[-40px] grid grid-cols-3 gap-5 xl:gap-8 items-center justify-items-center ${cardGridAnimClass}`}
              >
                {currentCards.map((card, idx) => {
                  const voteNum = idx + 1;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      data-testid={`vote-card-${voteNum}`}
                      onClick={() => handleSelectCard(idx)}
                      aria-label={`Votar número ${voteNum}: ${card.name}`}
                      style={
                        {
                          '--color-alimento': card.frameColor,
                        } as React.CSSProperties
                      }
                      className="flashcard-alimento w-full max-w-[350px] h-[620px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
                    >
                      <div className="flashcard-imagen-contenedor relative">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-2 rounded-full"
                          style={{
                            background:
                              'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)',
                          }}
                        />
                        <div
                          className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
                          style={{
                            filter: 'drop-shadow(0 8px 12px rgba(30,27,46,0.28))',
                          }}
                        >
                          <div
                            className="alimento-3d-wrapper w-full h-full pointer-events-none"
                            style={{
                              animationDelay: ['0s', '-1.5s', '-3.0s'][idx % 3],
                            }}
                          >
                            <FoodIllustration
                              foodId={card.foodId}
                              className="w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 xl:w-[270px] xl:h-[270px] max-w-full max-h-full object-contain pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>

                      <span className="flashcard-nombre">{card.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Navigation Arrow (▶) */}
              <button
                type="button"
                data-testid="next-round-btn"
                onClick={handleNextRound}
                aria-label={
                  currentRoundIdx < TOTAL_ROUNDS - 1
                    ? 'Siguiente ronda'
                    : 'Finalizar exploración de cartas'
                }
                title={
                  currentRoundIdx < TOTAL_ROUNDS - 1
                    ? 'Avanzar a la siguiente ronda'
                    : 'Finalizar exploración de cartas'
                }
                className="shrink-0 w-14 h-20 sm:w-16 sm:h-24 xl:w-[74px] xl:h-28 rounded-3xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] border-[3px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] flex items-center justify-center cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
              >
                <ArrowTriangleIcon direction="right" />
              </button>
            </div>

            {/* Clean Centered Bottom Prompt Banner */}
            <div className="shrink-0 flex justify-center px-2">
              <div
                data-testid="voting-banner"
                className="w-full max-w-4xl rounded-3xl bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_5px_0_#1E1B2E] px-6 py-3 sm:py-3.5 text-center"
              >
                <p className="text-base sm:text-lg xl:text-xl font-extrabold text-[#1E1B2E] leading-snug">
                  {VOTE_PROMPT}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ================= DETAIL VIEW: FOOD COLUMN + 2 WIDE HORIZONTAL CARDS ================= */
          <div
            key={selectedCard.id}
            data-testid="expanded-superpower-card"
            className="animate-detail-stage-enter vista-detalle-alimento w-full"
          >
            {/* LEFT PROTAGONIST COLUMN: Extra-Large Interactive 3D Food Illustration (No Glow) + Name */}
            <div className="detalle-columna-alimento">
              <InteractiveFood3DShowcase
                foodId={selectedCard.foodId}
                foodName={selectedCard.name}
              />

              <h2 className="font-display title-cartoon-outline mt-[-19px] text-4xl sm:text-5xl xl:text-[54px] font-bold text-[#1E1B2E] leading-none text-balance">
                {selectedCard.name}
              </h2>
            </div>

            {/* RIGHT STACKED AAA INTERACTIVE 3D CARDS */}
            <div className="detalle-tarjetas-horizontales">
              {/* CARD 1: SUPERPODER DEL ALIMENTO */}
              <InteractiveAAA3DCard
                variant="superpower"
                ariaLabel="Superpoder del alimento"
                eyebrow="Superpoder del Alimento"
                title={selectedCard.superpowerTitle}
                description={selectedCard.superpowerDesc}
                icon={<FloatingSuperpowerIcon />}
                enterDelayMs={40}
              />

              {/* CARD 2: TIP PRÁCTICO PARA LA CASA */}
              <InteractiveAAA3DCard
                variant="hometip"
                ariaLabel="Tip práctico para la casa"
                eyebrow="Tip Práctico para la Casa"
                title="Consejo para mamá y papá"
                description={selectedCard.familyTip}
                icon={<FloatingHomeTipIcon />}
                enterDelayMs={180}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
