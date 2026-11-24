import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  LightningQuizIcon,
  NutriplatoIcon,
  SemaforoIcon,
  SuperpowerCardsIcon,
} from './MinigameIcons';
import { SoundToggleButton } from './SoundToggleButton';
import { playUiClickSound } from '../utils/soundSystem';

interface TitleScreenProps {
  isFullscreen: boolean;
  onStartGame: () => void;
  onStartSuperpower: () => void;
  onStartSemaforo: () => void;
  onStartLightning: () => void;
  onToggleFullscreen: () => void;
  onOpenVolunteer?: () => void;
}

const APP_TILES = [
  {
    id: 'nutriplato' as const,
    title: 'Nutriplato',
    ariaLabel: 'Abrir Nutriplato',
    dataStart: true,
    testId: undefined,
    Icon: NutriplatoIcon,
    maxLabelWidth: '',
  },
  {
    id: 'superpower' as const,
    title: 'Cartas del Superpoder',
    ariaLabel: 'Abrir Cartas del Superpoder',
    dataStart: false,
    testId: 'open-superpower-app',
    Icon: SuperpowerCardsIcon,
    maxLabelWidth: 'max-w-[290px]',
  },
  {
    id: 'semaforo' as const,
    title: 'El Semáforo',
    ariaLabel: 'Abrir El Semáforo',
    dataStart: false,
    testId: 'open-semaforo-app',
    Icon: SemaforoIcon,
    maxLabelWidth: '',
  },
  {
    id: 'lightning' as const,
    title: 'Cuestionario Relámpago',
    ariaLabel: 'Abrir Cuestionario Relámpago',
    dataStart: false,
    testId: 'open-lightning-app',
    Icon: LightningQuizIcon,
    maxLabelWidth: 'max-w-[290px]',
  },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  isFullscreen,
  onStartGame,
  onStartSuperpower,
  onStartSemaforo,
  onStartLightning,
  onToggleFullscreen,
}) => {
  const handlers = {
    nutriplato: onStartGame,
    superpower: onStartSuperpower,
    semaforo: onStartSemaforo,
    lightning: onStartLightning,
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#8bfffe] flex flex-col justify-between px-6 py-5 sm:px-10 sm:py-6 xl:px-14 xl:py-8">
      {/* Clean Minimal Top Header: Title Left + Icon-Only Fullscreen Button Right */}
      <header className="relative z-10 w-full flex items-center justify-between gap-4 shrink-0">
        <h1 className="font-display title-nutriplato-brand text-3xl sm:text-4xl xl:text-[42px] font-bold tracking-tight leading-none py-0.5">
          Biblioteca de Juegos
        </h1>

        <div className="flex items-center gap-2.5 shrink-0">
          <SoundToggleButton size="lg" />

          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={
              isFullscreen
                ? 'Salir de pantalla completa'
                : 'Pantalla completa para TV'
            }
            title={
              isFullscreen
                ? 'Salir de pantalla completa'
                : 'Pantalla Completa (TV)'
            }
            className={`p-3 rounded-2xl border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
              isFullscreen
                ? 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E]'
                : 'bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff]'
            }`}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Full-Width Protagonist App Store Shelf with Razor-Sharp Vector Icons (Pure GPU Hover) */}
      <section
        aria-label="Aplicaciones disponibles"
        className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center px-1 sm:px-2 xl:px-4"
      >
        <div className="w-full max-w-[1720px] grid grid-cols-2 lg:grid-cols-4 items-start justify-items-center gap-4 sm:gap-6 xl:gap-8">
          {APP_TILES.map((tile) => {
            const IconComponent = tile.Icon;
            return (
              <button
                key={tile.id}
                type="button"
                data-start={tile.dataStart ? 'true' : undefined}
                data-testid={tile.testId}
                onClick={() => {
                  playUiClickSound();
                  handlers[tile.id]();
                }}
                aria-label={tile.ariaLabel}
                className="group relative flex flex-col items-center gap-3 sm:gap-4 p-2 rounded-[44px] transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[10px] hover:scale-[1.04] active:translate-y-0 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
              >
                {/* Pre-computed soft luminous radial hover halo composited strictly via GPU opacity */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2.5 rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0) 68%)',
                  }}
                />

                {/* Razor-Sharp Vector Squircle Icon Tile */}
                <div
                  className={
                    tile.id === 'nutriplato'
                      ? 'relative z-10 w-[clamp(148px,min(20vw,42vh),320px)] h-[clamp(148px,min(20vw,42vh),320px)] overflow-visible select-none'
                      : 'relative z-10 w-[clamp(148px,min(20vw,42vh),320px)] h-[clamp(148px,min(20vw,42vh),320px)] rounded-[48px] xl:rounded-[56px] border-[5px] border-[#1E1B2E] shadow-[0_12px_0_#1E1B2E] overflow-hidden select-none'
                  }
                >
                  <IconComponent className="w-full h-full block pointer-events-none" />
                </div>

                <span
                  className={`relative z-10 font-display title-nutriplato-brand text-xl sm:text-2xl xl:text-[32px] font-bold tracking-tight leading-tight text-center ${tile.maxLabelWidth}`}
                >
                  {tile.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* High-Contrast Bottom Hint on #8bfffe */}
      <footer className="relative z-10 w-full text-center text-sm sm:text-base font-extrabold text-[#1E1B2E]/90 shrink-0 pb-1">
        Toca un ícono para abrir el juego · Presiona Enter para comenzar Nutriplato
      </footer>
    </main>
  );
};
