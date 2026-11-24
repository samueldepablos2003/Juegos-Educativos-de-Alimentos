import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, Volume1, Volume2, VolumeX } from 'lucide-react';
import {
  playUiClickSound,
  setMasterVolume,
  stepMasterVolume,
  toggleSoundEnabled,
  unlockAudioEngine,
  useMasterVolume,
  useSoundEnabled,
} from '../utils/soundSystem';

interface SoundToggleButtonProps {
  size?: 'md' | 'lg';
  className?: string;
}

interface AnchorCoords {
  top: number;
  right?: number;
  left?: number;
}

export const SoundToggleButton: React.FC<SoundToggleButtonProps> = ({
  size = 'md',
  className = '',
}) => {
  const musicEnabled = useSoundEnabled();
  const musicVolume = useMasterVolume();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<AnchorCoords | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const volumePercent = Math.round(musicVolume * 100);
  const isMusicOff = !musicEnabled || volumePercent === 0;

  const updateAnchorCoords = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn || typeof window === 'undefined') return;
    const rect = btn.getBoundingClientRect();
    const top = Math.max(8, rect.top + rect.height / 2);
    // Open horizontally to the left whenever there is room; only flip right if anchored near the left edge
    if (rect.left >= 280) {
      setCoords({
        top,
        right: Math.max(12, window.innerWidth - rect.left + 10),
      });
    } else {
      setCoords({
        top,
        left: Math.max(12, rect.right + 10),
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateAnchorCoords();
  }, [open, updateAnchorCoords]);

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        buttonRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('resize', updateAnchorCoords);
    window.addEventListener('scroll', updateAnchorCoords, true);
    document.addEventListener('pointerdown', handleOutsidePointer);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', updateAnchorCoords);
      window.removeEventListener('scroll', updateAnchorCoords, true);
      document.removeEventListener('pointerdown', handleOutsidePointer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, updateAnchorCoords]);

  const handleTogglePopover = () => {
    unlockAudioEngine();
    setOpen((prev) => !prev);
    playUiClickSound(true);
  };

  const handleDecreaseVolume = () => {
    unlockAudioEngine();
    stepMasterVolume(-0.1);
    playUiClickSound(true);
  };

  const handleIncreaseVolume = () => {
    unlockAudioEngine();
    stepMasterVolume(0.1);
    playUiClickSound(true);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    unlockAudioEngine();
    const percent = Number(e.target.value);
    setMasterVolume(percent / 100);
  };

  const handleRangeCommitSound = () => {
    unlockAudioEngine();
    playUiClickSound(true);
  };

  const handleToggleMusic = () => {
    unlockAudioEngine();
    toggleSoundEnabled();
    playUiClickSound(true);
  };

  const paddingClass = size === 'lg' ? 'p-3' : 'p-2.5';
  const iconClass =
    size === 'lg'
      ? 'w-5 h-5 sm:w-6 sm:h-6 pointer-events-none'
      : 'w-5 h-5 pointer-events-none';

  const VolumeIcon = isMusicOff
    ? VolumeX
    : volumePercent <= 50
      ? Volume1
      : Volume2;

  const portalTarget =
    typeof document !== 'undefined'
      ? (document.fullscreenElement instanceof HTMLElement
          ? document.fullscreenElement
          : document.body)
      : null;

  const horizontalPopover =
    open && coords && portalTarget
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Control de música y volumen"
            data-testid="global-volume-popover"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              ...(coords.right !== undefined
                ? { right: `${coords.right}px` }
                : { left: `${coords.left ?? 12}px` }),
              transform: 'translateY(-50%)',
              zIndex: 9999,
            }}
            className="animate-volume-slide-left max-w-[calc(100vw-88px)] rounded-2xl bg-[#ffffff] border-[3.5px] border-[#1E1B2E] border-b-[6px] shadow-[0_12px_28px_rgba(30,27,46,0.28)] px-3 py-2 sm:px-3.5 sm:py-2 flex items-center gap-2 sm:gap-2.5"
          >
            {/* Yellow Music On / Off Button (App SFX always remain active) */}
            <button
              type="button"
              data-testid="global-mute-all-btn"
              aria-pressed={!isMusicOff}
              onClick={handleToggleMusic}
              aria-label={isMusicOff ? 'Prender música' : 'Apagar música'}
              title={isMusicOff ? 'Prender música' : 'Apagar música'}
              className="w-9 h-9 rounded-xl border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] active:translate-y-[2px] flex items-center justify-center shrink-0 cursor-pointer transition-[transform,background-color] duration-150 bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea]"
            >
              {isMusicOff ? (
                <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
            </button>

            {/* Decrease (−) */}
            <button
              type="button"
              data-testid="global-volume-down"
              onClick={handleDecreaseVolume}
              disabled={volumePercent <= 0}
              aria-label="Disminuir volumen de música"
              title="Bajar volumen"
              className={`w-9 h-9 rounded-xl border-2 border-[#1E1B2E] flex items-center justify-center shrink-0 transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                volumePercent <= 0
                  ? 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
                  : 'bg-[#FFFDF7] hover:bg-[#fee330] text-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] active:translate-y-[2px] cursor-pointer'
              }`}
            >
              <Minus className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            </button>

            {/* Horizontal Slider */}
            <div className="relative w-24 sm:w-32 md:w-36 flex items-center shrink-0">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={volumePercent}
                onChange={handleRangeChange}
                onPointerUp={handleRangeCommitSound}
                onKeyUp={handleRangeCommitSound}
                data-testid="global-volume-slider"
                aria-label="Ajustar volumen de música"
                aria-valuetext={`${volumePercent} por ciento`}
                style={{
                  background: `linear-gradient(90deg, #5dd118 0%, #8137ea ${volumePercent}%, #e2e8f0 ${volumePercent}%, #e2e8f0 100%)`,
                }}
                className="nutri-volume-slider w-full h-3 rounded-full border-2 border-[#1E1B2E] appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fee330]"
              />
            </div>

            {/* Increase (+) */}
            <button
              type="button"
              data-testid="global-volume-up"
              onClick={handleIncreaseVolume}
              disabled={volumePercent >= 100}
              aria-label="Aumentar volumen de música"
              title="Subir volumen"
              className={`w-9 h-9 rounded-xl border-2 border-[#1E1B2E] flex items-center justify-center shrink-0 transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] ${
                volumePercent >= 100
                  ? 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
                  : 'bg-[#FFFDF7] hover:bg-[#fee330] text-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] active:translate-y-[2px] cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            </button>

            {/* Live Percentage Readout */}
            <span
              data-testid="global-volume-percent"
              className="font-display text-sm sm:text-base font-bold text-[#8137ea] tabular-nums min-w-[40px] text-center shrink-0"
            >
              {volumePercent}%
            </span>
          </div>,
          portalTarget
        )
      : null;

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        data-testid="global-sound-toggle"
        onClick={handleTogglePopover}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          isMusicOff
            ? 'Control de música (música apagada)'
            : `Control de música (${volumePercent}%)`
        }
        title={
          isMusicOff
            ? 'Música apagada (tocar para prender o ajustar)'
            : `Música: ${volumePercent}% (tocar para ajustar)`
        }
        className={`${paddingClass} rounded-2xl border-2 border-[#1E1B2E] shadow-[0_4px_0_#1E1B2E] active:translate-y-[3px] flex items-center justify-center transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fee330] ${
          open
            ? 'bg-[#fee330] hover:bg-[#f5d81d] text-[#1E1B2E]'
            : !isMusicOff
              ? 'bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff]'
              : 'bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48]'
        } ${className}`}
      >
        <VolumeIcon className={iconClass} aria-hidden="true" />
      </button>

      {horizontalPopover}
    </div>
  );
};
