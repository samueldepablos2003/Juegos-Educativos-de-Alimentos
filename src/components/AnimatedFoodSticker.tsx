import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { FoodIllustration } from './FoodIllustration';

export type FoodStickerState = 'idle' | 'dragging' | 'placed';

interface AnimatedFoodStickerProps {
  foodId: string;
  className?: string;
  artStyle?: React.CSSProperties;
  state?: FoodStickerState;
  isSelected?: boolean;
  isPaused?: boolean;
  showPlacedBadge?: boolean;
  badgeClassName?: string;
  animationDelay?: string;
}

export const AnimatedFoodSticker: React.FC<AnimatedFoodStickerProps> = memo(
  ({
    foodId,
    className = 'w-16 h-16',
    artStyle,
    state = 'idle',
    isSelected = false,
    isPaused = false,
    showPlacedBadge = false,
    badgeClassName = 'top-1 right-1 w-7 h-7',
    animationDelay,
  }) => {
    const isDraggingState = state === 'dragging' || isSelected;
    const isPlacedState = state === 'placed';
    const shouldPause3D = state === 'dragging' || isPaused;

    const outerMotionClass = isDraggingState
      ? 'food-dragging'
      : isPlacedState
        ? 'animate-drop-bounce'
        : '';

    return (
      <div className="relative inline-flex items-center justify-center pointer-events-none">
        {showPlacedBadge && (
          <span
            className={`animate-placed-badge-pop absolute z-20 rounded-full bg-[#5dd118] border-2 border-[#1E1B2E] text-[#ffffff] flex items-center justify-center shadow-[0_3px_0_#1E1B2E] pointer-events-none ${badgeClassName}`}
            aria-hidden="true"
          >
            <Check className="w-4 h-4 stroke-[3.2] pointer-events-none" />
          </span>
        )}

        <div
          className={`food-art-wrap relative z-10 flex items-center justify-center shrink-0 pointer-events-none ${outerMotionClass}`}
        >
          <div
            className={`alimento-3d-wrapper pointer-events-none ${
              shouldPause3D ? 'arrastrando' : ''
            }`}
            style={animationDelay ? { animationDelay } : undefined}
          >
            <FoodIllustration foodId={foodId} className={className} style={artStyle} />
          </div>
        </div>
      </div>
    );
  }
);

AnimatedFoodSticker.displayName = 'AnimatedFoodSticker';
