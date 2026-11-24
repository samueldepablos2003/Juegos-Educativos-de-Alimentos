import React, { memo, useId } from 'react';
import { renderProduceArt } from './art/produceSvg';
import { renderMainsAndDrinksArt } from './art/mainsAndDrinksSvg';
import { ProcessedFoodImage } from './ProcessedFoodImage';
import { FOOD_IMAGE_ASSETS } from '../utils/imagePreloader';

interface FoodIllustrationProps {
  foodId: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FoodIllustration: React.FC<FoodIllustrationProps> = memo(
  ({ foodId, className = 'w-16 h-16', style }) => {
    const rawId = useId();
    const uid = rawId.replace(/:/g, '');

    const asset = FOOD_IMAGE_ASSETS[foodId];
    if (asset) {
      return (
        <ProcessedFoodImage
          src={asset.src}
          alt={asset.alt}
          className={className}
          style={style}
        />
      );
    }

    return (
      <svg
        viewBox="0 0 100 100"
        shapeRendering="geometricPrecision"
        style={style}
        className={`pointer-events-none ${className}`}
        aria-hidden="true"
        focusable="false"
      >
        {renderProduceArt(foodId, uid) ?? renderMainsAndDrinksArt(foodId, uid)}
      </svg>
    );
  }
);

FoodIllustration.displayName = 'FoodIllustration';
