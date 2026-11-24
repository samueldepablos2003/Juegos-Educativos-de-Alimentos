import React, { useCallback, useEffect, useState } from 'react';
import {
  Gamepad2,
  Home,
  Maximize2,
  Minimize2,
  Play,
} from 'lucide-react';
import { TutorialSlideItem } from '../data/minigameTutorials';
import { FoodIllustration } from './FoodIllustration';
import { SoundToggleButton } from './SoundToggleButton';
import { playTutorialStepSound, playUiClickSound } from '../utils/soundSystem';

interface MinigameTutorialScreenProps {
  gameTitle: string;
  slides: TutorialSlideItem[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onBackToLibrary: () => void;
  onFinishTutorial: () => void;
  ctaLabel?: string;
  onOpenModeSelector?: () => void;
  testId?: string;
}

export const MinigameTutorialScreen: React.FC<MinigameTutorialScreenProps> = ({
  gameTitle,
  slides,
  isFullscreen,
  onToggleFullscreen,
  onBackToLibrary,
  onFinishTutorial,
  ctaLabel = '¡Entendido, a Jugar!',
  onOpenModeSelector,
  testId = 'minigame-tutorial-screen',
}) => {
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const safeIdx = Math.min(slides.length - 1, Math.max(0, slideIdx));
  const activeSlide = slides[safeIdx];
  const isFirst = safeIdx === 0;
  const isLast = safeIdx === slides.length - 1;

  const navigateSlide = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= slides.length || targetIdx === safeIdx) {
        return;
      }
      playTutorialStepSound();
      setDirection(targetIdx > safeIdx ? 'next' : 'prev');
      setSlideIdx(targetIdx);
    },
    [slides.length, safeIdx]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSlide(safeIdx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateSlide(safeIdx - 1);
      } else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        onFinishTutorial();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigateSlide, safeIdx, onFinishTutorial]);

  if (!activeSlide) return null;

  return (
    <div
      data-testid={testId}
      className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between px-4 py-3 sm:px-7 sm:py-4 xl:px-10 xl:py-5 gap-3 sm:gap-4"
    >
      {/* Clean Header Matching El Semáforo Interactive Guide */}
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
            {gameTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenModeSelector && (
            <button
              type="button"
              data-testid="tutorial-mode-btn"
              onClick={() => {
                playUiClickSound();
                onOpenModeSelector();
              }}
              className="font-display px-4 py-2 rounded-2xl bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] text-sm sm:text-base font-bold border-[2.5px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
            >
              <Gamepad2 className="w-5 h-5 text-[#8137ea] shrink-0" aria-hidden="true" />
              <span>Modo de Juego</span>
            </button>
          )}

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

      {/* Expanded Carousel Stage: [◀] + [Hero Tutorial Card] + [▶] */}
      <main className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-between gap-3 sm:gap-5 xl:gap-8">
        {/* Left Navigation Arrow */}
        <button
          type="button"
          data-testid="tutorial-prev-btn"
          onClick={() => navigateSlide(safeIdx - 1)}
          disabled={isFirst}
          aria-label="Diapositiva anterior"
          title={isFirst ? 'Primera diapositiva' : 'Anterior'}
          className={`shrink-0 w-12 h-18 sm:w-16 sm:h-24 xl:w-[76px] xl:h-28 rounded-3xl border-[3.5px] border-[#1E1B2E] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
            isFirst
              ? 'bg-[#ffffff]/65 text-[#1E1B2E]/25 shadow-[0_3px_0_#1E1B2E] opacity-45 cursor-not-allowed'
              : 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] cursor-pointer hover:scale-105'
          }`}
        >
          <svg viewBox="0 0 36 36" className="w-8 h-8 sm:w-9 sm:h-9 rotate-180" aria-hidden="true">
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

        {/* Hero Presentation Card (Matched to El Semáforo Fullscreen Scale) */}
        <div className="relative flex-1 min-w-0 h-full max-h-[760px] max-w-[1460px] mx-auto">
          <article
            key={activeSlide.id}
            style={{ background: activeSlide.bodyGradient }}
            className={`w-full h-full rounded-[40px] border-[4.5px] border-[#1E1B2E] border-b-[12px] shadow-[0_14px_0_rgba(30,27,46,0.24)] overflow-hidden flex flex-col ${
              direction === 'next'
                ? 'animate-guide-slide-in-right'
                : 'animate-guide-slide-in-left'
            }`}
          >
            {/* Vibrant Solid Header Ribbon */}
            <div
              className="relative w-full px-6 py-4 sm:px-9 sm:py-5 xl:px-11 xl:py-5 border-b-[4.5px] border-[#1E1B2E] flex items-center justify-between gap-4 shrink-0 overflow-hidden"
              style={{ background: activeSlide.headerGradient }}
            >
              {/* Glossy Top Specular Bar */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-1.5 h-3.5 rounded-full bg-[#ffffff]/25"
              />

              <div className="relative z-10 flex items-center gap-4 sm:gap-5 min-w-0">
                <div
                  aria-hidden="true"
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-[70px] xl:h-[70px] rounded-2xl bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] flex items-center justify-center text-3xl sm:text-4xl shrink-0"
                >
                  {activeSlide.badgeEmoji}
                </div>
                <div className="min-w-0">
                  <h2
                    className="font-display text-3xl sm:text-4xl xl:text-[44px] font-bold leading-none truncate"
                    style={{
                      color: activeSlide.textOnHeader,
                      textShadow:
                        activeSlide.textOnHeader === '#ffffff'
                          ? '0 3px 0 #1E1B2E'
                          : 'none',
                    }}
                  >
                    {activeSlide.headerTitle}
                  </h2>
                  <p
                    className="text-base sm:text-lg xl:text-[22px] font-black leading-snug mt-1 truncate"
                    style={{
                      color:
                        activeSlide.textOnHeader === '#ffffff'
                          ? 'rgba(255,255,255,0.96)'
                          : '#1E1B2E',
                    }}
                  >
                    {activeSlide.headerSubtitle}
                  </p>
                </div>
              </div>

              {/* Clean Slide Counter */}
              <span className="relative z-10 font-display px-4 py-2 rounded-2xl bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] text-base sm:text-lg xl:text-xl font-bold text-[#1E1B2E] tabular-nums shrink-0">
                {safeIdx + 1} / {slides.length}
              </span>
            </div>

            {/* Two-Column Story Stage: Enlarged Copy Left + Prominent 3D Animated Food Showcase Right */}
            <div className="relative flex-1 min-h-0 px-6 py-4 sm:px-10 sm:py-5 xl:px-12 xl:py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(290px,0.92fr)] gap-5 sm:gap-8 xl:gap-10 items-center overflow-hidden">
              {/* Subtle comic dot halftone corner */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 bottom-0 w-72 h-44 opacity-80"
                style={{
                  backgroundImage: activeSlide.dotPattern,
                  backgroundSize: '14px 14px',
                  maskImage:
                    'radial-gradient(circle at 0% 100%, black 25%, transparent 72%)',
                  WebkitMaskImage:
                    'radial-gradient(circle at 0% 100%, black 25%, transparent 72%)',
                }}
              />

              {/* Left Column: Accent Bar + Commanding Headline + Classroom-Scale Description */}
              <div className="relative z-10 flex flex-col justify-center gap-4 sm:gap-5 min-w-0 min-h-0 py-1">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-3 sm:w-3.5 h-10 sm:h-12 xl:h-14 rounded-full border-[2.5px] border-[#1E1B2E] shrink-0"
                    style={{ backgroundColor: activeSlide.accentBarBg }}
                  />
                  <h3
                    className="font-display text-3xl sm:text-4xl xl:text-[clamp(34px,3vw,46px)] font-bold leading-[1.12] tracking-tight text-balance"
                    style={{ color: activeSlide.titleColor }}
                  >
                    {activeSlide.headline}
                  </h3>
                </div>

                <p className="text-lg sm:text-2xl xl:text-[clamp(23px,2.05vw,31px)] font-extrabold text-[#1E1B2E]/92 leading-[1.42] pl-0.5">
                  {activeSlide.description}
                </p>
              </div>

              {/* Right Column: Prominent Large 3D Animated Food Showcase with Protected Caption Space */}
              <div className="relative z-10 w-full h-full min-h-0 flex flex-col items-center justify-center gap-2 py-1">
                <div className="relative flex items-center justify-center w-[clamp(210px,min(33vw,47vh),430px)] h-[clamp(210px,min(33vw,47vh),430px)] max-w-full max-h-[calc(100%_-_52px)] shrink-0">
                  {/* Soft Grounded Radial Shadow */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-1 w-[64%] h-5 rounded-full"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(30,27,46,0.16) 0%, rgba(30,27,46,0) 72%)',
                    }}
                  />
                  <div className="alimento-3d-wrapper relative z-10 w-full h-full">
                    <FoodIllustration
                      foodId={activeSlide.foodId}
                      className="w-full h-full object-contain drop-shadow-[0_14px_18px_rgba(30,27,46,0.22)] pointer-events-none"
                    />
                  </div>
                </div>
                <span
                  className="font-display text-xl sm:text-2xl xl:text-[28px] font-bold text-center leading-tight tracking-tight shrink-0"
                  style={{
                    color: activeSlide.titleColor,
                    textShadow: '0 2px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  {activeSlide.foodCaption}
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          data-testid="tutorial-next-btn"
          onClick={() => navigateSlide(safeIdx + 1)}
          disabled={isLast}
          aria-label="Siguiente diapositiva"
          title={isLast ? 'Última diapositiva' : 'Siguiente'}
          className={`shrink-0 w-12 h-18 sm:w-16 sm:h-24 xl:w-[76px] xl:h-28 rounded-3xl border-[3.5px] border-[#1E1B2E] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
            isLast
              ? 'bg-[#ffffff]/65 text-[#1E1B2E]/25 shadow-[0_3px_0_#1E1B2E] opacity-45 cursor-not-allowed'
              : 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] cursor-pointer hover:scale-105'
          }`}
        >
          <svg viewBox="0 0 36 36" className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true">
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

      {/* Bottom Bar: Interactive Slide Dots + Primary Emerald CTA */}
      <footer className="relative z-10 w-full flex flex-col items-center justify-center gap-2 shrink-0 pb-0.5">
        <div
          className="flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Pasos del instructivo"
        >
          {slides.map((s, idx) => {
            const active = idx === safeIdx;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Paso ${idx + 1}: ${s.headerTitle}`}
                onClick={() => navigateSlide(idx)}
                className={`h-3 rounded-full border-2 border-[#1E1B2E] cursor-pointer transition-[width,background-color] duration-200 ${
                  active
                    ? 'w-9 bg-[#8137ea]'
                    : 'w-3 bg-[#ffffff] hover:bg-[#fee330]'
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          data-testid="tutorial-start-btn"
          onClick={() => {
            playUiClickSound();
            onFinishTutorial();
          }}
          className="font-display py-3 px-10 rounded-2xl bg-[#5dd118] hover:bg-[#52be12] text-[#ffffff] text-xl sm:text-2xl font-bold border-[3.5px] border-[#1E1B2E] shadow-[0_6px_0_#1E1B2E] active:translate-y-[4px] flex items-center gap-3 cursor-pointer whitespace-nowrap transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
        >
          <span>{ctaLabel}</span>
          <Play className="w-6 h-6 fill-current" aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
};
